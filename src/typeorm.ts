// src/data-source.ts
import { DataSource } from "typeorm";
import { Customer } from "./typeorm/Customer";
import { Order } from "./typeorm/Order";
import { Address } from "./typeorm/Address";
import { Product } from "./typeorm/Product";
import prepare from "./lib/prepare";
import measure from "./lib/measure";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./prisma/dev.db",
  synchronize: true,
  logging: false,
  entities: [Customer, Order, Address, Product],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {

    console.log(`typeorm benchmark`)
    await prepare();

    /**
     * findMany
     */
    await measure("typeorm-findMany", AppDataSource.getRepository(Customer).find());

    await measure(
      "typeorm-findMany-filter-paginate-order",
      AppDataSource.getRepository(Customer).find({
        where: { isActive: true },
        order: { createdAt: "DESC" },
        skip: 0,
        take: 10,
      })
    );

    await measure(
      "typeorm-findMany-1-level-nesting",
      AppDataSource.getRepository(Customer).find({ relations: ["orders"] })
    );

    /**
     * findFirst
     */
    await measure("typeorm-findFirst", AppDataSource.getRepository(Customer).findOne({}));

    await measure(
      "typeorm-findFirst-1-level-nesting",
      AppDataSource.getRepository(Customer).findOne({ relations: ["orders"] })
    );

    /**
     * findUnique
     */
    await measure("typeorm-findUnique", AppDataSource.getRepository(Customer).findOne({ where: { id: 1 } }));

    await measure(
      "typeorm-findUnique-1-level-nesting",
      AppDataSource.getRepository(Customer).findOne({
        where: { id: 1 },
        relations: ["orders"],
      })
    );

    /**
     * create
     */
    await measure(
      "typeorm-create",
      AppDataSource.getRepository(Customer).save({
        name: "John Doe",
        email: new Date() + "@example.com",
        isActive: false,
      })
    );

    const nestedCreate = AppDataSource.transaction(async (transactionalEntityManager) => {
      // Insert customer
      const customer = await transactionalEntityManager.save(Customer, {
        name: "John Doe",
        email: new Date() + "@example.com",
        isActive: false,
      });

      // Insert order with the associated customerId
      const order = await transactionalEntityManager.save(Order, {
        customer: customer,
        date: new Date(),
        totalAmount: 100.5,
      });

      // Insert products with the associated orderId
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into("_OrderProducts")
        .values([
          { A: order.id, B: 1 },
          { A: order.id, B: 2 },
        ])
        .execute();
    });
    await measure("typeorm-nested-create", nestedCreate);

    /**
     * update
     */
    await measure(
      "typeorm-update",
      AppDataSource.getRepository(Customer).update({ id: 1 }, { name: "John Doe Updated" })
    );

    await measure(
      "typeorm-nested-update",
      AppDataSource.transaction(async (transactionalEntityManager) => {
        // Update customer name
        await transactionalEntityManager.update(Customer, { id: 1 }, { name: "John Doe Updated" });

        // Update address
        await transactionalEntityManager.update(Address, { customer: { id: 1 } }, { street: "456 New St" });
      })
    );

    /**
     * upsert
     */
    await measure(
      "typeorm-upsert",
      AppDataSource.getRepository(Customer).save({
        id: 1,
        name: "John Doe Upserted",
        email: "john.doe@example.com",
        isActive: false,
      })
    );

    const nestedUpsert = AppDataSource.transaction(async (transactionalEntityManager) => {
      // Update customer name
      const customer = await transactionalEntityManager.save(Customer, {
        id: 1,
        name: "John Doe Upserted",
        email: "john.doe@example.com",
        isActive: false,
      });

      // Update address
      await transactionalEntityManager.save(Address, {
        customer: customer,
        street: "456 New St",
        city: "Anytown",
        postalCode: "12345",
        country: "Country",
      });
    });
    await measure("typeorm-nested-upsert", nestedUpsert);

    /**
     * delete
     */
    await measure("typeorm-delete", AppDataSource.getRepository(Customer).delete({ id: 1 }));

    await AppDataSource.destroy();
  })
  .catch((error) => console.log(error));
