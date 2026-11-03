import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("@/lib/resend", () => ({
  getResend: () => ({ emails: { send } }),
}));

const { POST } = await import("./route");

const validBody = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  intent: "servicio",
  message: "Hola, me gustaría hablar de un proyecto.",
};

let ipCounter = 0;

function request(
  body: unknown,
  {
    origin = "https://gerardomartinez.dev",
    ip = `10.0.0.${++ipCounter}`,
  }: { origin?: string | null; ip?: string } = {},
) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-forwarded-for": ip,
  };
  if (origin) headers.origin = origin;
  return new Request("https://gerardomartinez.dev/api/contact", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ error: null });
  process.env.CONTACT_TO_EMAIL = "inbox@example.com";
});

describe("POST /api/contact", () => {
  it("sends the email for a valid submission", async () => {
    const res = await POST(request(validBody));

    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      to: "inbox@example.com",
      replyTo: "ada@example.com",
      subject: "Nuevo contacto (servicio) de Ada Lovelace",
    });
  });

  it("accepts both the www and the apex Origin", async () => {
    for (const origin of ["https://www.gerardomartinez.dev", "https://gerardomartinez.dev"]) {
      expect((await POST(request(validBody, { origin }))).status).toBe(200);
    }
  });

  it("rejects requests without an allowed Origin", async () => {
    expect((await POST(request(validBody, { origin: null }))).status).toBe(403);
    expect(
      (await POST(request(validBody, { origin: "https://evil.example" }))).status,
    ).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects an intent outside the allowed values", async () => {
    const res = await POST(request({ ...validBody, intent: "spam\r\nBcc: x" }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Datos inválidos" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON and oversized bodies", async () => {
    expect((await POST(request("{oops"))).status).toBe(400);
    expect((await POST(request("a".repeat(20_000)))).status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it("silently accepts the honeypot without sending", async () => {
    const res = await POST(request({ ...validBody, contactCheck: "bot" }));

    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("limits each IP to 5 requests per window", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await POST(request(validBody, { ip: "203.0.113.7" }))).status);
    }

    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
    expect(send).toHaveBeenCalledTimes(5);
  });

  it("returns 502 when Resend fails", async () => {
    send.mockResolvedValue({ error: { message: "down" } });
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect((await POST(request(validBody))).status).toBe(502);
  });
});
