import { describe, expect, it } from "bun:test";
import { createApp } from "../src/app";
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

    const app = createApp({ telegram });

    const res = await app.handle(
      new Request("http://localhost/sendMessage", {
        method: "POST",
        headers: { "content-type": "application/json" },
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
});
