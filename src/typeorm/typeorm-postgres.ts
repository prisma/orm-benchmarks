import { DataSource } from "typeorm";
import { Customer } from "./entities/Customer";
import { Order } from "./entities/Order";
import { Address } from "./entities/Address";
import { Product } from "./entities/Product";
import measure from "../lib/measure";
import { QueryResult } from "../lib/types";

export async function typeormPg(databaseUrl: string): Promise<QueryResult[]> {
  const AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl,
    logging: false,
    entities: [Customer, Order, Address, Product],
    ssl: databaseUrl.includes("localhost") ? undefined : { rejectUnauthorized: false },
  });

  console.log(`Run typeorm benchmarks: `, databaseUrl);

  await AppDataSource.initialize();
  // await prepare();

  const results: QueryResult[] = [];

  /**
   * findMany
   */
  results.push(await measure("typeorm-findMany", AppDataSource.getRepository(Customer).find()));

  results.push(
    await measure(
      "typeorm-findMany-filter-paginate-order",
      AppDataSource.getRepository(Customer).find({
        where: { isActive: true },
        order: { createdAt: "DESC" },
        skip: 0,
        take: 10,
      })
    )
  );

  results.push(
    await measure(
      "typeorm-findMany-1-level-nesting",
      AppDataSource.getRepository(Customer).find({ relations: ["orders"] })
    )
  );

  /**
   * findFirst
   */

  results.push(
    await measure(
      // not using `findOne()` because of:
      // Error: You must provide selection conditions in order to find a single row.
      "typeorm-findFirst",
      AppDataSource.getRepository(Customer).find({
        take: 1
      })
    )
  );

  results.push(
    await measure(
      // not using `findOne({ relations: ["orders"] })` because of:
      // Error: You must provide selection conditions in order to find a single row.
      "typeorm-findFirst-1-level-nesting",
      AppDataSource.getRepository(Customer).find({
        take: 1,
        relations: ["orders"],
      })
    )
  );

  /**
   * findUnique
   */
  results.push(
    await measure("typeorm-findUnique", AppDataSource.getRepository(Customer).findOne({ where: { id: 1 } }))
  );

  results.push(
    await measure(
      "typeorm-findUnique-1-level-nesting",
      AppDataSource.getRepository(Customer).findOne({
        where: { id: 1 },
        relations: ["orders"],
      })
    )
  );

  /**
   * create
   */
  results.push(
    await measure(
      "typeorm-create",
      AppDataSource.getRepository(Customer).save({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: false,
      })
    )
  );

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
  results.push(await measure("typeorm-nested-create", nestedCreate));

  /**
   * update
   */
  results.push(
    await measure(
      "typeorm-update",
      AppDataSource
        .getRepository(Customer)
        .update(
          { id: 1 }, 
          { name: "John Doe Updated" }
        )
    )
  );

  results.push(
    await measure(
      "typeorm-nested-update",
      AppDataSource.transaction(async (transactionalEntityManager) => {
        // Update customer name
        await transactionalEntityManager
          .update(Customer, { id: 1 }, { name: "John Doe Updated" });

        // Update address
        await transactionalEntityManager
          .update(Address, { customer: { id: 1 } }, { street: "456 New St" });
      })
    )
  );

  /**
   * upsert
   */
  results.push(
    await measure(
      "typeorm-upsert",
      AppDataSource
        .getRepository(Customer)
        .save({
          id: 1,
          name: "John Doe Upserted",
          email: "john.doe@example.com",
          isActive: false,
      })
    )
  );

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
  results.push(await measure(
    "typeorm-delete", 
    AppDataSource.getRepository(Customer).delete({ id: 1 }))
  );

  await AppDataSource.destroy();

  return results;
}

// export async function closeTypeORMPg() {
//   console.log(`closing connection with TypeORM`);
//   await AppDataSource.destroy();
// }
// main().catch((error) => console.log(error));
