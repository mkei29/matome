import { describe, test, expect } from "vitest";
import { Process } from "./process";

function startAndWait(process: Process): Promise<Process> {
	return new Promise((resolve) => {
		process.setExitHandler(() => {
			resolve(process);
		});
		process.start();
	});
}

describe("Process", () => {
	test("can handle the command which exit with 0", async () => {
		const p = new Process(0, "test", ["node", "-e", "process.exit(0)"]);
		expect(p.status).toEqual("idling");

		const exited = await startAndWait(p);
		expect(exited.status).toEqual("exited");
		expect(exited.exitCode).toEqual(0);
	});

	test("can handle the command which exit with 1", async () => {
		const p = new Process(0, "test", ["node", "-e", "process.exit(1)"]);
		expect(p.status).toEqual("idling");

		const exited = await startAndWait(p);
		expect(exited.status).toEqual("exited");
		expect(exited.exitCode).toEqual(1);
	});
});
