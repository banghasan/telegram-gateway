import { Api } from "grammy";
import { logger } from "./logger";

export type TelegramClient = {
  call: (method: string, payload: unknown) => Promise<unknown>;
};

const normalizeApiRoot = (apiRoot: string) => {
  if (!apiRoot) return apiRoot;
  return apiRoot.endsWith("/") ? apiRoot.slice(0, -1) : apiRoot;
};

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
};

export const createTelegramClient = (
  token: string,
  apiRoot: string,
): TelegramClient => {
  const normalizedRoot = normalizeApiRoot(apiRoot);
  const api = new Api(token, { apiRoot: normalizedRoot });
  const apiAny = api as unknown as {
    raw?: (method: string, payload: unknown) => Promise<unknown>;
    callApi?: (method: string, payload: unknown) => Promise<unknown>;
  };

  return {
    call: async (method: string, payload: unknown) => {
      if (typeof apiAny.raw === "function") {
        return apiAny.raw(method, payload);
      }
      if (typeof apiAny.callApi === "function") {
        return apiAny.callApi(method, payload);
      }

      const url = `${normalizedRoot}/bot${token}/${method}`;
      const redactedPath = `/${method}`;
      const body = payload ?? {};
      logger.request(
        `[telegram] -> POST ${redactedPath} body=${safeStringify(body)}`,
      );

      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      if (res.ok) {
        logger.info(
          `[telegram] <- ${res.status} ${res.statusText} path=${redactedPath} body=${text}`,
        );
      } else {
        logger.error(
          `[telegram] <- ${res.status} ${res.statusText} path=${redactedPath} body=${text}`,
        );
      }

      if (!res.ok) {
        throw new Error(`Telegram API error (${res.status}): ${text}`);
      }

      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    },
  };
};
