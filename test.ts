import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./src/drizzle/schema/schema-mysql";
import * as relations from "./src/drizzle/schema/relations-mysql";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import { DataSource } from "typeorm";
// import { Customer } from "./src/typeorm/Customer";
// import { Order } from "./src/typeorm/Order";
// import { Address } from "./src/typeorm/Address";
// import { Product } from "./src/typeorm/Product";
import mysql from "mysql2/promise";

const connectionString = process.env.DATABASE_URL || "";

// Prisma
// const prisma = new PrismaClient();

// Drizzle
// const client = postgres(connectionString, {});
const poolConnection = mysql.createPool({
  uri: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const db = drizzle(poolConnection, {
  schema: { ...schema, ...relations },
  mode: "default",
});

// const db = drizzle(poolConnection, { schema: { ...schema, ...relations } });
// const db = drizzle(client, { schema: { ...schema, ...relations } });

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   url: connectionString,
//   logging: false,
//   entities: [Customer, Order, Address, Product],
// });

async function test() {
  // await AppDataSource.initialize();
  // const typeormResult = await AppDataSource.getRepository(Customer).find({
  //   take: 1,
  //   // relations: ["orders"]
  // });
  // // console.log(`typeorm`, typeormResult)
  // console.dir(typeormResult, { depth: null });
  // await AppDataSource.destroy();

  const u = await db.insert(schema.Customer).values({
    email: "asd",
    isActive: true,
  })
  console.log(u)

  const drizzleResult = await db.query.Customer.findMany({
    with: {
      orders: true,
    },
  });
  console.log(`drizzle`)
  console.dir(drizzleResult, { depth: null });
  await poolConnection.end(); // Close the database connection
}

test();
