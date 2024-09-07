interface Args {
	args: string[];
	userCmd: string[][];
}

export function parseArgs(argv: string[]): Args {
	const commands: string[][] = [];
	let current: string[] = [];

	if (argv.at(-1) === "--") {
		throw new Error("Invalid Argument: The command cannot be end with '--'.");
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
			"Invalid Argument: The command cannot be empty. Verify that '--' is not repeated consecutively.",
		);
	}

	if (commands.length < 2) {
		throw new Error("Invalid Argument: You must provide at least one command.");
	}

	return {
		args: commands[0],
		userCmd: commands.slice(1),
	};
}
