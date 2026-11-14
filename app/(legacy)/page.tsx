import dynamic from "next/dynamic";
import { headers } from "next/headers";
import { JsonLd } from "@/components/seo/JsonLd";
import { toLanguage } from "@/lib/i18n/lang";
import { personJsonLd } from "@/lib/structured-data";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";

const Projects = dynamic(() =>
  import("@/components/sections/Projects").then((mod) => mod.Projects),
);
const Services = dynamic(() =>
  import("@/components/sections/Services").then((mod) => mod.Services),
);
const Stack = dynamic(() =>
  import("@/components/sections/Stack").then((mod) => mod.Stack),
);
const Experience = dynamic(() =>
  import("@/components/sections/Experience").then((mod) => mod.Experience),
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((mod) => mod.Contact),
);

export default async function Home() {
  const lang = toLanguage((await headers()).get("x-language"));
  return (
    <>
      <JsonLd data={personJsonLd(lang)} />
      <Hero />
      <Projects />
      <Experience />
      <About />
      <Stack />
      <Services />
      <Contact />
    </>
  );
}
