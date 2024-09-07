# matome
Run multiple development servers simultaneously.

---

Sometimes we need to run multiple dev servers simultaneously, especially when using platforms like Cloudflare or Vercel.
This can often be a hassle for developers.

`matome` is a CLI tool designed to solve this problem.
It allows you to run multiple commands at once by combining them with a hyphen.
The stdout from each executed process is aggregated into a single, color-coded output for better readability.


## Alternative Solutions
If you're using `pnpm`, you might consider the `run` command with the `-r` option.
For more information, refer to [the pnpm documentation](https://pnpm.io/cli/recursive).


## Install
You need Node.js version 18 or higher.
You can install `matome` using any of the following package managers:

```bash
npm install --save-dev matome
```

```bash
yarn add --dev matome
```

```bash
pnpm add --save-dev matome
```

## Usage
To run multiple commands, simply concatenate them with a hyphen:

```bash
matome -- echo "Hello" -- echo "Goodbye"
```

## What does `matome` mean?
`matome` is a Japanese noun meaning "a text that aggregates and summarizes multiple documents".


## Author
* [A software engineer working in Japan](https://github.com/mkei29)