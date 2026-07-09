import { Suspense } from "react";
import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Suspense fallback={null}>
        <Projects />
      </Suspense>
    </>
  );
}