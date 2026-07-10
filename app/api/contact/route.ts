import { NextResponse } from "next/server";
import { z } from "zod";
import { resend } from "@/lib/resend";
import ContactEmail from "@/emails/ContactEmail";

const contactSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    intent: z.string().trim().min(1).max(50),
    message: z.string().trim().min(10).max(2000),
    company: z.string().max(0).optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = contactSchema.safeParse(body);

        if (!parsed.success) {
              console.log("Zod validation failed:", JSON.stringify(parsed.error.flatten(), null, 2));
            return NextResponse.json(
                { error: "Datos inválidos", issues: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, intent, message, company } = parsed.data;

        if (company) {
            return NextResponse.json({ ok: true });
        }

        const to = process.env.CONTACT_TO_EMAIL;
        if (!to) {
            throw new Error("CONTACT_TO_EMAIL no está definida");
        }

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