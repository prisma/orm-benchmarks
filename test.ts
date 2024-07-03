import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./src/drizzle/schema-postgres";
import * as relations from "./src/drizzle/relations-postgres";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import { DataSource } from "typeorm";
import { Customer } from "./src/typeorm/Customer";
import { Order } from "./src/typeorm/Order";
import { Address } from "./src/typeorm/Address";
import { Product } from "./src/typeorm/Product";

const connectionString = process.env.DATABASE_URL || "postgresql://nikolasburk:nikolasburk@localhost:5432/benchmark";

// Prisma
const prisma = new PrismaClient();

// Drizzle
const client = postgres(connectionString, {});
const db = drizzle(client, { schema: { ...schema, ...relations } });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: connectionString,
  logging: false,
  entities: [Customer, Order, Address, Product],
});

async function test() {
  // const prismaResult = await prisma.customer.findFirst({
  //   include: {
  //     orders: true,
  //   },
  // });
  // console.dir(prismaResult, { depth: null });

  await AppDataSource.initialize();
  const typeormResult = await AppDataSource.getRepository(Customer).find({ 
    take: 1, 
    // relations: ["orders"] 
  });
  // console.log(`typeorm`, typeormResult)
  console.dir(typeormResult, { depth: null });
  await AppDataSource.destroy();

  // const drizzleResult = await db.query.Customer.findFirst({
  //   with: {
  //     orders: true,
  //   },
  // });
  // console.log(`drizzle`, drizzleResult)
  // console.dir(drizzleResult, { depth: null });
  // await client.end(); // Close the database connection
}

test();
