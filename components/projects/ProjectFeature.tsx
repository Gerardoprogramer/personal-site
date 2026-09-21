"use client";

import Image from "next/image";
import type { ProjectSlug } from "@/content/projects";
import { useTranslation } from "@/lib/i18n/context";

export function ProjectFeature({ slug }: { slug: ProjectSlug }) {
  const { language } = useTranslation();
  const es = language === "es";
  if (slug === "obsidian-library") {
    const stages = es
      ? [
          [
            "01",
            "El lector solicita",
            "Selecciona una membresía o una multa pendiente.",
          ],
          [
            "02",
            "Stripe procesa",
            "El servidor prepara el pago con el importe validado.",
          ],
          [
            "03",
            "El backend confirma",
            "Verifica el evento y registra el resultado una sola vez.",
          ],
          [
            "04",
            "La interfaz responde",
            "Consulta el estado confirmado y actualiza la experiencia.",
          ],
        ]
      : [
          [
            "01",
            "The reader requests",
            "Selects a membership or an outstanding fine.",
          ],
          [
            "02",
            "Stripe processes",
            "The server prepares checkout with a validated amount.",
          ],
          [
            "03",
            "The backend confirms",
            "Verifies the event and records the result once.",
          ],
          [
            "04",
            "The interface responds",
            "Checks the confirmed status and updates the experience.",
          ],
        ];
    return (
      <section className="rounded-xl border border-[#dfb978]/20 bg-[#211b13] p-6 sm:p-10">
        <p className="eyebrow mb-4 text-[#dfb978]">
          {es
            ? "Un recorrido dentro del sistema"
            : "A journey through the system"}
        </p>
        <h2 className="max-w-2xl font-display text-3xl sm:text-4xl">
          {es
            ? "Un pago confirmado tiene más de una pantalla detrás."
            : "A confirmed payment takes more than a screen."}
        </h2>
        <ol className="mt-10 grid gap-7 md:grid-cols-4">
          {stages.map(([number, title, body]) => (
            <li key={number} className="border-t border-[#dfb978]/30 pt-5">
              <span className="font-mono-tech text-xs text-[#dfb978]">
                {number}
              </span>
              <h3 className="mb-3 mt-4 font-medium">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-8 border-t border-[#dfb978]/20 pt-5 text-xs leading-relaxed text-muted-foreground">
          {es
            ? "Esquema del flujo implementado. Volver desde Stripe no activa por sí solo la membresía: el servidor debe confirmar el pago."
            : "Diagram of the implemented flow. Returning from Stripe alone does not activate a membership: the server must confirm payment."}
        </p>
      </section>
    );
  }
  if (slug === "la-central")
    return (
      <section className="rounded-xl border border-[#91c6a4]/20 bg-[#142019] p-6 sm:p-10">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow mb-4 text-[#91c6a4]">
              {es ? "Pensado para el local" : "Built for the store"}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl">
              {es
                ? "Una red local. Una sola fuente de datos."
                : "One local network. One shared source of data."}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {es
                ? "La PC principal sirve la aplicación y conserva la base de datos. Las cajas trabajan desde el navegador y reciben actualizaciones de existencias mediante Socket.IO."
                : "The main PC serves the application and holds the database. Registers work in a browser and receive stock updates through Socket.IO."}
            </p>
          </div>
          <div
            aria-label={
              es
                ? "Arquitectura de la instalación local"
                : "Local installation architecture"
            }
            className="text-center"
          >
            <div className="rounded-lg border border-[#91c6a4]/40 bg-background/30 px-5 py-6">
              <span className="font-mono-tech text-xs text-[#91c6a4]">
                {es ? "PC PRINCIPAL" : "MAIN PC"}
              </span>
              <p className="mt-2 text-lg">NestJS + PostgreSQL</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Docker Compose · Nginx
              </p>
            </div>
            <div
              aria-hidden="true"
              className="mx-auto h-6 w-px bg-[#91c6a4]/40"
            />
            <div className="font-mono-tech text-xs text-[#91c6a4]">
              {es ? "RED LOCAL / LAN" : "LOCAL NETWORK / LAN"}
            </div>
            <div
              aria-hidden="true"
              className="mx-auto h-6 w-px bg-[#91c6a4]/40"
            />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="rounded-lg border border-[#91c6a4]/30 bg-background/20 p-4"
                >
                  <p className="text-sm">
                    {es ? "Caja" : "Register"} {n}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {es ? "Navegador" : "Browser"}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              {es
                ? "Esquema de una instalación con dos cajas. Requiere la PC principal y la red encendidas."
                : "Example of a two-register installation. The main PC and network must remain available."}
            </p>
          </div>
        </div>
      </section>
    );
  return (
    <section className="overflow-hidden rounded-xl bg-[#e7e3d7] text-[#252d25]">
      <div className="p-6 sm:p-10">
        <p className="eyebrow mb-4 text-[#536449]">
          {es
            ? "Una composición para cada pantalla"
            : "A composition for every screen"}
        </p>
        <h2 className="max-w-xl font-display text-3xl sm:text-4xl">
          {es
            ? "Cambiar el recorrido, conservar la identidad."
            : "Change the journey. Keep the identity."}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#515a50]">
          {es
            ? "En escritorio, la fotografía acompaña el relato desde una posición fija. En móvil, imagen y texto se suceden con un ritmo propio."
            : "On desktop, photography accompanies the story from a sticky position. On mobile, image and text follow one another at their own pace."}
        </p>
      </div>
      <div className="grid grid-cols-[1fr_0.32fr] items-start gap-3 px-4 pb-6 sm:gap-7 sm:px-10 sm:pb-10">
        <Image
          src="/projects/selvatica-experiences.png"
          alt={
            es
              ? "Sección de experiencias de Selvática en escritorio"
              : "Selvática experiences section on desktop"
          }
          width={1440}
          height={1000}
          sizes="(max-width: 768px) 65vw, 780px"
          className="mt-7 h-auto w-full rounded-md shadow-xl"
        />
        <Image
          src="/projects/selvatica-mobile.png"
          alt={
            es
              ? "Portada de Selvática adaptada a móvil"
              : "Selvática homepage adapted for mobile"
          }
          width={390}
          height={844}
          sizes="(max-width: 768px) 22vw, 260px"
          className="h-auto w-full rounded-xl border-4 border-[#252d25] shadow-xl"
        />
      </div>
    </section>
  );
}
