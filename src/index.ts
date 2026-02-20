import { createApp } from "./app";
import { loadConfig } from "./config";
import { logger } from "./logger";
import { createTelegramClient } from "./telegram";

const config = loadConfig();
const telegram = createTelegramClient(
  config.telegramBotToken,
  config.telegramBaseUrl,
);

const app = createApp({ telegram, config });

app.listen({ hostname: config.host, port: config.port });

logger.info(
  `Telegram gateway listening on http://${config.host}:${config.port} (apiRoot=${config.telegramBaseUrl})`,
);
