import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JourneyLens | Website UX Evaluation",
  description:
    "AI-assisted website experience evaluation through simulated user journeys.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}