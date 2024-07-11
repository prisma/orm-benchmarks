import { exec } from "child_process";
import { ConnectionDetails } from './types';

export function executeCommand(command: string, envVars: NodeJS.ProcessEnv) {
  return new Promise<void>((resolve, reject) => {
    // const childProcess = 
    exec(command, { env: { ...process.env, ...envVars } }, (error: any | null, stdout: string, stderr: string) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
        return;
      }

      if (stderr) {
        // console.error(`stderr: ${stderr}`);
      }

      // console.log(`stdout: ${stdout}`);
      resolve();
    });

    // Optional: Stream the output in real-time
    // childProcess.stdout?.on("data", (data: any) => console.log(data.toString()));
    // childProcess.stderr?.on("data", (data: any) => console.error(data.toString()));
  });
}

export function extractConnectionDetailsFromUrl(databaseUrl: string): ConnectionDetails {
  const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  // const regex = /^mysql:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+).*/;
  // console.log(`Extract DB URL: `, databaseUrl);
  const match = databaseUrl.match(regex);

  if (!match) {
    throw new Error('Invalid database URL');
  }

  // console.log(`regex: `, match);

  // MySQL
  // const [_, user, password, host, dbname] = match;

  // return {
  //   user,
  //   password,
  //   host,
  //   db: dbname
  // };

  // PostgreSQL
  const [_, user, password, host, port, db] = match;

  return {
    user,
    password,
    host,
    port,
    db
  };
}