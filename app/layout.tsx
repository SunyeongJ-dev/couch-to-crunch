// app/layout.tsx
// Global layout for the application.
import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "./ui/header";
import NextAuthProviders from "./providers/session-provider";
import { SidebarProvider } from "@/app/providers/sidebar-context";

// We load the DM Sans and Inter fonts from Google Fonts using Next.js's built-in font optimization.
// The fonts are configured with specific weights and subsets, and we assign them to CSS variables for easy use throughout the application.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// The metadata object defines the title and description for the application, which can be used by Next.js for SEO purposes and to set the page title in the browser.
export const metadata: Metadata = {
  title: "Couch to Crunch",
  description:
    "A fitness app helps you quickly find and organize home workout videos in one place, so you can start exercising without wasting time searching on YouTube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${inter.variable} antialiased`}>
        {/* The Header component is included at the top level of the layout, ensuring that it is displayed on all pages of the application. */}
        <NextAuthProviders>
          <SidebarProvider>
            <Header />
            <main className="fixed top-16 left-0 right-0 bottom-0 overflow-y-auto p-8">
              {children}
            </main>
          </SidebarProvider>
        </NextAuthProviders>
      </body>
    </html>
  );
}
