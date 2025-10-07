import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather & AQI Dashboard",
  description: "Cuaca & kualitas udara Indonesia — Next.js + Open APIs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}