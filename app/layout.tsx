import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Card from "@/app/components/Card";
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
  title: "Ejercicio 4: API Plazo Fijo - Bersa",
  description: "Postulante: Gotte, Brian N.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full p-4 md:p-8 lg:p-12">
        <Card>
          {children}
        </Card>
      </body>
    </html>
  );
}
