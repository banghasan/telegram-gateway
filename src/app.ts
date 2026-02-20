import { Elysia } from "elysia";
import { logger } from "./logger";
import type { AppConfig } from "./config";
import type { TelegramClient } from "./telegram";

export type AppDeps = {
  telegram: TelegramClient;
  config: AppConfig;
};

export const createApp = ({ telegram, config }: AppDeps) => {
  return new Elysia()
    .get("/", () => ({
      name: config.appName,
      version: Bun.env.npm_package_version ?? "unknown",
      timezone: Bun.env.TIMEZONE?.trim() || "Asia/Jakarta",
    }))
    .get("/health", () => ({
      ok: true,
      service: config.appName,
      version: Bun.env.npm_package_version ?? "unknown",
      timezone: Bun.env.TIMEZONE?.trim() || "Asia/Jakarta",
      allowedMethods: config.allowedMethods ? Array.from(config.allowedMethods).sort() : null,
      authRequired: Boolean(config.apiKey),
    }))
    .post("/:method", async ({ params, body, set, headers }) => {
      const { method } = params;
      const requestId = crypto.randomUUID();
      const startedAt = Date.now();

      if (config.apiKey) {
        const incomingKey = headers["x-api-key"];
        if (!incomingKey || incomingKey !== config.apiKey) {
          set.status = 401;
          logger.warn(`[${requestId}] unauthorized`);
          return { ok: false, error: "Unauthorized" };
        }
      }

      if (config.allowedMethods && !config.allowedMethods.has(method)) {
        set.status = 403;
        logger.warn(`[${requestId}] forbidden method=${method}`);
        return { ok: false, error: "Method is not allowed" };
      }

      if (!method) {
        set.status = 400;
        logger.warn(`[${requestId}] missing method`);
        return { ok: false, error: "Method is required" };
      }

      const verbose = Bun.env.LOG_VERBOSE?.trim().toLowerCase() === "true";
      if (verbose) {
        logger.request(`[${requestId}] -> ${method} payload=${JSON.stringify(body ?? {})}`);
      } else {
        logger.request(`[${requestId}] -> ${method}`);
      }
      try {
        const result = await telegram.call(method, body ?? {});
        const durationMs = Date.now() - startedAt;
        logger.info(`[${requestId}] <- ${method} status=200 durationMs=${durationMs}`);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const durationMs = Date.now() - startedAt;
        set.status = 502;
        logger.error(
          `[${requestId}] <- ${method} status=${set.status} durationMs=${durationMs} message=${message}`,
        );
        return { ok: false, error: message };
      }
    });
};
