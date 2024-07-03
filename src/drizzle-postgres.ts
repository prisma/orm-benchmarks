import { drizzle } from "drizzle-orm/postgres-js";

import { Customer, Order, Address } from "./drizzle/schema-postgres";
import * as schema from "./drizzle/schema-postgres";
import * as relations from "./drizzle/relations-postgres";
import { eq, desc } from "drizzle-orm";
import measure from "./lib/measure";
import postgres from "postgres";
import { QueryResult } from "./lib/types";

export async function drizzlePg(databaseUrl: string): Promise<QueryResult[]> {
  const client = postgres(databaseUrl, {
    ssl: {
      rejectUnauthorized: databaseUrl.includes('localhost')
    }
  });
  const db = drizzle(client, { schema: { ...schema, ...relations } });
  console.log(`run drizzle benchmarks: `, databaseUrl);

  const results: QueryResult[] = [];

  /**
   * findMany
   */

  results.push(await measure("drizzle-findMany", db.query.Customer.findMany()));

  results.push(
    await measure(
      "drizzle-findMany-filter-paginate-order",
      db.query.Customer.findMany({
        where: eq(Customer.isActive, true),
        orderBy: [desc(Customer.createdAt)],
        offset: 0,
        limit: 10,
      })
    )
  );

  results.push(
    await measure(
      "drizzle-findMany-1-level-nesting",
      db.query.Customer.findMany({
        with: {
          orders: true,
        },
      })
    )
  );

  /**
   * findFirst
   */

  results.push(await measure("drizzle-findFirst", db.query.Customer.findFirst()));

  results.push(
    await measure(
      "drizzle-findFirst-1-level-nesting",
      db.query.Customer.findFirst({
        with: {
          orders: true,
        },
      })
    )
  );

  /**
   * findUnique
   */

  results.push(
    await measure(
      "drizzle-findUnique",
      db.query.Customer.findFirst({
        where: eq(Customer.id, 1),
      })
    )
  );

  results.push(
    await measure(
      "drizzle-findUnique-1-level-nesting",
      db.query.Customer.findFirst({
        where: eq(Customer.id, 1),
        with: {
          orders: true,
        },
      })
    )
  );

  /**
   * create
   */

  results.push(
    await measure(
      "drizzle-create",
      db
        .insert(Customer)
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
      .insert(Customer)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: false,
      })
      .returning();

    const customerId = customer[0].id;

    // Insert order with the associated customerId
    const insertedOrder = await trx
      .insert(Order)
      .values({
        customerId: customerId,
        // sqlite
        // date: `${new Date()}`,
        // postgres
        date: `${new Date().toISOString()}`,
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
  results.push(await measure("drizzle-nested-create", nestedCreate));

  /**
   * update
   */

  results.push(
    await measure("drizzle-update", db.update(Customer).set({ name: "John Doe Updated" }).where(eq(Customer.id, 1)))
  );

  results.push(
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
    )
  );

  /**
   * upsert
   */
  results.push(
    await measure(
      "drizzle-upsert",
      db
        .insert(Customer)
        .values({
          name: "John Doe",
          email: "john.doe@example.com",
          isActive: false,
        })
        .onConflictDoUpdate({
          target: Customer.id,
          set: { name: "John Doe Upserted" },
        })
    )
  );

  const nestedUpsert = db.transaction(async (trx) => {
    // Update customer name
    const customer = await trx
      .insert(Customer)
      .values({
        name: "John Doe",
        email: "john.doe@example.com",
        isActive: false,
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
  results.push(await measure("drizzle-nested-upsert", nestedUpsert));

  /**
   * delete
   */

  results.push(await measure("drizzle-delete", db.delete(Customer).where(eq(Customer.id, 1))));

  await client.end(); // Close the database connection

  return results;
}

// export async function closeDrizzlePg() {
//   console.log(`closing connection with Drizzle`);
// }
