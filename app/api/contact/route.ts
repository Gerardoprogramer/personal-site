import { NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "@/lib/resend";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";
import { SITE_URL } from "@/content/profile";
import ContactEmail from "@/emails/ContactEmail";

const MAX_BODY_BYTES = 10_000;

const contactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().max(254).pipe(z.email()),
    intent: z.enum(["servicio", "posicion", "otro"]),
    message: z.string().trim().min(10).max(2000),
    contactCheck: z.string().trim().max(200).optional(),
});

// 5 submissions per IP every 10 minutes.
const rateLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function isAllowedOrigin(req: Request) {
    const origin = req.headers.get("origin");
    if (!origin) return false;

    let originHost: string;
    try {
        originHost = new URL(origin).host;
    } catch {
        return false;
    }

    const apexHost = new URL(SITE_URL).host.replace(/^www\./, "");
    const allowed = [
        apexHost,
        `www.${apexHost}`,
        req.headers.get("x-forwarded-host"),
        req.headers.get("host"),
    ];
    return allowed.includes(originHost);
}

export async function POST(req: Request) {
    try {
        if (!isAllowedOrigin(req)) {
            return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
        }

        const ip = getClientIp(req);
        if (ip) {
            const limited = rateLimit(ip);
            if (!limited.ok) {
                return NextResponse.json(
                    { error: "Demasiadas solicitudes" },
                    { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
                );
            }
        }

        const raw = await req.text();
        if (raw.length > MAX_BODY_BYTES) {
            return NextResponse.json({ error: "Solicitud demasiado grande" }, { status: 413 });
        }

        let body: unknown;
        try {
            body = JSON.parse(raw);
        } catch {
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }

        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
            console.warn(
                "Contact validation failed:",
                parsed.error.issues.map((issue) => issue.path.join("."))
            );
            return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
        }

        const { name, email, intent, message, contactCheck } = parsed.data;

        if (contactCheck) {
            return NextResponse.json({ ok: true });
        }

        const to = process.env.CONTACT_TO_EMAIL;
        if (!to) {
            throw new Error("CONTACT_TO_EMAIL no está definida");
        }

        const resend = getResend();
        const { error } = await resend.emails.send({
            from: "Portfolio <contacto@gerardomartinez.dev>",
            to,
            replyTo: email,
            subject: `Nuevo contacto (${intent}) de ${name}`,
            react: ContactEmail({ name, email, intent, message }),
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: "No se pudo enviar el mensaje" },
                { status: 502 }
            );
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact route error:", err);
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}
