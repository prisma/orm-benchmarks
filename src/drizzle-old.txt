import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { Customer } from "./drizzle/schema";
import * as schema from "./drizzle/schema";
import * as relations from "./drizzle/relations";
import { bench, describe } from "vitest";
import { eq, desc, gt } from "drizzle-orm";

const sqlite = new Database("./prisma/dev.db");

export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });

describe("drizzle-orm", () => {
  /**
   * findMany
   */

  bench("findMany-base", async () => {
    // const customersData = await db.select().from(Customer).execute();
    const customersData = await db.query.Customer.findMany();
    console.log(`customers:`, customersData.length);
  });

  bench("findMany-filters-ordering-pagination", async () => {
    const customersWithOptions = await db.query.Customer.findMany({
      where: eq(Customer.isActive, "1"),
      orderBy: [desc(Customer.createdAt)],
      offset: 0,
      limit: 10,
    });
    console.log(`customersWithOptions:`, customersWithOptions.length);
  });

  bench("findMany-1-level-nesting", async () => {
    const customersWithOrders = await db.query.Customer.findMany({
      with: {
        Orders: true,
      },
    });
    console.log(`customersWithOptions:`, customersWithOrders.length);
  });

  bench("findMany-2-level-nesting", async () => {
    const customersWithOrdersAndProducts = await db.query.Customer.findMany({
      with: {
        Orders: {
          with: {
            _OrderProducts: true,
          },
        },
      },
    });
    console.log(`customersWithOrdersAndProducts:`, customersWithOrdersAndProducts.length);
  });

  bench("findMany-relation-filters", async () => {
    const customersWithLargeOrders = await db
      .select()
      .from(Customer)
      .leftJoin(schema.Order, eq(Customer.id, schema.Order.customerId))
      .where(gt(schema.Order.totalAmount, "100"))
      .execute();
    console.log(`customersWithLargeOrders:`, customersWithLargeOrders.length);
  });

  /**
   * findFirst
   */

  bench("findFirst-base", async () => {
    const firstCustomer = await db.query.Customer.findFirst();
    console.log(`firstCustomer:`, firstCustomer);
  });

  // bench("findFirst-1-level-nesting", async () => {
  //   const firstCustomerWithOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id)),
  //     })
  //     .limit(1)
  //     .execute();
  //   console.log(`firstCustomerWithOrders:`, firstCustomerWithOrders.length);
  // });

  // bench("findFirst-2-level-nesting", async () => {
  //   const firstCustomerWithOrdersAndProducts = await db
  //     .select(Customer, {
  //       orders: db
  //         .select(Orders, {
  //           products: db.select(OrderProducts).join(Product).on(OrderProducts.productId.eq(Product.id)),
  //         })
  //         .where(Order.customerId.eq(Customer.id)),
  //     })
  //     .limit(1)
  //     .execute();
  //   console.log(`firstCustomerWithOrdersAndProducts:`, firstCustomerWithOrdersAndProducts.length);
  // });

  // bench("findFirst-relation-filters", async () => {
  //   const customerWithLargeOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id).and(Order.totalAmount.gt(100))),
  //     })
  //     .limit(1)
  //     .execute();
  //   console.log(`customerWithLargeOrders:`, customerWithLargeOrders.length);
  // });

  /**
   * findFirstOrThrow
   */

  bench("findFirstOrThrow-base", async () => {
    const firstCustomer = await db.select().from(Customer).limit(1).execute();
    if (firstCustomer.length === 0) throw new Error("No customer found");
    console.log(`firstCustomer:`, firstCustomer.length);
  });

  // bench("findFirstOrThrow-1-level-nesting", async () => {
  //   const firstCustomerWithOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id)),
  //     })
  //     .limit(1)
  //     .execute();
  //   if (firstCustomerWithOrders.length === 0) throw new Error("No customer found");
  //   console.log(`firstCustomerWithOrders:`, firstCustomerWithOrders.length);
  // });

  // bench("findFirstOrThrow-2-level-nesting", async () => {
  //   const firstCustomerWithOrdersAndProducts = await db
  //     .select(Customer, {
  //       orders: db
  //         .select(Orders, {
  //           products: db.select(OrderProducts).join(Product).on(OrderProducts.productId.eq(Product.id)),
  //         })
  //         .where(Order.customerId.eq(Customer.id)),
  //     })
  //     .limit(1)
  //     .execute();
  //   if (firstCustomerWithOrdersAndProducts.length === 0) throw new Error("No customer found");
  //   console.log(`firstCustomerWithOrdersAndProducts:`, firstCustomerWithOrdersAndProducts.length);
  // });

  // bench("findFirstOrThrow-relation-filters", async () => {
  //   const customerWithLargeOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id).and(Order.totalAmount.gt(100))),
  //     })
  //     .limit(1)
  //     .execute();
  //   if (customerWithLargeOrders.length === 0) throw new Error("No customer found");
  //   console.log(`customerWithLargeOrders:`, customerWithLargeOrders.length);
  // });

  /**
   * findUnique
   */

  // bench("findUnique-base", async () => {
  //   const firstCustomer = await db.select().from(Customer).where(Customer.id.eq(1)).execute();
  //   console.log(`firstCustomer:`, firstCustomer.length);
  // });

  // bench("findUnique-1-level-nesting", async () => {
  //   const firstCustomerWithOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id)),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   console.log(`firstCustomerWithOrders:`, firstCustomerWithOrders.length);
  // });

  // bench("findUnique-2-level-nesting", async () => {
  //   const firstCustomerWithOrdersAndProducts = await db
  //     .select(Customer, {
  //       orders: db
  //         .select(Orders, {
  //           products: db.select(OrderProducts).join(Product).on(OrderProducts.productId.eq(Product.id)),
  //         })
  //         .where(Order.customerId.eq(Customer.id)),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   console.log(`firstCustomerWithOrdersAndProducts:`, firstCustomerWithOrdersAndProducts.length);
  // });

  // bench("findUnique-relation-filters", async () => {
  //   const customerWithLargeOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id).and(Order.totalAmount.gt(100))),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   console.log(`customerWithLargeOrders:`, customerWithLargeOrders.length);
  // });

  /**
   * findUniqueOrThrow
   */

  // bench("findUniqueOrThrow-base", async () => {
  //   const firstCustomer = await db.select().from(Customer).where(Customer.id.eq(1)).execute();
  //   if (firstCustomer.length === 0) throw new Error("No customer found");
  //   console.log(`firstCustomer:`, firstCustomer.length);
  // });

  // bench("findUniqueOrThrow-1-level-nesting", async () => {
  //   const firstCustomerWithOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id)),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   if (firstCustomerWithOrders.length === 0) throw new Error("No customer found");
  //   console.log(`firstCustomerWithOrders:`, firstCustomerWithOrders.length);
  // });

  // bench("findUniqueOrThrow-2-level-nesting", async () => {
  //   const firstCustomerWithOrdersAndProducts = await db
  //     .select(Customer, {
  //       orders: db
  //         .select(Orders, {
  //           products: db.select(OrderProducts).join(Product).on(OrderProducts.productId.eq(Product.id)),
  //         })
  //         .where(Order.customerId.eq(Customer.id)),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   if (firstCustomerWithOrdersAndProducts.length === 0) throw new Error("No customer found");
  //   console.log(`firstCustomerWithOrdersAndProducts:`, firstCustomerWithOrdersAndProducts.length);
  // });

  // bench("findUniqueOrThrow-relation-filters", async () => {
  //   const customerWithLargeOrders = await db
  //     .select(Customer, {
  //       orders: db.select(Order).where(Order.customerId.eq(Customer.id).and(Order.totalAmount.gt(100))),
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   if (customerWithLargeOrders.length === 0) throw new Error("No customer found");
  //   console.log(`customerWithLargeOrders:`, customerWithLargeOrders.length);
  // });

  /**
   * create
   */

  // bench("create-base", async () => {
  //   const newCustomer = await db
  //     .insert(Customer)
  //     .values({
  //       name: "John Doe",
  //       email: `${new Date().toISOString()}@example.com`,
  //     })
  //     .execute();
  //   console.log(`newCustomer:`, newCustomer);
  // });

  // bench("create-1-level-of-nesting", async () => {
  //   const newCustomer = await db
  //     .insert(Customer)
  //     .values({
  //       name: "John Doe",
  //       email: `${new Date().toISOString()}@example.com`,
  //     })
  //     .execute();
  //   console.log(`newCustomer:`, newCustomer);
  // });

  // bench("create-2-levels-of-nesting", async () => {
  //   const newCustomerWithOrder = await db
  //     .insert(Customer)
  //     .values({
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //     })
  //     .returning("id")
  //     .execute();

  //   const newOrder = await db
  //     .insert(Order)
  //     .values({
  //       customerId: newCustomerWithOrder[0].id,
  //       totalAmount: 100.5,
  //     })
  //     .returning("id")
  //     .execute();

  //   await db
  //     .insert(OrderProducts)
  //     .values([
  //       { orderId: newOrder[0].id, productId: 1 },
  //       { orderId: newOrder[0].id, productId: 2 },
  //     ])
  //     .execute();

  //   console.log(`newCustomerWithOrder:`, newCustomerWithOrder);
  // });

  /**
   * update
   */

  // bench("update-base", async () => {
  //   const updatedCustomer = await db
  //     .update(Customer)
  //     .set({
  //       name: "John Doe Updated",
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   console.log(`updatedCustomer:`, updatedCustomer);
  // });

  // bench("update-1-level-of-nesting", async () => {
  //   const updatedCustomerWithAddress = await db
  //     .update(Customer)
  //     .set({
  //       name: "John Doe Updated",
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();
  //   console.log(`updatedCustomerWithAddress:`, updatedCustomerWithAddress);
  // });

  // bench("update-2-levels-of-nesting", async () => {
  //   const updatedCustomerWithOrder = await db
  //     .update(Customer)
  //     .set({
  //       name: "John Doe Updated",
  //     })
  //     .where(Customer.id.eq(1))
  //     .execute();

  //   await db
  //     .update(Order)
  //     .set({
  //       totalAmount: 200.0,
  //     })
  //     .where(Order.customerId.eq(1))
  //     .execute();

  //   console.log(`updatedCustomerWithOrder:`, updatedCustomerWithOrder);
  // });

  /**
   * upsert
   */

  // bench("upsert-base", async () => {
  //   const upsertedCustomer = await db
  //     .insert(Customer)
  //     .values({
  //       id: 1,
  //       name: "John Doe Upserted",
  //       email: "john.doe@example.com",
  //     })
  //     .onConflict(["id"])
  //     .doUpdate()
  //     .set({
  //       name: "John Doe Upserted",
  //     })
  //     .execute();
  //   console.log(`upsertedCustomer:`, upsertedCustomer);
  // });

  // bench("upsert-1-level-of-nesting", async () => {
  //   const upsertedCustomerWithAddress = await db
  //     .insert(Customer)
  //     .values({
  //       id: 1,
  //       name: "John Doe Upserted",
  //       email: "john.doe@example.com",
  //     })
  //     .onConflict(["id"])
  //     .doUpdate()
  //     .set({
  //       name: "John Doe Upserted",
  //     })
  //     .execute();
  //   console.log(`upsertedCustomerWithAddress:`, upsertedCustomerWithAddress);
  // });

  // bench("upsert-2-levels-of-nesting", async () => {
  //   const upsertedCustomerWithOrder = await db
  //     .insert(Customer)
  //     .values({
  //       id: 1,
  //       name: "John Doe",
  //       email: "john.doe@example.com",
  //     })
  //     .onConflict(["id"])
  //     .doUpdate()
  //     .set({
  //       name: "John Doe Upserted",
  //     })
  //     .execute();

  //   await db
  //     .insert(Order)
  //     .values({
  //       id: 1,
  //       customerId: 1,
  //       totalAmount: 100.5,
  //     })
  //     .onConflict(["id"])
  //     .doUpdate()
  //     .set({
  //       totalAmount: 200.0,
  //     })
  //     .execute();

  //   await db
  //     .insert(OrderProducts)
  //     .values([
  //       { orderId: 1, productId: 1 },
  //       { orderId: 1, productId: 2 },
  //     ])
  //     .execute();

  //   console.log(`upsertedCustomerWithOrder:`, upsertedCustomerWithOrder);
  // });

  /**
   * delete
   */

  // bench("delete-base", async () => {
  //   const deletedCustomer = await db.delete(Customer).where(Customer.id.eq(1)).execute();
  //   console.log(`deletedCustomer:`, deletedCustomer);
  // });

  /**
   * createMany
   */

  // bench("createMany-base", async () => {
  //   const users = [];
  //   for (let i = 0; i < 1000; i++) {
  //     users.push({
  //       name: `Customer ${i}`,
  //       email: `customer${i}@example.com`,
  //     });
  //   }
  //   const createdCustomersCount = await db.insert(Customer).values(users).execute();
  //   console.log(`createdCustomersCount:`, createdCustomersCount);
  // });

  /**
   * createManyAndReturn
   */

  // bench("createManyAndReturn-base", async () => {
  //   const users = [];
  //   for (let i = 0; i < 1000; i++) {
  //     users.push({
  //       name: `Customer ${i}`,
  //       email: `customer${i}@example.com`,
  //     });
  //   }
  //   const createdCustomersCount = await db.insert(Customer).values(users).execute();
  //   console.log(`createdCustomersCount:`, createdCustomersCount);
  // });

  /**
   * updateMany
   */

  // bench("updateMany-base", async () => {
  //   const updatedCustomers = await db
  //     .update(Customer)
  //     .set({
  //       isActive: true,
  //     })
  //     .where(Customer.isActive.eq(false))
  //     .execute();
  //   console.log(`updatedCustomers:`, updatedCustomers);
  // });

  /**
   * deleteMany
   */

  // bench("deleteMany-base", async () => {
  //   const deletedCustomers = await db.delete(Customer).where(Customer.isActive.eq(false)).execute();
  //   console.log(`deletedCustomers:`, deletedCustomers);
  // });

  /**
   * aggregate
   */

  // bench("aggregate-base", async () => {
  //   const totalSales = await db
  //     .select(sql`SUM(totalAmount) as totalSales`)
  //     .from(Order)
  //     .execute();
  //   console.log(`totalSales:`, totalSales[0].totalSales);
  // });

  /**
   * groupBy
   */

  // bench("groupBy-base", async () => {
  //   const salesByCustomer = await db
  //     .select(Order.customerId, sql`SUM(totalAmount) as totalSales`, sql`COUNT(*) as count`)
  //     .from(Order)
  //     .groupBy(Order.customerId)
  //     .execute();
  //   console.log(`salesByCustomer:`, salesByCustomer);
  // });
});
