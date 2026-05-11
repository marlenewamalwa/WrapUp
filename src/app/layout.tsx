import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WrapUp",
  description: "Fresh wraps, made for you. Nairobi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}