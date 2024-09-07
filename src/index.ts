#!/usr/bin/env node

import { parseArgs } from "./cli.js";
import chalk from "chalk";

import { Process, writeSystemLog } from "./process.js";

function main(argv: string[]) {
	const arg = parseArgs(argv);

	let count = 0;
	const exitHandler = () => {
		count--;
		if (count === 0) {
			process.exit(0);
		}
	};

	const processList: Process[] = [];
	for (let i = 0; i < arg.userCmd.length; i++) {
		const cmd = arg.userCmd[i];
		const tag = (i + 1).toString();
		const process = new Process(i, tag, cmd);
		process.setExitHandler(exitHandler);
		process.start();
		processList.push(process);
		count += 1;
	}

	// handle SIGINT = CTRL+C
	process.once("SIGINT", () => {
		writeSystemLog("Received SIGINT signal");
		for (const process of processList) {
			process.kill();
		}
		process.exit(0);
	});

	// handle EOF = CTRL+D
	process.stdin.resume();
	process.stdin.on("end", () => {
		writeSystemLog("Received EOF signal");
		for (const process of processList) {
			process.kill();
		}
		process.exit(0);
	});
}

try {
	main(process.argv);
} catch (e) {
	if (e instanceof Error) {
		console.error(chalk.red(e.message));
	} else {
		console.error(`Unreachable Code: Something not an Error is thrown: ${e}`);
	}
	process.exit(1);
}
