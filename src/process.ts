import { type ChildProcess, spawn } from "node:child_process";
import chalk from "chalk";

type ProcessStatus = "idling" | "running" | "exited";

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
	status: ProcessStatus = "idling";
	process: ChildProcess | undefined; // has value only when the process is started
	exitCode: number | undefined; // has value only when the process is exited
	exitHandler?: (code: number) => void;

	constructor(id: number, tag: string, cmd: string[]) {
		this.id = id;
		this.tag = tag;
		this.cmd = cmd;
		this.process = undefined;
	}

	setExitHandler(handler: (code: number) => void) {
		this.exitHandler = handler;
	}

	start() {
		const process = spawn(this.cmd[0], this.cmd.slice(1));
		process.stdout.on("data", (data: unknown) => {
			if (Buffer.isBuffer(data)) {
				this.writeLog(data.toString());
				return;
			}
			writeSystemLog(
				`Runtime Error: Unknown object is passed from the process '${this.tag}'`,
			);
		});

		process.stdout.on("close", (data: unknown) => {
			if (Buffer.isBuffer(data)) {
				this.writeLog(data.toString());
				return;
			}
			writeSystemLog(
				`Runtime Error: Unknown object is passed from the process '${this.tag}'`,
			);
		});

		process.on("exit", (code: number) => {
			writeSystemLog(`Process ${this.tag} is exited with code ${code}`);
			this.process = undefined;
			this.status = "exited";
			this.exitHandler?.(code);
			this.exitCode = code;
		});

		this.process = process;
		this.status = "running";
	}

	kill() {
		if (this.process === undefined) {
			return;
		}
		this.process.kill();
		writeSystemLog(`Sending SIGTERM signal for the process ${this.tag}`);
		this.process = undefined;
		this.status = "exited";
	}

	writeLog(msg: string) {
		const lines = msg.split(/\n/);
		if (lines.at(-1) === "") {
			lines.pop();
		}
		const colorFunc = COLOR_ARRAY[this.id % COLOR_ARRAY.length];
		for (const line of lines) {
			const text = `[${this.tag}] ${line}\n`;
			process.stdout.write(colorFunc(text));
		}
	}
}
