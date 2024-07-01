import { DataSource } from "typeorm";
import { Customer } from "./typeorm/Customer";
import { Order } from "./typeorm/Order";
import { Address } from "./typeorm/Address";
import { Product } from "./typeorm/Product";
import measure from "./lib/measure";

const connectionString = process.env.DATABASE_URL || "postgresql://nikolasburk:nikolasburk@localhost:5432/benchmark";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: connectionString,
  logging: false,
  entities: [Customer, Order, Address, Product],
});

console.log(`run typeorm benchmarks against DB: `, connectionString)

export async function typeormPg() {
  await AppDataSource.initialize();
  // await prepare();

  const results = [];

  /**
   * findMany
   */
  results.push(await measure("typeorm-findMany", AppDataSource.getRepository(Customer).find()));

  results.push(await measure(
    "typeorm-findMany-filter-paginate-order",
    AppDataSource.getRepository(Customer).find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      skip: 0,
      take: 10,
    })
  ));

  results.push(await measure(
    "typeorm-findMany-1-level-nesting",
    AppDataSource.getRepository(Customer).find({ relations: ["orders"] })
  ));

  /**
   * findFirst
   */
  results.push(await measure(
    "typeorm-findFirst",
    AppDataSource.getRepository(Customer).find({
      take: 1,
    })
  ));

  results.push(await measure(
    "typeorm-findFirst-1-level-nesting",
    AppDataSource.getRepository(Customer).find({
      take: 1,
      relations: ["orders"],
    })
  ));

  /**
   * findUnique
   */
  results.push(await measure("typeorm-findUnique", AppDataSource.getRepository(Customer).findOne({ where: { id: 1 } })));

  results.push(await measure(
    "typeorm-findUnique-1-level-nesting",
    AppDataSource.getRepository(Customer).findOne({
      where: { id: 1 },
      relations: ["orders"],
    })
  ));

  /**
   * create
   */
  results.push(await measure(
    "typeorm-create",
    AppDataSource.getRepository(Customer).save({
      name: "John Doe",
      email: new Date() + "@example.com",
      isActive: false,
    })
  ));

  const nestedCreate = AppDataSource.transaction(async (transactionalEntityManager) => {
    // Insert customer
    const customer = await transactionalEntityManager.save(Customer, {
      name: "John Doe",
      email: "john.doe@example.com",
      isActive: false,
    });

    // Insert order with the associated customerId
    const order = await transactionalEntityManager.save(Order, {
      customer: customer,
      date: new Date(),
      totalAmount: 100.5,
    });

    // Insert products with the associated orderId
    // await transactionalEntityManager
    //   .createQueryBuilder()
    //   .insert()
    //   .into("_OrderProducts")
    //   .values([
    //     { A: order.id, B: 1 },
    //     { A: order.id, B: 2 },
    //   ])
    //   .execute();
  });
  results.push(await measure("typeorm-nested-create", nestedCreate));

  /**
   * update
   */
  results.push(await measure(
    "typeorm-update",
    AppDataSource.getRepository(Customer).update({ id: 1 }, { name: "John Doe Updated" })
  ));

  results.push(await measure(
    "typeorm-nested-update",
    AppDataSource.transaction(async (transactionalEntityManager) => {
      // Update customer name
      await transactionalEntityManager.update(Customer, { id: 1 }, { name: "John Doe Updated" });

      // Update address
      await transactionalEntityManager.update(Address, { customer: { id: 1 } }, { street: "456 New St" });
    })
  ));

  /**
   * upsert
   */
  results.push(await measure(
    "typeorm-upsert",
    AppDataSource.getRepository(Customer).save({
      id: 1,
      name: "John Doe Upserted",
      email: "john.doe@example.com",
      isActive: false,
    })
  ));

  // Nested upsert operation using transaction
  const nestedUpsert = AppDataSource.transaction(async (transactionalEntityManager) => {
    // Upsert Customer
    const customer = await transactionalEntityManager.save(Customer, {
      id: 1, // Set the ID if you want to update an existing record
      name: "John Doe Upserted",
      email: "john.doe@example.com",
      isActive: false,
    });

    // Upsert Address
    await transactionalEntityManager.save(Address, {
      id: 1, // Set the ID if you want to update an existing record
      customer: customer,
      street: "456 New St",
      city: "Anytown",
      postalCode: "12345",
      country: "Country",
    });
  });
  results.push(await measure("typeorm-nested-upsert", nestedUpsert));

  /**
   * delete
   */
  results.push(await measure("typeorm-delete", AppDataSource.getRepository(Customer).delete({ id: 1 })));

  await AppDataSource.destroy();

  return results;
}

// main().catch((error) => console.log(error));
