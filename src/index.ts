import { type ChildProcess, spawn } from "node:child_process";
import chalk from "chalk";

import { fileURLToPath } from "node:url";

const COLOR_ARRAY: CallableFunction[] = [
	chalk.red,
	chalk.green,
	chalk.yellow,
	chalk.blue,
	chalk.magenta,
	chalk.cyan,
];

interface Args {
	args: string[];
	userCmd: string[][];
}

export function parseArgs(argv: string[]): Args {
	const commands: string[][] = [];
	let current: string[] = [];

	if (argv.at(-1) === "--") {
		throw new Error("Invalid command: The command cannot be end with '--'.");
	}

	for (const arg of argv) {
		if (arg === "--") {
			commands.push(current);
			current = [];
			continue;
		}
		current.push(arg);
	}
	commands.push(current);

	// Check if there is an empty command
	if (commands.slice(1).some((cmd) => cmd.length === 0)) {
		throw new Error(
			"Invalid command: The command cannot be empty. Verify that '--' is not repeated consecutively.",
		);
	}

	return {
		args: commands[0],
		userCmd: commands.slice(1),
	};
}

function writeSystemLog(msg: string) {
	const line = `[SYSTEM] ${msg}\n`;
	process.stdout.write(chalk.gray(line));
}

class Process {
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

function main(argv: string[]) {
	const arg = parseArgs(argv);

	const processList: Process[] = [];
	for (let i = 0; i < arg.userCmd.length; i++) {
		const cmd = arg.userCmd[i];
		const tag = (i + 1).toString();
		const process = new Process(i, tag, cmd);
		process.start();
		processList.push(process);
	}

	// handle SIGINT = CTRL+C
	process.once("SIGINT", () => {
		writeSystemLog("Received SIGINT signal");
		for (const process of processList) {
			process.kill();
		}
	});

	// handle EOF = CTRL+D
	process.stdin.resume();
	process.stdin.on("end", () => {
		writeSystemLog("Received EOF signal");
		for (const process of processList) {
			process.kill();
		}
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main(process.argv.slice(2));
}
