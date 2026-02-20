type LogLevel = "info" | "warn" | "error";

const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const useColor = () => {
  const term = Bun.env.TERM ?? "";
  if (term === "dumb") return false;
  return Boolean(process.stdout.isTTY);
};

const colorize = (text: string, color: string) =>
  useColor() ? `${color}${text}${colors.reset}` : text;

const timestamp = () => {
  const now = new Date();
  const tz = Bun.env.TIMEZONE?.trim() || "Asia/Jakarta";
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
  return formatter.format(now).replace(" ", "T");
};

export const logger = {
  info(message: string) {
    const prefix = colorize("INFO ", colors.green);
    const time = colorize(timestamp(), colors.dim);
    console.log(`${prefix}${time} ${message}`);
  },
  warn(message: string) {
    const prefix = colorize("WARN ", colors.yellow);
    const time = colorize(timestamp(), colors.dim);
    console.warn(`${prefix}${time} ${message}`);
  },
  error(message: string) {
    const prefix = colorize("ERROR", colors.red);
    const time = colorize(timestamp(), colors.dim);
    console.error(`${prefix}${time} ${message}`);
  },
  request(message: string) {
    const prefix = colorize("REQ  ", colors.cyan);
    const time = colorize(timestamp(), colors.dim);
    console.log(`${prefix}${time} ${message}`);
  },
};
