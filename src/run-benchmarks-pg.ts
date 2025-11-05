//import { preparePg } from "./lib/prepare-pg-native"; // seed via `pg_restore`
import { preparePg } from "./lib/prepare-pg-prisma"; // seed via `createMany`
import writeResults from "./lib/write-results";
import { BenchmarkOptions, MultipleBenchmarkRunResults } from "./lib/types";
import { prismaPg } from "./prisma/prisma-pg";
import { typeormPg } from "./typeorm/typeorm-pg";
import { drizzlePg } from "./drizzle/drizzle-pg";
import { compareResults } from "./lib/compare-results";

export default async function runBenchmarksPg(
  benchmarkOptions: BenchmarkOptions
) {
  const { databaseUrl, iterations, size, fakerSeed } = benchmarkOptions;

  const resultsDirectoryTimestamp = Date.now().toString();

  const prismaResults: MultipleBenchmarkRunResults = [];
  console.log(`\n🔥 Starting Prisma benchmarks (${iterations} iterations)`);
  for (let i = 0; i < iterations; i++) {
    const remaining = iterations - i - 1;
    console.log(
      `📊 Prisma iteration ${i + 1}/${iterations} (${remaining} remaining)`
    );
    try {
      await preparePg({ databaseUrl, size, fakerSeed });
      const results = await prismaPg(databaseUrl);
      prismaResults.push(results);
    } catch (error) {
      console.error(`❌ Prisma iteration ${i + 1} failed:`, error);
      console.error(
        `❌ Stack:`,
        error instanceof Error ? error.stack : "No stack trace"
      );
      // Continue with next iteration
    }
  }
  writeResults(
    "prisma",
    "postgresql",
    prismaResults,
    benchmarkOptions,
    resultsDirectoryTimestamp
  );

  const drizzleResults: MultipleBenchmarkRunResults = [];
  console.log(`\n🔥 Starting Drizzle benchmarks (${iterations} iterations)`);
  for (let i = 0; i < iterations; i++) {
    const remaining = iterations - i - 1;
    console.log(
      `📊 Drizzle iteration ${i + 1}/${iterations} (${remaining} remaining)`
    );
    try {
      await preparePg({ databaseUrl, size, fakerSeed });
      const results = await drizzlePg(databaseUrl);
      drizzleResults.push(results);
    } catch (error) {
      console.error(
        `❌ Drizzle iteration ${i + 1} failed:`,
        (error as Error).message
      );
      // Continue with next iteration
    }
  }
  writeResults(
    "drizzle",
    "postgresql",
    drizzleResults,
    benchmarkOptions,
    resultsDirectoryTimestamp
  );

  const typeormResults: MultipleBenchmarkRunResults = [];
  console.log(`\n🔥 Starting TypeORM benchmarks (${iterations} iterations)`);
  for (let i = 0; i < iterations; i++) {
    const remaining = iterations - i - 1;
    console.log(
      `📊 TypeORM iteration ${i + 1}/${iterations} (${remaining} remaining)`
    );
    try {
      await preparePg({ databaseUrl, size, fakerSeed });
      const results = await typeormPg(databaseUrl);
      typeormResults.push(results);
    } catch (error) {
      console.error(
        `❌ TypeORM iteration ${i + 1} failed:`,
        (error as Error).message
      );
      // Continue with next iteration
    }
  }
  writeResults(
    "typeorm",
    "postgresql",
    typeormResults,
    benchmarkOptions,
    resultsDirectoryTimestamp
  );

  // Optionally compare results
  if (process.env.DEBUG === "benchmarks:compare-results") {
    compareResults({
      prismaResults,
      drizzleResults,
      typeormResults,
    });
  }
}
