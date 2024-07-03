import { prepareMySQL } from "./lib/prepare";
import writeResults from "./lib/write-results";
import { prismaMySQL } from "./prisma/prisma-mysql";
import { drizzleMySQL } from "./drizzle/drizzle-mysql";
import { MultipleBenchmarkRunResults } from "./lib/types";

export default async function runBenchmarksMySQL(options: { databaseUrl: string; iterations: number }) {
  const { databaseUrl, iterations } = options;

  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepareMySQL(databaseUrl);
    const results = await prismaMySQL(databaseUrl);
    prismaResults.push(results);
  }
  writeResults("prisma", "mysql", prismaResults);

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepareMySQL(databaseUrl);
    const results = await drizzleMySQL(databaseUrl);
    drizzleResults.push(results);
  }
  writeResults("drizzle", "mysql", drizzleResults);
}
