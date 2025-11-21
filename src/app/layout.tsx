import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AttendanceProvider } from "@/contexts/attendance-context";
import { SettingsProvider } from "@/contexts/settings-context";
import AppHeader from "@/components/app-header";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Control de Asistencia",
  description: "Sistema de asistencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <SettingsProvider>
        <AttendanceProvider>
          <body
            className={`${dmSans.className} antialiased bg-background text-foreground flex flex-col min-h-screen`}
          >
            <AppHeader />
            <main className="grow min-h-[calc(100vh-var(--header-height,4rem)-var(--footer-height,2.5rem))]">
              {children}
            </main>
            <footer
              className="w-full py-4 text-center text-sm text-white border-t border-border"
              style={{ height: "var(--footer-height, 2.5rem)" }}
            >
              <p>&copy; Unidad de Informática - SECGEN</p>
            </footer>
          </body>
        </AttendanceProvider>
      </SettingsProvider>
    </html>
  );
}
