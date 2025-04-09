import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/redux/provider";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://papercrate.io"),
  title: {
    default: "PaperCrate.io",
    template: "%s | PaperCrate.io",
  },
  description:
    "PaperCrate is a Modern SaaS platform for invoicing, payments, and business onboarding.",
  keywords: [
    "SaaS",
    "invoicing",
    "payments",
    "multi-tenant",
    "Clerk auth",
    "Neon database",
    "Next.js 15",
    "Prisma",
    "ShadCN UI",
  ],
  authors: [
    {
      name: "Webdev2776",
      url: "https://www.sdharrington.com/",
    },
  ],
  publisher: "2776, LLC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
