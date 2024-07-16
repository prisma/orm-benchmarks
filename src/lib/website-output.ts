import { readFileSync } from 'fs';
import * as path from 'path';
import { prismaSnippets } from '../prisma/prisma-snippets';
import { drizzleSnippets } from '../drizzle/drizzle-snippets';
import { typeormSnippets } from '../typeorm/typeorm-snippets';
// Access the command-line arguments
const args = process.argv.slice(2);

// Function to parse command-line arguments
const parseArgs = (args: string[]) => {
  const argObject: { [key: string]: string; } = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      argObject[key] = value;
      i++;
    }
  }
  return argObject;
};

// Parse the arguments
const parsedArgs = parseArgs(args);

// Output the parsed arguments
console.log('Parsed Arguments:', parsedArgs);

// Example: Accessing a specific argument
const resultsDirectory = parsedArgs['results-directory'];
console.log('resultsDirectory:', resultsDirectory);

generateWebsiteOutput(resultsDirectory);

export default function generateWebsiteOutput(resultsDirectory: string) {

  const prismaFilePath = path.join(resultsDirectory, 'prisma.csv');
  const drizzleFilePath = path.join(resultsDirectory, 'drizzle.csv');
  const typeormFilePath = path.join(resultsDirectory, 'typeorm.csv');

  const prismaCsv = readFileSync(prismaFilePath, 'utf8');
  const drizzleCsv = readFileSync(drizzleFilePath, 'utf8');
  const typeormCsv = readFileSync(typeormFilePath, 'utf8');

  const data = convertCsvToDataStructure(prismaCsv, drizzleCsv, typeormCsv);
  console.log(JSON.stringify(data, null, 2));
}

function parseCsvToArray(csvString: string) {
  const rows = csvString.trim().split("\n");
  const headers = rows[0].split(",");
  const data = rows.slice(1).map(row => row.split(",").map(Number));
  return { headers, data };
}

function getSnippet(snippets: { [key: string]: string }, queryName: string): string {
  return snippets[queryName] || '';
}

function getLineNumber(source: string, queryName: string): number {
  const regex = new RegExp(`await measure\\("${queryName}",`, 'g');
  const match = regex.exec(source);
  if (match) {
    const linesUpToMatch = source.substring(0, match.index).split('\n');
    return linesUpToMatch.length;
  }
  return 1;  // Default to line 1 if not found
}



function convertCsvToDataStructure(prismaCsv: string, drizzleCsv: string, typeormCsv: string) {
  const prismaData = parseCsvToArray(prismaCsv);
  const drizzleData = parseCsvToArray(drizzleCsv);
  const typeormData = parseCsvToArray(typeormCsv);

  // Read the source files
  const prismaSource = readFileSync(path.join(__dirname, '../prisma/prisma-pg.ts'), 'utf8');
  const drizzleSource = readFileSync(path.join(__dirname, '../drizzle/drizzle-postgres.ts'), 'utf8');
  const typeormSource = readFileSync(path.join(__dirname, '../typeorm/typeorm-postgres.ts'), 'utf8');

  const createQueriesObject = (headers: string[], data: number[][], snippets: { [key: string]: string }, source: string, orm: string) => {
    const queries: { [key: string]: any; } = {};
    headers.forEach((header, index) => {
      const lineNumber = getLineNumber(source, header);
      const strippedHeader = header.replace(`${orm}-`, '');
      queries[strippedHeader] = {
        results: data.map(row => row[index]),
        code: {
          snippet: getSnippet(snippets, header),
          url: `https://github.com/prisma/benchmarks/.../src/prisma.ts#L${lineNumber}`
        }
      };
    });
    return queries;
  };

  return {
    prisma: {
      queries: createQueriesObject(prismaData.headers, prismaData.data, prismaSnippets, prismaSource, 'prisma')
    },
    drizzle: {
      queries: createQueriesObject(drizzleData.headers, drizzleData.data, drizzleSnippets, drizzleSource, 'drizzle')
    },
    typeorm: {
      queries: createQueriesObject(typeormData.headers, typeormData.data, typeormSnippets, typeormSource, 'typeorm')
    }
  };
}


