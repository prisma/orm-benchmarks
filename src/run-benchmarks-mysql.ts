import { prepareMySQL } from "./lib/prepare-mysql";
import writeResults from "./lib/write-results";
import { BenchmarkOptions, MultipleBenchmarkRunResults } from "./lib/types";
import { prismaMySQL } from "./prisma/prisma-mysql";
import { drizzleMySQL } from "./drizzle/drizzle-mysql";
// import { typeormMySQL } from "./typeorm/typeorm-mysql";

export default async function runBenchmarksMySQL(
  benchmarkOptions: BenchmarkOptions
) {
  const { databaseUrl, iterations, size, fakerSeed } = benchmarkOptions;

  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepareMySQL({ databaseUrl, size, fakerSeed });
    const results = await prismaMySQL(databaseUrl);
    prismaResults.push(results);
  }
  writeResults("prisma", "mysql", prismaResults, benchmarkOptions);

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepareMySQL({ databaseUrl, size, fakerSeed });
    const results = await drizzleMySQL(databaseUrl);
    drizzleResults.push(results);
  }
  writeResults("drizzle", "mysql", drizzleResults, benchmarkOptions);

  // const typeormResults: MultipleBenchmarkRunResults = [];
  // for (let i = 0; i < iterations; i++) {
  //   await prepareMySQL({ databaseUrl, size, fakerSeed });
  //   const results = await typeormMySQL(databaseUrl);
  //   typeormResults.push(results);
  // }
  // writeResults("typeorm", "postgresql", typeormResults, benchmarkOptions);

    // Optionally compare results
  // compareResults({
  //   prismaResults,
  //   drizzleResults,
  //   typeormResults
  // });
}