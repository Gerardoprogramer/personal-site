import { Fraunces, Inter, Geist_Mono } from "next/font/google";

// Declared once and shared by every root layout, so the font files and CSS
// variables are the same whichever layout renders the page.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const fontVariables = `${inter.variable} ${fraunces.variable} ${geistMono.variable}`;
