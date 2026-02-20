import { Elysia } from "elysia";
import { logger } from "./logger";
import type { TelegramClient } from "./telegram";

export type AppDeps = {
  telegram: TelegramClient;
};

export const createApp = ({ telegram }: AppDeps) => {
  return new Elysia()
    .get("/health", () => ({ ok: true }))
    .post("/:method", async ({ params, body, set }) => {
      const { method } = params;
      const requestId = crypto.randomUUID();
      const startedAt = Date.now();

      if (!method) {
        set.status = 400;
        logger.warn(`[${requestId}] missing method`);
        return { ok: false, error: "Method is required" };
      }

      try {
        logger.request(`[${requestId}] -> ${method} payload=${JSON.stringify(body ?? {})}`);
        const result = await telegram.call(method, body ?? {});
        const durationMs = Date.now() - startedAt;
        logger.info(`[${requestId}] <- ${method} ok durationMs=${durationMs}`);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const durationMs = Date.now() - startedAt;
        logger.error(
          `[${requestId}] <- ${method} error durationMs=${durationMs} message=${message}`,
        );
        set.status = 502;
        return { ok: false, error: message };
      }
    });
};
