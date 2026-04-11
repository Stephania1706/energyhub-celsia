"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { AppWrapper } from "@/components/app-wrapper";
import { cn } from "@/lib/utils";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="celsia" suppressHydrationWarning>
      <head>
        <title>Centro de Energía Celsia</title>
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}