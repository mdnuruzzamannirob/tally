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
  applicationName: "Tally",
  keywords: ["job applications", "career tracker", "interviews"],
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon-192.svg", apple: "/icons/icon-192.svg" },
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#6366f1",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <StoreProvider>
          <SessionBootstrap />
          <div>{children}</div>
          <ServiceWorkerRegistration />
        </StoreProvider>
      </body>
    </html>
  );
}
