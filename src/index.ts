import { parseArgs } from "./cli.js";

import { Process, writeSystemLog } from "./process.js";

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

main(process.argv.slice(2));
