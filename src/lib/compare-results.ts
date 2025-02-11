import { MultipleBenchmarkRunResults, ORM, QueryResult } from "./types";

function extractIds(data: any, collectedIds: Set<any> = new Set()): Set<any> {
  if (data === null || data === undefined) {
    return collectedIds;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      extractIds(item, collectedIds);
    }
  } else if (typeof data === 'object') {
    if ('id' in data) {
      collectedIds.add(data.id);
    }
    for (const key in data) {
      if (typeof data[key] === 'object') {
        extractIds(data[key], collectedIds);
      }
    }
  }

  return collectedIds;
}

function setsAreEqual(setA: Set<any>, setB: Set<any>): boolean {
  if (setA.size !== setB.size) return false;
  let isEqual = true;
  setA.forEach(item => {
    if (!setB.has(item)) isEqual = false;
  });
  return isEqual;
}


export function compareResults(results: {
  prismaResults: MultipleBenchmarkRunResults,
  prismaQueryCompilerResults: MultipleBenchmarkRunResults,
  drizzleResults: MultipleBenchmarkRunResults,
  typeormResults: MultipleBenchmarkRunResults;
}) {

  const orms: ORM[] = ['prisma', 'drizzle', 'typeorm'];
  const { prismaResults, prismaQueryCompilerResults, typeormResults, drizzleResults } = results;

  // Assuming each ORM has the same set of queries in the same order
  const numberOfQueries = prismaResults[0].length;
  console.log(`no of queries`, numberOfQueries);

  for (let iterationIndex = 0; iterationIndex < prismaResults.length; iterationIndex++) {
    const queriesInRun: QueryResult[] = prismaResults[iterationIndex];

    queriesInRun.forEach((queryResult, queryIndex) => {
      const query = queryResult.query;

      // if (!query.includes('find')) {
      //   return;
      // }

      const idSets: { [key in ORM]: Set<any> } = {
        prisma: extractIds(prismaResults[iterationIndex][queryIndex].data),
        prismaQueryCompiler: extractIds(prismaQueryCompilerResults[iterationIndex][queryIndex].data),
        drizzle: extractIds(drizzleResults[iterationIndex][queryIndex].data),
        typeorm: extractIds(typeormResults[iterationIndex][queryIndex].data),
      };

      // Compare id sets for the same query across all ORMs
      const firstIdSet = idSets.prisma;
      const isDataConsistent = orms.every(orm => {
        if (orm === "prisma") return true; // Skip comparing the first set with itself
        return setsAreEqual(firstIdSet, idSets[orm]);
      });

      if (!isDataConsistent) {
        console.log(`Data is DIFFERENT for query "${query}" in run ${iterationIndex + 1}:`);
        orms.forEach(orm => {
          console.log(`- ${orm}:`, Array.from(idSets[orm]));
        });
      } else {
        console.log(`Data is SAME for query "${query}" in run ${iterationIndex + 1}:`);

      }
    });
  }
}
