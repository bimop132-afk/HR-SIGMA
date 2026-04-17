import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR SIGMA",
  description: "HR SIGMA - Sistem Informasi Manajemen HR",
};

import { Toaster } from "react-hot-toast";
import AnimateWrapper from "@/components/AnimateWrapper";
import AnimatedNotificationFeed from "@/components/ui/AnimatedNotificationFeed";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} pb-24 antialiased font-body bg-background text-on-background`}
      >
        <Toaster position="top-right" toastOptions={{ style: { background: '#1c1c1e', color: '#fff' } }} />
        <AnimatedNotificationFeed />
        <AnimateWrapper>{children}</AnimateWrapper>
      </body>
    </html>
  );
}
