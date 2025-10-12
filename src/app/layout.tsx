import "./globals.css";
import { ThemeProvider } from "next-themes";

export const metadata = {
  title: "Weather & AQI Dashboard",
  description: "Cuaca & kualitas udara Indonesia — Next.js + Open APIs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}