import { preparePg } from "./lib/prepare-pg";
import writeResults from "./lib/write-results";
import { BenchmarkOptions, MultipleBenchmarkRunResults,} from "./lib/types";
import { prismaPg } from "./prisma/prisma-pg";
import { typeormPg } from "./typeorm/typeorm-pg";
import { drizzlePg } from "./drizzle/drizzle-pg";
import { compareResults } from "./lib/compare-results";
import { drizzleSelectPg } from "./drizzle/drizzle-select-pg";

export default async function runBenchmarksPg(
  benchmarkOptions: BenchmarkOptions
) {
  const { databaseUrl, iterations, size, fakerSeed } = benchmarkOptions;

  const resultsDirectoryTimestamp = Date.now().toString();

  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await preparePg({ databaseUrl, size, fakerSeed });
    const results = await prismaPg(databaseUrl);
    prismaResults.push(results);
  }
  writeResults("prisma", "postgresql", prismaResults, benchmarkOptions, resultsDirectoryTimestamp);

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await preparePg({ databaseUrl, size, fakerSeed });
    const results = await drizzlePg(databaseUrl);
    drizzleResults.push(results);
  }
  writeResults("drizzle", "postgresql", drizzleResults, benchmarkOptions, resultsDirectoryTimestamp);

  const drizzleSelectResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await preparePg({ databaseUrl, size, fakerSeed });
    const results = await drizzleSelectPg(databaseUrl);
    drizzleSelectResults.push(results);
  }
  writeResults("drizzle-select", "postgresql", drizzleSelectResults, benchmarkOptions, resultsDirectoryTimestamp);

  const typeormResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await preparePg({ databaseUrl, size, fakerSeed });
    const results = await typeormPg(databaseUrl);
    typeormResults.push(results);
  }
  writeResults("typeorm", "postgresql", typeormResults, benchmarkOptions, resultsDirectoryTimestamp);

  // Optionally compare results
  if (process.env.DEBUG === 'benchmarks:compare-results') {
    compareResults({
      prismaResults,
      drizzleResults,
      drizzleSelectResults,
      typeormResults
    });

  }

}
