import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Make Karuna Smile",
  description: "A tiny mission prepared by Sufiyan.",
};

export const viewport: Viewport = {
  themeColor: "#050409",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-void text-foreground min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
