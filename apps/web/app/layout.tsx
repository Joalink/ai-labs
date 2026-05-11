import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JoaLink Labs",
  description: "AI-powered tools",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          <div className="relative flex flex-col min-h-screen bg-zinc-100 dark:bg-zinc-950">
            <div
              className="fixed inset-0 pointer-events-none z-0"
              style={{
                backgroundImage:
                  "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            <div
              className="fixed -top-24 -left-20 w-80 h-80 rounded-full pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(83,74,183,0.15) 0%, transparent 70%)",
              }}
            />
            <div
              className="fixed -bottom-20 -right-16 w-72 h-72 rounded-full pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(29,158,117,0.13) 0%, transparent 70%)",
              }}
            />

            <Navigation />

            <main className="relative z-10 flex-1 lg:ml-64 mt-14 p-4">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
