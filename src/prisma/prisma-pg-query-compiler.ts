import { PrismaClient } from "./client-pg-query-compiler";
import measure from "../lib/measure";
import { QueryResult } from "../lib/types";
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

export async function prismaPgQueryCompiler(databaseUrl: string): Promise<QueryResult[]> {
  console.log(`Run prisma benchmarks: `, databaseUrl);

  const pool = new Pool({ connectionString: databaseUrl })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  await prisma.$connect();

  const results: QueryResult[] = [];

  /**
   * findMany
   */

  results.push(await measure("prisma-findMany", prisma.customer.findMany()));

  results.push(
    await measure(
      "prisma-findMany-filter-paginate-order",
      prisma.customer.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      })
    )
  );

  results.push(
    await measure(
      "prisma-findMany-1-level-nesting",
      prisma.customer.findMany({
        include: {
          orders: true,
        },
      })
    )
  );

  /**
   * findFirst
   */

  results.push(await measure("prisma-findFirst", prisma.customer.findFirst()));

  results.push(
    await measure(
      "prisma-findFirst-1-level-nesting",
      prisma.customer.findFirst({
        include: {
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
      "prisma-findUnique",
      prisma.customer.findUnique({
        where: { id: 1 },
      })
    )
  );

  results.push(
    await measure(
      "prisma-findUnique-1-level-nesting",
      prisma.customer.findUnique({
        where: { id: 1 },
        include: {
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
      "prisma-create",
      prisma.customer.create({
        data: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
      })
    )
  );

  // TODO: not yet supported by query compiler
  results.push(
    { query: "prisma-nested-create", time: 0, data: null}
  );
  // results.push(
  //   await measure(
  //     "prisma-nested-create",
  //     prisma.customer.create({
  //       data: {
  //         name: "John Doe",
  //         email: "john.doe@example.com",
  //         isActive: false,
  //         orders: {
  //           create: {
  //             date: new Date(),
  //             totalAmount: 100.5,
  //             products: {
  //               connect: [{ id: 1 }, { id: 2 }], // Assuming products with IDs 1 and 2 already exist
  //             },
  //           },
  //         },
  //       },
  //     })
  //   )
  // );

  /**
   * update
   */

  results.push(
    await measure(
      "prisma-update",
      prisma.customer.update({
        where: { id: 1 },
        data: {
          name: "John Doe Updated",
        },
      })
    )
  );

  // TODO: not yet supported by query compiler
  results.push(
    { query: "prisma-nested-update", time: 0, data: null}
  );
  // results.push(
  //   await measure(
  //     "prisma-nested-update",
  //     prisma.customer.update({
  //       where: { id: 1 },
  //       data: {
  //         name: "John Doe Updated",
  //         address: {
  //           update: {
  //             street: "456 New St",
  //           },
  //         },
  //       },
  //     })
  //   )
  // );

  /**
   * upsert
   */

  // TODO: not yet supported by query compiler
  results.push(
    { query: "prisma-upsert", time: 0, data: null}
  );
  // results.push(
  //   await measure(
  //     "prisma-upsert",
  //     prisma.customer.upsert({
  //       where: { id: 1 },
  //       update: {
  //         name: "John Doe Upserted",
  //       },
  //       create: {
  //         name: "John Doe",
  //         email: "john.doe@example.com",
  //       },
  //     })
  //   )
  // );

  // TODO: not yet supported by query compiler
  results.push(
    { query: "prisma-nested-upsert", time: 0, data: null}
  );
  // results.push(
  //   await measure(
  //     "prisma-nested-upsert",
  //     prisma.customer.upsert({
  //       where: { id: 1 },
  //       update: {
  //         name: "John Doe Upserted",
  //         address: {
  //           update: {
  //             street: "456 New St",
  //           },
  //         },
  //       },
  //       create: {
  //         name: "John Doe",
  //         email: "john.doe@example.com",
  //         address: {
  //           create: {
  //             street: "456 New St",
  //             city: "Anytown",
  //             postalCode: "12345",
  //             country: "Country",
  //           },
  //         },
  //       },
  //     })
  //   )
  // );

  /**
   * delete
   */

  results.push(
    await measure(
      "prisma-delete",
      prisma.customer.delete({
        where: { id: 1 },
      })
    )
  );

  await prisma.$disconnect();

  return results;
}