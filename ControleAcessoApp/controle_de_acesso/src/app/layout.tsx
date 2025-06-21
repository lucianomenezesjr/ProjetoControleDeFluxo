import type { Metadata } from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/app/components/theme-provider";

export const metadata: Metadata = {
  title: "Controle de Acesso",
  description: "Controle de Acesso - App",
};

const font = Montserrat({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
