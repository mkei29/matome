import { type ChildProcess, spawn } from "node:child_process";
import chalk from "chalk";

const COLOR_ARRAY: CallableFunction[] = [
	chalk.red,
	chalk.green,
	chalk.yellow,
	chalk.blue,
	chalk.magenta,
	chalk.cyan,
];

export function writeSystemLog(msg: string) {
	const line = `[SYSTEM] ${msg}\n`;
	process.stdout.write(chalk.gray(line));
}

export class Process {
	id: number;
	tag: string;
	cmd: string[];
	process: ChildProcess | undefined;

	constructor(id: number, tag: string, cmd: string[]) {
		this.id = id;
		this.tag = tag;
		this.cmd = cmd;
		this.process = undefined;
	}

	start() {
		const process = spawn(this.cmd[0], this.cmd.slice(1));
		process.stdout.on("data", (data) => {
			this.writeLog(data.toString());
		});

		process.stdout.on("close", () => {
			writeSystemLog(`Process ${this.tag} is exited`);
			this.process = undefined;
		});
		this.process = process;
	}

	kill() {
		if (this.process === undefined) {
			return;
		}
		this.process.kill();
		writeSystemLog(`Sending SIGTERM signal for the process ${this.tag}`);
	}

	writeLog(msg: string) {
		const lines = msg.split(/\n/);
		const colorFunc = COLOR_ARRAY[this.id % COLOR_ARRAY.length];
		for (const line of lines) {
			const text = `[${this.tag}] ${line}\n`;
			process.stdout.write(colorFunc(text));
		}
	}
}
