import { PrismaClient } from "./src/prisma/client-postgresql";
import { seedPg } from "./src/lib/prepare";
import { createDataSet } from "./src/lib/create-dataset";

const dbUrl = "postgresql://nikolasburk:nikolasburk@localhost:5432/benchmark";

// const prisma = new PrismaClient({
//   datasourceUrl: dbUrl,
// });

async function test() {

  createDataSet(
    dbUrl,
    100,
    42,
    'test'
  )


  // await seedPg(dbUrl);

  // const ordersCount = await prisma.order.count();
  // const productsCount = await prisma.product.count();
  // const addressesCount = await prisma.address.count();
  // const customersCount = await prisma.customer.count();
  // console.log(
  //   `Created: \n${ordersCount} orders\n${productsCount} products\n${addressesCount} addresses\n${customersCount} customers`
  // );
}

test();

// import { PrismaClient } from "@prisma/client";
// import { faker } from "@faker-js/faker";

// const NUMBER_OF_RECORDS = 1000;
// const NUMBER_OF_RELATED_RECORDS = 10;
// const FAKER_SEED = 42;

// async function preparePg(databaseUrl: string) {
//   const prisma = new PrismaClient({
//     datasourceUrl: databaseUrl,
//   });

//   console.log(`Preparing DB ...`, databaseUrl);

//   // Clean tables
//   console.log(`Clearing tables ...`);

//   // Postgres
//   await prisma.address.deleteMany();
//   await prisma.$executeRaw`ALTER SEQUENCE "Address_id_seq" RESTART WITH 1`;

//   await prisma.order.deleteMany();
//   await prisma.$executeRaw`ALTER SEQUENCE "Order_id_seq" RESTART WITH 1`;

//   await prisma.product.deleteMany();
//   await prisma.$executeRaw`ALTER SEQUENCE "Product_id_seq" RESTART WITH 1`;

//   await prisma.customer.deleteMany();
//   await prisma.$executeRaw`ALTER SEQUENCE "Customer_id_seq" RESTART WITH 1`;

//   faker.seed(FAKER_SEED);

//   console.log(`Seeding data ...`);
//   // Seed Customers
//   // console.log(`Customers with orders ...`)
//   for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
//     const customer = await prisma.customer.create({
//       data: {
//         name: faker.person.fullName(),
//         email: faker.internet.email(),
//         isActive: faker.datatype.boolean(),
//         address: {
//           create: {
//             street: faker.location.streetAddress(),
//             city: faker.location.city(),
//             postalCode: faker.location.zipCode(),
//             country: faker.location.country(),
//           },
//         },
//       },
//     });

//     // Seed Orders for each Customer
//     for (let j = 0; j < NUMBER_OF_RELATED_RECORDS; j++) {
//       await prisma.order.create({
//         data: {
//           date: faker.date.past(),
//           totalAmount: faker.number.int({ min: 10, max: 1000 }),
//           customerId: customer.id,
//         },
//       });
//     }
//   }

//   // Seed Products
//   // console.log(`Products ...`)
//   for (let i = 0; i < NUMBER_OF_RECORDS; i++) {
//     await prisma.product.create({
//       data: {
//         name: faker.commerce.productName(),
//         price: parseFloat(faker.commerce.price()),
//         quantity: faker.number.int({ min: 1, max: 100 }),
//         description: faker.commerce.productDescription(),
//       },
//     });
//   }

//   // Associate Products with Orders
//   // console.log(`Connect products with orders ...`)
//   const orders = await prisma.order.findMany();
//   const products = await prisma.product.findMany();

//   for (const order of orders) {
//     const randomProducts = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 1, max: 5 }));
//     for (const product of randomProducts) {
//       await prisma.order.update({
//         where: { id: order.id },
//         data: {
//           products: {
//             connect: { id: product.id },
//           },
//         },
//       });
//     }
//   }

//   const ordersCount = await prisma.order.count();
//   const productsCount = await prisma.product.count();
//   const addressesCount = await prisma.address.count();
//   const customersCount = await prisma.customer.count();
//   console.log(
//     `Created: \n${ordersCount} orders\n${productsCount} products\n${addressesCount} addresses\n${customersCount} customers`
//   );

//   await prisma.$disconnect();
// }

// preparePg("postgresql://nikolasburk:nikolasburk@localhost:5432/seed")

// // import { drizzle } from "drizzle-orm/mysql2";
// // import * as schema from "./src/drizzle/schema/schema-mysql";
// // import * as relations from "./src/drizzle/schema/relations-mysql";
// // import postgres from "postgres";
// // import { PrismaClient } from "@prisma/client";
// // import { DataSource } from "typeorm";
// // // import { Customer } from "./src/typeorm/Customer";
// // // import { Order } from "./src/typeorm/Order";
// // // import { Address } from "./src/typeorm/Address";
// // // import { Product } from "./src/typeorm/Product";
// // import mysql from "mysql2/promise";

// // const connectionString = process.env.DATABASE_URL || "";

// // // Prisma
// // // const prisma = new PrismaClient();

// // // Drizzle
// // // const client = postgres(connectionString, {});
// // const poolConnection = mysql.createPool({
// //   uri: connectionString,
// //   ssl: {
// //     rejectUnauthorized: false
// //   }
// // });
// // const db = drizzle(poolConnection, {
// //   schema: { ...schema, ...relations },
// //   mode: "default",
// // });

// // // const db = drizzle(poolConnection, { schema: { ...schema, ...relations } });
// // // const db = drizzle(client, { schema: { ...schema, ...relations } });

// // // export const AppDataSource = new DataSource({
// // //   type: "postgres",
// // //   url: connectionString,
// // //   logging: false,
// // //   entities: [Customer, Order, Address, Product],
// // // });

// // async function test() {
// //   // await AppDataSource.initialize();
// //   // const typeormResult = await AppDataSource.getRepository(Customer).find({
// //   //   take: 1,
// //   //   // relations: ["orders"]
// //   // });
// //   // // console.log(`typeorm`, typeormResult)
// //   // console.dir(typeormResult, { depth: null });
// //   // await AppDataSource.destroy();

// //   const u = await db.insert(schema.Customer).values({
// //     email: "asd",
// //     isActive: true,
// //   })
// //   console.log(u)

// //   const drizzleResult = await db.query.Customer.findMany({
// //     with: {
// //       orders: true,
// //     },
// //   });
// //   console.log(`drizzle`)
// //   console.dir(drizzleResult, { depth: null });
// //   await poolConnection.end(); // Close the database connection
// // }

// // test();
