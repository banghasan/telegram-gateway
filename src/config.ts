export type AppConfig = {
  host: string;
  port: number;
  telegramBaseUrl: string;
  telegramBotToken: string;
};

export const loadConfig = (): AppConfig => {
  const host = Bun.env.HOST?.trim() || "localhost";
  const portRaw = Bun.env.PORT?.trim() || "11000";
  const telegramBaseUrl = Bun.env.TELEGRAM_BASE_URL?.trim() || "http://localhost:8081";
  const telegramBotToken = Bun.env.TELEGRAM_BOT_TOKEN?.trim() || "";

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${portRaw}`);
  }
  if (!telegramBotToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
  }

  return {
    host,
    port,
    telegramBaseUrl,
    telegramBotToken,
  };
};
