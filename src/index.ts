
import { spawn } from 'node:child_process';

interface Args {
  args: string[];
  userCmd: string[][];
}

function parseArgs(argv: string[]): Args {
  return {
    args: [],
    userCmd: [],
  };
}

function writeLog(tag: string, msg: string) {
  const line = `[${tag}] ${msg}`;
  process.stdout.write(line);
}

function main(argv: string[]) {
  const commands: string[][] = [];
  let current: string[] = [];

  for (const arg of argv) {
    if (arg == "--") {
      commands.push(current);
      current = [];
      continue;
    }
    current.push(arg);
  }
  commands.push(current);


  const userCmd = commands.slice(1); 
  for (let i=0 ; i < userCmd.length; i++) {
    const cmd = userCmd[i];
    const process = spawn(cmd[0], cmd.slice(1));

    const tag = (i+1).toString();
    process.stdout.on('data', (data) => { writeLog(tag, data); });
  }
}

const arg = process.argv.slice(2);
main(arg);