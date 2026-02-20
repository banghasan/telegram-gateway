const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
};

const colorize = (text: string, color: string) =>
  `${color}${text}${colors.reset}`;

const readPackageJson = async () => {
  const file = Bun.file("package.json");
  const text = await file.text();
  return { data: JSON.parse(text) as { name: string; version: string }, text };
};

const writePackageJson = async (data: unknown) => {
  const content = JSON.stringify(data, null, 2) + "\n";
  await Bun.write("package.json", content);
};

const parseVersion = (version: string) => {
  const parts = version.split(".").map((item) => Number(item));
  if (parts.length !== 3 || parts.some((item) => !Number.isFinite(item))) {
    throw new Error(`Invalid version: ${version}`);
  }
  return { major: parts[0], minor: parts[1], patch: parts[2] };
};

const bumpVersion = (version: string, type: "patch" | "minor" | "major") => {
  const { major, minor, patch } = parseVersion(version);
  if (type === "patch") return `${major}.${minor}.${patch + 1}`;
  if (type === "minor") return `${major}.${minor + 1}.0`;
  return `${major + 1}.0.0`;
};

const askBumpType = async (
  current: string,
): Promise<"patch" | "minor" | "major" | "cancel"> => {
  const nextPatch = bumpVersion(current, "patch");
  const nextMinor = bumpVersion(current, "minor");
  const nextMajor = bumpVersion(current, "major");

  const menu = [
    `${colorize("0", colors.cyan)}. Batal`,
    `${colorize("1", colors.cyan)}. patch  - ${nextPatch} perbaikan kecil, bugfix, tanpa perubahan besar`,
    `${colorize("2", colors.cyan)}. minor  - ${nextMinor} fitur baru, tetap kompatibel`,
    `${colorize("3", colors.cyan)}. major  - ${nextMajor} perubahan besar, breaking changes`,
  ].join("\n");

  console.log(colorize("Pilih tipe bump versi:", colors.bold));
  console.log(menu);
  process.stdout.write(colorize("Pilihan (0/1/2/3): ", colors.yellow));

  const input = await new Promise<string>((resolve) => {
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (data) => {
      process.stdin.pause();
      resolve(String(data).trim());
    });
  });

  if (input === "0" || input.toLowerCase() === "batal") return "cancel";
  if (input === "1" || input.toLowerCase() === "patch") return "patch";
  if (input === "2" || input.toLowerCase() === "minor") return "minor";
  if (input === "3" || input.toLowerCase() === "major") return "major";

  console.log(colorize("Input tidak valid. Gunakan 0/1/2/3.", colors.red));
  process.exit(1);
};

const run = async () => {
  const { data } = await readPackageJson();
  const current = data.version;
  console.log(
    `${colorize("Versi sekarang:", colors.bold)} ${colorize(current, colors.cyan)}`,
  );
  const arg = process.argv[2] as "patch" | "minor" | "major" | undefined;
  const type = arg ?? (await askBumpType(current));
  if (type === "cancel") {
    console.log(colorize("Dibatalkan.", colors.yellow));
    return;
  }
  if (type !== "patch" && type !== "minor" && type !== "major") {
    console.log(colorize("Tipe bump tidak valid.", colors.red));
    process.exit(1);
  }

  const next = bumpVersion(current, type);
  await writePackageJson({ ...data, version: next });

  console.log(
    `${colorize("OK", colors.green)} ${colorize(current, colors.cyan)} -> ${colorize(next, colors.cyan)} (${type})`,
  );
};

await run();
