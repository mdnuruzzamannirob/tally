import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/providers/ServiceWorkerRegistration";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { SessionBootstrap } from "@/features/auth/SessionBootstrap";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Tally", template: "%s | Tally" },
  description: "Track your job applications, interviews, and follow-ups.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <StoreProvider>
          <SessionBootstrap />
          {children}
          <ServiceWorkerRegistration />
        </StoreProvider>
      </body>
    </html>
  );
}
