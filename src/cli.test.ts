import { test, describe, expect } from "vitest";
import { parseArgs } from "./cli";

describe("parseArgs", () => {
	test("valid cases", () => {
		expect(parseArgs(["a", "b", "--", "c", "d"])).toEqual({
			args: ["a", "b"],
			userCmd: [["c", "d"]],
		});
		expect(parseArgs(["a", "b", "--", "c", "d", "--", "e", "f"])).toEqual({
			args: ["a", "b"],
			userCmd: [
				["c", "d"],
				["e", "f"],
			],
		});
	});

	test("invalid cases", () => {
		expect(() => parseArgs(["a", "b", "--", "c", "d", "--"])).toThrow(
			"Invalid Argument: The command cannot be end with '--'.",
		);
		expect(() => parseArgs(["a", "b", "--", "--", "c", "d"])).toThrow(
			"Invalid Argument: The command cannot be empty. Verify that '--' is not repeated consecutively.",
		);
		expect(() => parseArgs(["--", "--", "c", "d"])).toThrow(
			"Invalid Argument: The command cannot be empty. Verify that '--' is not repeated consecutively.",
		);

		expect(() => parseArgs(["a", "b"])).toThrow(
			"Invalid Argument: You must provide at least one command.",
		);
	});
});
