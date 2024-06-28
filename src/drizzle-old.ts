import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { Customer } from "./drizzle/schema";
import * as schema from "./drizzle/schema";
import * as relations from "./drizzle/relations";
import { eq, desc, gt } from "drizzle-orm";

const sqlite = new Database("./prisma/dev.db");

export const db = drizzle(sqlite, { schema: { ...schema, ...relations } });

async function main() {
  /**
   * findMany
   */

  console.time("drizzle-findMany");
  const customersData = await db.query.Customer.findMany();
  console.timeEnd("drizzle-findMany");

  console.time("drizzle-findMany-filter-paginate-order");
  const customersWithOptions = await db.query.Customer.findMany({
    where: eq(Customer.isActive, "1"),
    orderBy: [desc(Customer.createdAt)],
    offset: 0,
    limit: 10,
  });
  console.timeEnd("drizzle-findMany-filter-paginate-order");

  console.time("drizzle");
  const customersWithOrders = await db.query.Customer.findMany({
    with: {
      Orders: true,
    },
  });
  console.timeEnd("drizzle");

  console.time("drizzle");
  const customersWithOrdersAndProducts = await db.query.Customer.findMany({
    with: {
      Orders: {
        with: {
          _OrderProducts: true,
        },
      },
    },
  });
  console.timeEnd("drizzle");

  console.time("drizzle");
  const customersWithLargeOrders = await db
    .select()
    .from(Customer)
    .leftJoin(schema.Order, eq(Customer.id, schema.Order.customerId))
    .where(gt(schema.Order.totalAmount, "100"))
    .execute();
  console.timeEnd("drizzle");

  /**
   * findFirst
   */

  console.time("drizzle");
  const firstCustomer = await db.query.Customer.findFirst();
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _firstCustomerWithOrders = await prisma.customer.findFirst({
  //   include: {
  //     orders: true,
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _firstCustomerWithOrdersAndProducts = await prisma.customer.findFirst({
  //   include: {
  //     orders: {
  //       include: {
  //         products: true,
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _customerWithLargeOrders = await prisma.customer.findFirst({
  //   include: {
  //     orders: {
  //       where: {
  //         totalAmount: {
  //           gt: 100,
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * findFirstOrThrow
   */

  console.time("drizzle");
  const firstCustomerOrThrow = await db.select().from(Customer).limit(1).execute();
  if (firstCustomerOrThrow.length === 0) throw new Error("No customer found");
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _firstCustomerThrowWithOrders = await prisma.customer.findFirstOrThrow({
  //   include: {
  //     orders: true,
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _firstCustomerThrowWithOrdersAndProducts = await prisma.customer.findFirstOrThrow({
  //   include: {
  //     orders: {
  //       include: {
  //         products: true,
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _customerOrThrowWithLargeOrders = await prisma.customer.findFirstOrThrow({
  //   include: {
  //     orders: {
  //       where: {
  //         totalAmount: {
  //           gt: 100,
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * findUnique
   */

  console.time("drizzle");
  // const _uniqueCustomer = await prisma.customer.findUnique({
  //   where: { id: 1 },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueCustomerWithOrders = await prisma.customer.findUnique({
  //   where: { id: 1 },
  //   include: {
  //     orders: true,
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueCustomerWithOrdersAndProducts = await prisma.customer.findUnique({
  //   where: { id: 1 },
  //   include: {
  //     orders: {
  //       include: {
  //         products: true,
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueCustomerWithLargeOrders = await prisma.customer.findUnique({
  //   where: { id: 1 },
  //   include: {
  //     orders: {
  //       where: {
  //         totalAmount: {
  //           gt: 100,
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * findUniqueOrThrow
   */

  console.time("drizzle");
  // const _uniqueOrThrowCustomer = await prisma.customer.findUniqueOrThrow({
  //   where: { id: 1 },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueOrThrowCustomerWithOrders = await prisma.customer.findUniqueOrThrow({
  //   where: { id: 1 },
  //   include: {
  //     orders: true,
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueOrThrowCustomerWithOrdersAndProducts = await prisma.customer.findUniqueOrThrow({
  //   where: { id: 1 },
  //   include: {
  //     orders: {
  //       include: {
  //         products: true,
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _uniqueOrThrowWithLargeOrders = await prisma.customer.findUniqueOrThrow({
  //   where: { id: 1 },
  //   include: {
  //     orders: {
  //       where: {
  //         totalAmount: {
  //           gt: 100,
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * create
   */

  console.time("drizzle");
  // const _newCustomer = await prisma.customer.create({
  //   data: {
  //     name: "John Doe",
  //     email: new Date() + "@example.com",
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _newCustomerWithOrder = await prisma.customer.create({
  //   data: {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     orders: {
  //       create: {
  //         date: new Date(),
  //         totalAmount: 100.5,
  //         products: {
  //           connect: [{ id: 1 }, { id: 2 }], // Assuming products with IDs 1 and 2 already exist
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * update
   */

  console.time("drizzle");
  // const _updatedCustomer = await prisma.customer.update({
  //   where: { id: 1 },
  //   data: {
  //     name: "John Doe Updated",
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _updatedCustomerWithAddress = await prisma.customer.update({
  //   where: { id: 1 },
  //   data: {
  //     name: "John Doe Updated",
  //     address: {
  //       update: {
  //         street: "456 New St",
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _updatedCustomerWithOrder = await prisma.customer.update({
  //   where: { id: 1 },
  //   data: {
  //     name: "John Doe Updated",
  //     address: {
  //       update: {
  //         street: "456 New St",
  //       },
  //     },
  //     orders: {
  //       update: {
  //         where: { id: 1 },
  //         data: {
  //           totalAmount: 200.0,
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * upsert
   */

  console.time("drizzle");
  // const _upsertedCustomer = await prisma.customer.upsert({
  //   where: { id: 1 },
  //   update: {
  //     name: "John Doe Upserted",
  //   },
  //   create: {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _upsertedCustomerWithAddress = await prisma.customer.upsert({
  //   where: { id: 1 },
  //   update: {
  //     name: "John Doe Upserted",
  //     address: {
  //       update: {
  //         street: "456 New St",
  //       },
  //     },
  //   },
  //   create: {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     address: {
  //       create: {
  //         street: "123 Main St",
  //         city: "Anytown",
  //         postalCode: "12345",
  //         country: "Country",
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  console.time("drizzle");
  // const _upsertedCustomerWithOrder = await prisma.customer.upsert({
  //   where: { id: 1 },
  //   update: {
  //     name: "John Doe Upserted",
  //     orders: {
  //       upsert: {
  //         where: { id: 1 },
  //         update: {
  //           totalAmount: 200.0,
  //         },
  //         create: {
  //           date: new Date(),
  //           totalAmount: 100.5,
  //           products: {
  //             connect: [{ id: 1 }, { id: 2 }],
  //           },
  //         },
  //       },
  //     },
  //   },
  //   create: {
  //     name: "John Doe",
  //     email: "john.doe@example.com",
  //     orders: {
  //       create: {
  //         date: new Date(),
  //         totalAmount: 100.5,
  //         products: {
  //           connect: [{ id: 1 }, { id: 2 }],
  //         },
  //       },
  //     },
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * delete
   */

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

  console.time("drizzle");
  // const _createdCustomersCount = await prisma.customer.createMany({
  //   data: _customersToCreate,
  // });
  console.timeEnd("drizzle");

  /**
   * createManyAndReturn
   */

  // for (let i = 0; i < 1000; i++) {
  //   _customersToCreate.push({
  //     name: `Customer ${i}`,
  //     email: `customer${i}@example.com`,
  //   });
  // }

  console.time("drizzle");
  // const _createdCustomers = await prisma.customer.createManyAndReturn({
  //   data: _customersToCreate,
  // });
  console.timeEnd("drizzle");

  /**
   * updateMany
   */

  console.time("drizzle");
  // const _updatedCustomers = await prisma.customer.updateMany({
  //   where: { isActive: false },
  //   data: { isActive: true },
  // });
  console.timeEnd("drizzle");

  /**
   * deleteMany
   */

  console.time("drizzle");
  // const _deletedCustomers = await prisma.customer.deleteMany({
  //   where: { isActive: false },
  // });
  console.timeEnd("drizzle");

  /**
   * aggregate
   */

  console.time("drizzle");
  // const _totalSales = await prisma.order.aggregate({
  //   _sum: {
  //     totalAmount: true,
  //   },
  // });
  console.timeEnd("drizzle");

  /**
   * groupBy
   */

  console.time("drizzle");
  // const _salesByCustomer = await prisma.order.groupBy({
  //   by: ["customerId"],
  //   _sum: {
  //     totalAmount: true,
  //   },
  //   _count: {
  //     _all: true,
  //   },
  // });
  console.timeEnd("drizzle");
}

main()
