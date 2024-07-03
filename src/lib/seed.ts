import { exec } from "child_process";

type ConnectionDetails = {
  user: string;
  password: string;
  host: string;
  port: string;
  db: string;
};

function executeCommand(command: string, envVars: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    const childProcess = exec(command, { env: { ...process.env, ...envVars } }, (error: any | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        // Do not reject here, since stderr might contain non-critical information
      }

      console.log(`stdout: ${stdout}`);
      resolve();
    });

    // Optional: Stream the output in real-time
    childProcess.stdout?.on("data", (data: any) => console.log(data.toString()));
    childProcess.stderr?.on("data", (data: any) => console.error(data.toString()));
  });
}




export async function seedPg(databaseUrl: string) {
  const connectionDetails = extractConnectionDetailsFromUrl(databaseUrl);
  console.log(`seeding with connection details: `, connectionDetails);
  const { host, user, db, password } = connectionDetails;
  const command = `pg_restore -h ${host} -U ${user} -d ${db} --no-owner -v --clean ./data/postgres.sql`;
  console.log(`seed command: `, command)
  try {
    await executeCommand(command, { PGPASSWORD: password });
    console.log("pg_restore command executed successfully.");
  } catch (error) {
    console.error("Failed to execute pg_restore command.");
  }
}

function extractConnectionDetailsFromUrl(databaseUrl: string): ConnectionDetails {
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = databaseUrl.match(regex);

  if (!match) {
    throw new Error('Invalid database URL');
  }

  const [_, user, password, host, port, db] = match;

  return {
    user,
    password,
    host,
    port,
    db
  };
}
// function extractConnectionDetailsFromUrl(databaseUrl: string): ConnectionDetails {
//   const regex = /postgresql:\/\/(?<user>[^:]+):(?<password>[^@]+)@(?<host>[^:]+):(?<port>\d+)\/(?<db>.+)/;
//   const match = databaseUrl.match(regex);

//   if (!match || !match.groups) {
//     throw new Error("Invalid database URL");
//   }

//   const { user, password, host, port, db } = match.groups;

//   return {
//     user,
//     password,
//     host,
//     port,
//     db,
//   };
// }
