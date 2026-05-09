import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { cn } from "../lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hogy AI | URL to Prompt",
  description: "Distill any website into a high-quality AI prompt.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "antialiased selection:bg-neon-cyan/30")}>
        <div className="aurora-bg">
          <div className="aurora-orb bg-neon-purple w-[500px] h-[500px] -top-48 -left-48" />
          <div className="aurora-orb bg-neon-cyan w-[600px] h-[600px] -bottom-48 -right-48" />
          <div className="aurora-orb bg-purple-900 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        </div>
        <main className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12">
          {children}
          <footer className="mt-auto pt-12 pb-6 text-sm text-white/40">
            <p>© 2026 Hogy AI. Powered by Hogy.</p>
          </footer>
        </main>
      </body>
    </html>
  );
}
