import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { InstallAppBanner } from "@/components/layout/install-app-banner";
import { SyncIndicator } from "@/components/layout/sync-indicator";
import { brand } from "@/lib/config/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pohuntoon.com"),
  title: {
    default: brand.name,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: brand.name,
    description: brand.description,
    siteName: brand.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: brand.name,
    description: brand.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: brand.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-background text-foreground font-sans">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <InstallAppBanner />
        <SyncIndicator />
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}
