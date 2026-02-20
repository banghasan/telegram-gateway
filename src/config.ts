export type AppConfig = {
  host: string;
  port: number;
  telegramBaseUrl: string;
  telegramBotToken: string;
  appName: string;
  apiKey?: string;
  allowedMethods?: Set<string>;
};

export const loadConfig = (): AppConfig => {
  const host = Bun.env.HOST?.trim() || "localhost";
  const portRaw = Bun.env.PORT?.trim() || "11000";
  const telegramBaseUrl = Bun.env.TELEGRAM_BASE_URL?.trim() || "http://localhost:8081";
  const telegramBotToken = Bun.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const appName = Bun.env.APP_NAME?.trim() || "Telegram Gateway";
  const apiKey = Bun.env.API_KEY?.trim() || "";
  const allowedMethodsRaw = Bun.env.TELEGRAM_ALLOWED_METHODS?.trim() || "";

  const port = Number(portRaw);
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT: ${portRaw}`);
  }
  if (!telegramBotToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
  }

  const allowedMethods = allowedMethodsRaw
    ? new Set(
        allowedMethodsRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      )
    : undefined;

  return {
    host,
    port,
    telegramBaseUrl,
    telegramBotToken,
    appName,
    apiKey: apiKey || undefined,
    allowedMethods,
  };
};
