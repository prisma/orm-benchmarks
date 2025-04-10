import { drizzle } from "drizzle-orm/postgres-js";

// import { Customer, Order, Address } from "./schema/schema-postgres";
import * as schema from "./schema/schema-postgres";
import * as relations from "./schema/relations-postgres";
import { eq, desc, sql } from "drizzle-orm";
import measure from "../lib/measure";
import postgres from "postgres";
import { QueryResult } from "../lib/types";

export async function drizzleSelectPg(databaseUrl: string): Promise<QueryResult[]> {
  const client = postgres(databaseUrl, {
    ssl: databaseUrl.includes("localhost") ? undefined : { rejectUnauthorized: false }
  });
  const db = drizzle(client, { schema });
  // connect
  await db.execute(sql`select 1`);
  console.log(`Run drizzle select benchmarks: `, databaseUrl);

  const results: QueryResult[] = [];

  /**
   * findMany
   */

  // results.push(await measure("drizzle-findMany", db.query.Customer.findMany()));
  results.push(
    await measure("drizzle-select-findMany", db.select().from(schema.Customer))
  );

  // results.push(
  //   await measure(
  //     "drizzle-findMany-filter-paginate-order",
  //     db.query.Customer.findMany({
  //       where: eq(schema.Customer.isActive, true),
  //       orderBy: [desc(schema.Customer.createdAt)],
  //       offset: 0,
  //       limit: 10,
  //     })
  //   )
  // );
  results.push(
    await measure(
      "drizzle-select-findMany-filter-paginate-order",
      db
        .select()
        .from(schema.Customer)
        .where(eq(schema.Customer.isActive, true))
        .orderBy(desc(schema.Customer.createdAt))
        .offset(0)
        .limit(10)
    )
  );

  // results.push(
  //   await measure(
  //     "drizzle-findMany-1-level-nesting",
  //     db.query.Customer.findMany({
  //       with: {
  //         orders: true,
  //       },
  //     })
  //   )
  // );
  results.push(
    await measure(
      "drizzle-select-findMany-1-level-nesting",
      db
        .select({
          customer: schema.Customer,
          orders: schema.Order,
        })
        .from(schema.Customer)
        .innerJoin(
          schema.Order,
          eq(schema.Order.customerId, schema.Customer.id)
        )
    )
  );

  /**
   * findFirst
   */

  // results.push(await measure("drizzle-findFirst", db.query.Customer.findFirst()));
  results.push(
    await measure(
      "drizzle-select-findFirst",
      db.select().from(schema.Customer).limit(1)
    )
  );

  // results.push(
  //   await measure(
  //     "drizzle-findFirst-1-level-nesting",
  //     db.query.Customer.findFirst({
  //       with: {
  //         orders: true,
  //       },
  //     })
  //   )
  // );
  const firstCustomerQuery = db.$with("first_customer").as(db.select().from(schema.Customer).limit(1));
  results.push(
    await measure(
      "drizzle-select-findFirst-1-level-nesting",
      db
        .with(firstCustomerQuery)
        .select({
          customer: {
            id: firstCustomerQuery.id,
            createdAt: firstCustomerQuery.createdAt,
            name: firstCustomerQuery.name,
            email: firstCustomerQuery.email,
            isActive: firstCustomerQuery.isActive,
          },
          orders: schema.Order,
        })
        .from(firstCustomerQuery)
        .innerJoin(schema.Order, eq(schema.Order.customerId, firstCustomerQuery.id))
    )
  );

  /**
   * findUnique
   */

  // results.push(
  //   await measure(
  //     "drizzle-findUnique",
  //     db.query.Customer.findFirst({
  //       where: eq(schema.Customer.id, 1),
  //     })
  //   )
  // );
  results.push(
    await measure(
      "drizzle-select-findUnique",
      db.select().from(schema.Customer).where(eq(schema.Customer.id, 1))
    )
  );

  // results.push(
  //   await measure(
  //     "drizzle-findUnique-1-level-nesting",
  //     db.query.Customer.findFirst({
  //       where: eq(schema.Customer.id, 1),
  //       with: {
  //         orders: true,
  //       },
  //     })
  //   )
  // );
  results.push(
    await measure(
      "drizzle-select-findUnique-1-level-nesting",
      db
        .select()
        .from(schema.Customer)
        .where(eq(schema.Customer.id, 1))
        .innerJoin(
          schema.Order,
          eq(schema.Order.customerId, schema.Customer.id)
        )
    )
  );

  /**
   * create
   */

  results.push(
    await measure(
      "drizzle-select-create",
      db
        .insert(schema.Customer)
        .values({
          name: "John Doe",
          email: "john.doe@example.com",
          isActive: false,
        })
        .returning()
    )
  );

  const nestedCreate = db.transaction(async (trx) => {
    // Insert customer
    const customer = await trx
      .insert(schema.Customer)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: false,
      })
      .returning({id: schema.Customer.id});

    const customerId = customer[0].id;

    // Insert order with the associated customerId
    const insertedOrder = await trx
      .insert(schema.Order)
      .values({
        customerId: customerId,
        date: `${new Date().toISOString()}`,
        totalAmount: "100.5",
      })
      .returning({id: schema.Order.id});

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
  results.push(await measure("drizzle-select-nested-create", nestedCreate));

  /**
   * update
   */

  results.push(
    await measure(
      "drizzle-select-update",
      db
        .update(schema.Customer)
        .set({ name: "John Doe Updated" })
        .where(eq(schema.Customer.id, 1)))
  );

  results.push(
    await measure(
      "drizzle-select-nested-update",
      db.transaction(async (trx) => {
        // Update customer name
        const customerUpdate = trx
        .update(schema.Customer)
        .set({ name: "John Doe Updated" })
        .where(eq(schema.Customer.id, 1));

        // Update address
        const addressUpdate = trx
          .update(schema.Address)
          .set({
            street: "456 New St",
          })
          .where(eq(schema.Address.customerId, 1));

        await Promise.all([customerUpdate, addressUpdate]);
      })
    )
  );

  /**
   * upsert
   */
  results.push(
    await measure(
      "drizzle-select-upsert",
      db
        .insert(schema.Customer)
        .values({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          isActive: false,
        })
        .onConflictDoUpdate({
          target: schema.Customer.id,
          set: { name: "John Doe Upserted" },
        })
    )
  );

  const nestedUpsert = db.transaction(async (trx) => {
    // Update customer name
    const customer = await trx
      .insert(schema.Customer)
      .values({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: false,
      })
      .onConflictDoUpdate({
        target: schema.Customer.id,
        set: { name: "John Doe Upserted" },
      })
      .returning({id: schema.Customer.id});
    const customerId = customer[0].id;

    // Update address
    await trx
      .insert(schema.Address)
      .values({
        street: "456 New St",
        city: "Anytown",
        postalCode: "12345",
        country: "Country",
        customerId: customerId,
      })
      .onConflictDoUpdate({
        target: schema.Address.customerId,
        set: { street: "456 New St" },
      });
  });
  results.push(await measure("drizzle-select-nested-upsert", nestedUpsert));

  /**
   * delete
   */

  results.push(
    await measure(
      "drizzle-select-delete", 
      db.delete(schema.Customer).where(eq(schema.Customer.id, 1))
    )
  );

  await client.end(); // Close the database connection

  return results;
}
