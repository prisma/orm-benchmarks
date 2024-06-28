import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { Customer, Order, Address } from "./drizzle/schema";
import * as schema from "./drizzle/schema";
import * as relations from "./drizzle/relations";
import { eq, desc } from "drizzle-orm";
import prepare from "./lib/prepare";
import measure from "./lib/measure";

const sqlite = new Database("./prisma/dev.db");

export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });

async function main() {
  await prepare();

  /**
   * findMany
   */

  await measure("drizzle-findMany", db.query.Customer.findMany());

  await measure(
    "drizzle-findMany-filter-paginate-order",
    db.query.Customer.findMany({
      where: eq(Customer.isActive, "1"),
      orderBy: [desc(Customer.createdAt)],
      offset: 0,
      limit: 10,
    })
  );

  await measure(
    "drizzle-findMany-1-level-nesting",
    db.query.Customer.findMany({
      with: {
        Orders: true,
      },
    })
  );

  /**
   * findFirst
   */

  await measure("drizzle-findFirst", db.query.Customer.findFirst());

  await measure(
    "drizzle-findFirst-1-level-nesting",
    db.query.Customer.findFirst({
      with: {
        Orders: true,
      },
    })
  );

  /**
   * findFirstOrThrow
   */

  // await measure("drizzle-findFirstOrThrow", prisma.customer.findFirstOrThrow());

  // await measure(
  //   "drizzle-findFirstOrThrow-1-level-nesting",
  //   prisma.customer.findFirstOrThrow({
  //     include: {
  //       orders: true,
  //     },
  //   })
  // );

  /**
   * findUnique
   */

  await measure(
    "drizzle-findUnique",
    db.query.Customer.findFirst({
      where: eq(Customer.id, 1),
    })
  );

  await measure(
    "drizzle-findUnique-1-level-nesting",
    db.query.Customer.findFirst({
      where: eq(Customer.id, 1),
      with: {
        Orders: true,
      },
    })
  );

  // /**
  //  * findUniqueOrThrow
  //  */

  // await measure(
  //   "drizzle-findUniqueOrThrow",
  //   prisma.customer.findUniqueOrThrow({
  //     where: { id: 1 },
  //   })
  // );

  // await measure(
  //   "drizzle-findUniqueOrThrow-1-level-nesting",
  //   prisma.customer.findUniqueOrThrow({
  //     where: { id: 1 },
  //     include: {
  //       orders: true,
  //     },
  //   })
  // );

  /**
   * create
   */

  await measure(
    "drizzle-create",
    db
      .insert(Customer)
      .values({
        name: "John Doe",
        email: new Date() + "@example.com",
        isActive: "false",
      })
      .returning()
  );

  const nestedCreate = db.transaction(async (trx) => {
    // Insert customer
    const customer = await trx
      .insert(Customer)
      .values({
        name: "John Doe",
        email: new Date() + "@example.com",
        isActive: "false",
      })
      .returning();

    const customerId = customer[0].id;

    // Insert order with the associated customerId
    const insertedOrder = await trx
      .insert(Order)
      .values({
        customerId: customerId,
        date: `${new Date()}`,
        totalAmount: "100.5",
      })
      .returning();

    const orderId = insertedOrder[0].id;

    // Insert products with the associated orderId
    await trx.insert(schema._OrderProducts).values([
      {
        A: orderId,
        B: 1,
      },
      {
        A: orderId,
        B: 2,
      },
    ]);
  });
  await measure("drizzle-nested-create", nestedCreate);

  /**
   * update
   */

  await measure("drizzle-update", db.update(Customer).set({ name: "John Doe Updated" }).where(eq(Customer.id, 1)));

  await measure(
    "drizzle-nested-update",
    db.transaction(async (trx) => {
      // Update customer name
      await trx.update(Customer).set({ name: "John Doe Updated" }).where(eq(Customer.id, 1));

      // Update address
      await trx
        .update(Address)
        .set({
          street: "456 New St",
        })
        .where(eq(Address.customerId, 1));
    })
  );

  /**
   * upsert
   */
  await measure(
    "drizzle-upsert",
    db
      .insert(Customer)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: "false",
      })
      .onConflictDoUpdate({
        target: Customer.id,
        set: { name: "John Doe Upserted" },
      })
  );

  const nestedUpsert = db.transaction(async (trx) => {
    // Update customer name
    const customer = await trx
      .insert(Customer)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: "false",
      })
      .onConflictDoUpdate({
        target: Customer.id,
        set: { name: "John Doe Upserted" },
      })
      .returning();
    const customerId = customer[0].id;

    // Update address
    await trx
      .insert(Address)
      .values({
        street: "456 New St",
        city: "Anytown",
        postalCode: "12345",
        country: "Country",
        customerId: customerId,
      })
      .onConflictDoUpdate({
        target: Address.id,
        set: { street: "456 New St" },
      });
  });
  await measure("drizzle-nested-upsert", nestedUpsert);

  /**
   * delete
   */

  await measure("drizzle-delete", db.delete(Customer).where(eq(Customer.id, 1)));

  /**
   * createMany
   */

  // const _customersToCreate: Prisma.CustomerCreateInput[] = [];

  // for (let i = 0; i < 1000; i++) {
  //   _customersToCreate.push({
  //     name: `Customer ${i}`,
  //     email: `customer${i}@example.com`,
  //   });
  // }

  // await measure(
  //   "drizzle-createMany",
  //   prisma.customer.createMany({
  //     data: _customersToCreate,
  //   })
  // );

  /**
   * createManyAndReturn
   */

  // await measure(
  //   "drizzle-createManyAndReturn",
  //   prisma.customer.createManyAndReturn({
  //     data: _customersToCreate,
  //   })
  // );

  /**
   * updateMany
   */

  // await measure(
  //   "drizzle-updateMany",
  //   prisma.customer.updateMany({
  //     where: { isActive: false },
  //     data: { isActive: true },
  //   })
  // );

  /**
   * deleteMany
   */

  // await measure(
  //   "drizzle-deleteMany",
  //   prisma.customer.deleteMany({
  //     where: { isActive: false },
  //   })
  // );

  /**
   * aggregate
   */

  // await measure(
  //   "drizzle-aggregate",
  //   prisma.order.aggregate({
  //     _sum: {
  //       totalAmount: true,
  //     },
  //   })
  // );

  /**
   * groupBy
   */

  // await measure(
  //   "drizzle-groupBy",
  //   prisma.order.groupBy({
  //     by: ["customerId"],
  //     _sum: {
  //       totalAmount: true,
  //     },
  //     _count: {
  //       _all: true,
  //     },
  //   })
  // );
}

main();
