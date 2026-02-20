import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app";
import type { AppConfig } from "../src/config";
import type { TelegramClient } from "../src/telegram";

describe("telegram gateway", () => {
  it("forwards method and payload", async () => {
    let calledMethod: string | undefined;
    let calledPayload: unknown;

    const telegram: TelegramClient = {
      call: async (method, payload) => {
        calledMethod = method;
        calledPayload = payload;
        return { ok: true, method, payload };
      },
    };

    const config: AppConfig = {
      host: "localhost",
      port: 11000,
      telegramBaseUrl: "http://localhost:8081",
      telegramBotToken: "token",
      appName: "Telegram Gateway",
      apiKey: "secret",
    };

    const app = createApp({ telegram, config });

    const res = await app.handle(
      new Request("http://localhost/sendMessage", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": "secret" },
        body: JSON.stringify({ chat_id: 123, text: "Halo" }),
      }),
    );

    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({
      ok: true,
      method: "sendMessage",
      payload: { chat_id: 123, text: "Halo" },
    });
    expect(calledMethod).toBe("sendMessage");
    expect(calledPayload).toEqual({ chat_id: 123, text: "Halo" });
  });

  it("rejects when api key is required and missing", async () => {
    const telegram: TelegramClient = {
      call: async () => ({ ok: true }),
    };

    const config: AppConfig = {
      host: "localhost",
      port: 11000,
      telegramBaseUrl: "http://localhost:8081",
      telegramBotToken: "token",
      appName: "Telegram Gateway",
      apiKey: "secret",
    };

    const app = createApp({ telegram, config });

    const res = await app.handle(
      new Request("http://localhost/sendMessage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: 123, text: "Halo" }),
      }),
    );

    expect(res.status).toBe(401);
  });

  it("rejects when method is not in allowlist", async () => {
    const telegram: TelegramClient = {
      call: async () => ({ ok: true }),
    };

    const config: AppConfig = {
      host: "localhost",
      port: 11000,
      telegramBaseUrl: "http://localhost:8081",
      telegramBotToken: "token",
      appName: "Telegram Gateway",
      allowedMethods: new Set(["sendMessage"]),
    };

    const app = createApp({ telegram, config });

    const res = await app.handle(
      new Request("http://localhost/sendPhoto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: 123, photo: "x" }),
      }),
    );

    expect(res.status).toBe(403);
  });
});
