import type { Metadata } from "next";
import "./globals.css";
import {Montserrat} from 'next/font/google';
import { Toaster } from 'sonner';

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
    <html lang="pt-br">
      <body className={font.className}>
        {children}
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
