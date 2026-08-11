import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { ServiceWorkerRegistration } from "@/components/providers/ServiceWorkerRegistration";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionBootstrap } from "@/features/auth/SessionBootstrap";
import "./globals.css";

const ubuntu = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-ubuntu",
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
      <body className={ubuntu.variable}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <StoreProvider>
          <TooltipProvider>
            <SessionBootstrap />
            <div>{children}</div>
            <Toaster
              expand
              richColors
              duration={5000}
              visibleToasts={3}
              position="top-right"
              swipeDirections={["bottom", "top", "left", "right"]}
            />
            <ServiceWorkerRegistration />
          </TooltipProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
