import { Suspense } from "react";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Stack } from "@/components/sections/Stack";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Suspense fallback={null}>
        <Projects />
      </Suspense>
      <Services />
      <Stack />
      <Experience />
      <Contact />
    </>
  );
}