import { readFileSync } from 'fs';

const prismaCsv = readFileSync('prisma.csv', 'utf8');
const drizzleCsv = readFileSync('drizzle.csv', 'utf8');
const typeormCsv = readFileSync('typeorm.csv', 'utf8');

function parseCsvToArray(csvString: string) {
  const rows = csvString.trim().split("\n");
  const headers = rows[0].split(",");
  const data = rows.slice(1).map(row => row.split(",").map(Number));
  return { headers, data };
}

function convertCsvToDataStructure(prismaCsv: string, drizzleCsv: string, typeormCsv: string) {
  const prismaData = parseCsvToArray(prismaCsv);
  const drizzleData = parseCsvToArray(drizzleCsv);
  const typeormData = parseCsvToArray(typeormCsv);

  const createQueriesObject = (headers: string[], data: number[][]) => {
    const queries: { [key: string]: any } = {};
    headers.forEach((header, index) => {
      queries[header] = {
        results: data.map(row => row[index]),
        code: {
          snippet: `prisma.user.findMany()`,
          url: `https://github.com/prisma/benchmarks/.../src/prisma.ts#L15`
        }
      };
    });
    return queries;
  };

  return {
    prisma: {
      queries: createQueriesObject(prismaData.headers, prismaData.data)
    },
    drizzle: {
      queries: createQueriesObject(drizzleData.headers, drizzleData.data)
    },
    typeorm: {
      queries: createQueriesObject(typeormData.headers, typeormData.data)
    }
  };
}

const data = convertCsvToDataStructure(prismaCsv, drizzleCsv, typeormCsv);
console.log(JSON.stringify(data, null, 2));
