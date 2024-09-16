import type { Metadata } from "next";
import "./globals.css";

import Link from "next/link";
import { CalculatorIcon, HandHelpingIcon } from "lucide-react";
import NavLink from "@/components/NavLink/NavLink";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "HELPLY",
  description: "Helply is a platform for helping people in need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ua">
      <body>
        <div className="flex min-h-screen w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6">
            <nav className=" flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
                href="/"
                title="HELPLY"
              >
                <HandHelpingIcon className="h-6 w-6" />
                <span className="sr-only">HELPLY</span>
              </Link>
            </nav>
          </header>
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
              <h1 className="text-3xl font-semibold">Сервіси</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav
                className="grid gap-4 text-sm text-muted-foreground"
                x-chunk="dashboard-04-chunk-0"
              >
                <NavLink
                  href="/grade-converter"
                  className="inline-flex items-center gap-2 font-semibold text-primary text-gray-700 p-2 rounded-lg transition-colors"
                  activeClassName="text-gray-900 bg-gray-100"
                >
                  <CalculatorIcon className="w-6 h-6" />
                  Перерахунок балу
                </NavLink>
              </nav>
              <div className="grid gap-6">
                <Suspense>{children}</Suspense>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
