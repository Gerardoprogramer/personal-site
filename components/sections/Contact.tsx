'use client';

import { SectionHeader } from "../shared/SectionHeader";
import { useState } from "react";
import { profileStatic as profile } from "@/content/profile";
import { useTranslation } from "@/lib/i18n/context";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

export const Contact = () => {
    const { t } = useTranslation();
    const [intent, setIntent] = useState("servicio");
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const intents = [
        { value: "servicio", label: t.contact.intents.service },
        { value: "posicion", label: t.contact.intents.position },
        { value: "otro", label: t.contact.intents.other },
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("sending");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            intent,
            message: formData.get("message"),
            company: formData.get("company") || "",
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed");

            setStatus("sent");
            form.reset();
        } catch {
            setStatus("error");
        }
    };

    return (
        <section id="contacto" className="py-24">
            <div className="mx-auto max-w-3xl px-6">
                <SectionHeader
                    align="center"
                    eyebrow={t.contact.header.eyebrow}
                    title={t.contact.header.title}
                    description={t.contact.header.description}
                />

                <form
                    className="surface-card relative mt-12 p-6 sm:p-8"
                    onSubmit={handleSubmit}
                    aria-describedby="contact-help"
                >
                    <input
                        type="text"
                        name="company"
                        tabIndex={-1}
                        autoComplete="off"
                        className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
                        aria-hidden="true"
                    />

                    <fieldset className="mb-6">
                        <legend className="mb-3 font-mono-tech text-[11px] uppercase tracking-widest text-muted-foreground">
                            {t.contact.labels.intention}
                        </legend>
                        <div
                            role="radiogroup"
                            aria-label="Motivo del contacto"
                            className="grid gap-2 sm:grid-cols-3"
                        >
                            {intents.map((opt) => {
                                const active = intent === opt.value;
                                return (
                                    <label
                                        key={opt.value}
                                        className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${active
                                            ? "border-primary bg-primary/10 text-foreground"
                                            : "border-border bg-surface-2/40 text-muted-foreground hover:border-primary/40"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="intent"
                                            value={opt.value}
                                            checked={active}
                                            onChange={() => setIntent(opt.value)}
                                            className="sr-only"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className={`grid size-4 shrink-0 place-items-center rounded-full border ${active ? "border-primary" : "border-border"
                                                }`}
                                        >
                                            {active ? (
                                                <span className="size-1.5 rounded-full bg-primary" />
                                            ) : null}
                                        </span>
                                        <span className="font-mono-tech text-xs leading-tight">
                                            {opt.label}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="c-name"
                                className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground"
                            >
                                {t.contact.labels.name}
                            </label>
                            <input
                                id="c-name"
                                name="name"
                                required
                                type="text"
                                autoComplete="name"
                                className="mt-2 h-11 w-full rounded-md border border-border bg-surface-2/40 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary"
                                placeholder={t.contact.placeholders.name}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="c-email"
                                className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground"
                            >
                                {t.contact.labels.email}
                            </label>
                            <input
                                id="c-email"
                                name="email"
                                required
                                type="email"
                                autoComplete="email"
                                className="mt-2 h-11 w-full rounded-md border border-border bg-surface-2/40 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary"
                                placeholder={t.contact.placeholders.email}
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label
                            htmlFor="c-message"
                            className="font-mono-tech text-[10px] uppercase tracking-widest text-muted-foreground"
                        >
                            {t.contact.labels.message}
                        </label>
                        <textarea
                            id="c-message"
                            name="message"
                            required
                            minLength={10}
                            rows={5}
                            className="mt-2 w-full rounded-md border border-border bg-surface-2/40 px-3 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus:border-primary"
                            placeholder={
                                intent === "posicion"
                                    ? t.contact.placeholders.position
                                    : intent === "servicio"
                                        ? t.contact.placeholders.service
                                        : t.contact.placeholders.other
                            }
                        />
                    </div>

                    <div
                        id="contact-help"
                        className="mt-3 font-mono-tech text-[11px] text-muted-foreground"
                        role="status"
                        aria-live="polite"
                    >
                        {status === "error"
                            ? "Hubo un error al enviar. Intenta de nuevo o escríbeme directamente."
                            : t.contact.help}
                    </div>

                    <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <a
                            href={`mailto:${profile.email}`}
                            className="inline-flex items-center gap-2 font-mono-tech text-xs text-muted-foreground transition-colors hover:text-primary"
                        >
                            {t.contact.directEmail}{" "}
                            <span className="text-foreground">{profile.email}</span>
                        </a>
                        <button
                            type="submit"
                            disabled={status === "sending" || status === "sent"}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 font-mono-tech text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-70"
                            style={{ boxShadow: "var(--shadow-glow)" }}
                        >
                            {status === "sent" ? (
                                <>
                                    {t.contact.button.sent}
                                    <FaCheck />
                                </>
                            ) : status === "sending" ? (
                                <>Enviando...</>
                            ) : (
                                <>
                                    {t.contact.button.send}
                                    <FaArrowRight />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}