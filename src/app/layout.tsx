import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AttendanceProvider } from "@/contexts/attendance-context";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Votación Nominal | SECGEN",
  description: "Sistema de votación nominal - SECGEN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <AttendanceProvider>
        <body
          className={`${sora.className} bg-(--bg-rojo-oscuro) text-foreground flex flex-col min-h-screen`}
        >
          <main className="grow">
            {children}
          </main>
          <footer
            className="w-full py-3 text-center text-sm text-white/75 border-t border-white/25 bg-(--bg-rojo-oscuro)"
          >
            <p>&copy; Unidad de Informática - SECGEN</p>
          </footer>
        </body>
      </AttendanceProvider>
    </html>
  );
}
