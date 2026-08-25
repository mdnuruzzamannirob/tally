import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import { AppToaster, AppTooltipProvider } from "@/components/app-ui";
import { ServiceWorkerRegistration } from "@/components/providers/ServiceWorkerRegistration";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { SessionBootstrap } from "@/features/auth/SessionBootstrap";
import "./globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html className={inter.variable} lang="en" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AppTooltipProvider>
              <SessionBootstrap />
              <div>{children}</div>
              <AppToaster
                expand
                richColors
                duration={5000}
                visibleToasts={3}
                position="top-right"
                swipeDirections={["bottom", "top", "left", "right"]}
              />
              <ServiceWorkerRegistration />
            </AppTooltipProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
