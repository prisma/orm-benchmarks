import prepare from "./prepare-pg";
import { prismaPg } from "../prisma-postgres";
import { typeormPg } from "../typeorm-postgres";
import { drizzlePg } from "../drizzle-postgres";
import * as fs from "fs";
import { MultipleBenchmarkRunResults, ORM } from "./types";

export default async function runBenchmarksPg(options: { databaseUrl: string; iterations: number }) {
  const { databaseUrl, iterations } = options;

  const prismaResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepare(databaseUrl);
    const results = await prismaPg(databaseUrl);
    // discard the initial run "warmup" run
    // if (i > 0)
    prismaResults.push(results);
  }
  writeResults("prisma", prismaResults);

  const drizzleResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepare(databaseUrl);
    const results = await drizzlePg(databaseUrl);
    // discard the initial run "warmup" run
    // if (i > 0)
    prismaResults.push(results);
  }
  writeResults("drizzle", drizzleResults);

  const typeormResults: MultipleBenchmarkRunResults = [];
  for (let i = 0; i < iterations; i++) {
    await prepare(databaseUrl);
    const results = await typeormPg(databaseUrl);
    // if (i > 0)
    prismaResults.push(results);
  }
  writeResults("typeorm", typeormResults);
}

function writeResults(orm: ORM, results: MultipleBenchmarkRunResults) {
  console.log(`write results for ${orm}:`);

  // Extract headers
  const headers = Array.from(new Set(results.flatMap((batch) => batch.map((item) => item.query))));

  // Extract rows
  const rows = results.map((batch) => {
    const row: { [key: string]: number | string } = {};
    batch.forEach((item) => {
      row[item.query] = item.time;
    });
    // Ensure all headers are included in each row, even if they are missing in the batch
    headers.forEach((header) => {
      if (!(header in row)) {
        row[header] = "";
      }
    });
    return headers.map((header) => row[header]);
  });

  // Write to CSV
  const filename = `./results/${orm}-results-${Date.now()}.csv`;
  const csvStream = fs.createWriteStream(filename);

  csvStream.write(headers.join(",") + "\n");
  rows.forEach((row) => {
    csvStream.write(row.join(",") + "\n");
  });

  csvStream.end();

  console.log(`results for ${orm} written to: ${filename}`);
}

// function extractIds(data: any, collectedIds: Set<any> = new Set()): Set<any> {
//   if (data === null || data === undefined) {
//     return collectedIds;
//   }

//   if (Array.isArray(data)) {
//     for (const item of data) {
//       extractIds(item, collectedIds);
//     }
//   } else if (typeof data === 'object') {
//     if ('id' in data) {
//       collectedIds.add(data.id);
//     }
//     for (const key in data) {
//       if (typeof data[key] === 'object') {
//         extractIds(data[key], collectedIds);
//       }
//     }
//   }

//   return collectedIds;
// }

// function compareResults(allResults: AllResults) {
//   const orms: ORM[] = ["prisma", "drizzle", "typeorm"];

//   // Assuming each ORM has the same set of queries in the same order
//   const numberOfRuns = allResults[orms[0]].length;

//   for (let runIndex = 0; runIndex < numberOfRuns; runIndex++) {
//     const queriesInRun = allResults[orms[0]][runIndex];

//     queriesInRun.forEach((queryResult, queryIndex) => {
//       const query = queryResult.query;
//       const idSets: { [key in ORM]: Set<any> } = {
//         prisma: extractIds(allResults.prisma[runIndex][queryIndex].data),
//         drizzle: extractIds(allResults.drizzle[runIndex][queryIndex].data),
//         typeorm: extractIds(allResults.typeorm[runIndex][queryIndex].data),
//       };

//       // Compare id sets for the same query across all ORMs
//       const firstIdSet = idSets.prisma;
//       const isDataConsistent = orms.every(orm => {
//         if (orm === "prisma") return true; // Skip comparing the first set with itself
//         return setsAreEqual(firstIdSet, idSets[orm]);
//       });

//       if (!isDataConsistent) {
//         console.log(`Data is DIFFERENT for query "${query}" in run ${runIndex + 1}:`);
//         orms.forEach(orm => {
//           console.log(`- ${orm}:`, Array.from(idSets[orm]));
//         });
//         if (query === 'prisma-findFirst') {
//           console.log(`DRIZZLE DATA: `)
//           console.dir(allResults.drizzle[runIndex][queryIndex].data)
//         }
//       } else {
//         console.log(`Data is SAME for query "${query}" in run ${runIndex + 1}:`);

//       }
//     });
//   }
// }

// function setsAreEqual(setA: Set<any>, setB: Set<any>): boolean {
//   if (setA.size !== setB.size) return false;
//   let isEqual = true;
//   setA.forEach(item => {
//     if (!setB.has(item)) isEqual = false;
//   });
//   return isEqual;
// }

// function compareResults(allResults: AllResults) {
//   console.log(`compare all results:`);

//   const orms: ORM[] = ["prisma", "drizzle", "typeorm"];

//   //   // Assuming each ORM has the same set of queries in the same order
//   //   const numberOfRuns = allResults["prisma"].length; // = ITERATIONS
//   //   console.log(`numberOfRuns`, numberOfRuns);

//   //   for (let runIndex = 0; runIndex < numberOfRuns; runIndex++) {
//   const runIndex = 0;
//   // const queriesInRun = allResults.prisma[runIndex];
//   const prismaResults: QueryResult[] = allResults.prisma[0];
//   const drizzleResults: QueryResult[] = allResults.drizzle[0];
//   const typeormResults: QueryResult[] = allResults.typeorm[0];

//   prismaResults.forEach((queryResult: QueryResult, queryIndex: number) => {
//     const query = queryResult.query;
//     console.log(`currrent query: ${query}`);
//     const dataSets: { [key in ORM]: any } = {
//       prisma: prismaResults[queryIndex].data,
//       drizzle: drizzleResults[queryIndex].data,
//       typeorm: typeormResults[queryIndex].data,
//     };
//     console.log(dataSets)

//     // Convert the data to JSON string for comparison
//     const dataJsonStrings = orms.map((orm) => JSON.stringify(dataSets[orm]));

//     // Compare data for the same query across all ORMs
//     const firstDataJson = dataJsonStrings[0];
//     const isDataConsistent = dataJsonStrings.every((dataJson) => dataJson === firstDataJson);

//     if (!isDataConsistent) {
//       console.log(`Data is DIFFERENT for query "${query}" in run ${runIndex + 1}:`);

//       // orms.forEach((orm) => {
//       //   console.log(`- ${orm}:`);
//       //   console.dir(dataSets[orm], { depth: null });
//       // });
//     } else {
//       console.log(`Data is the SAME for "${query}" in run ${runIndex + 1}:`);
//     }
//   });

//   //   }
// }
