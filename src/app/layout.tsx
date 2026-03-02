import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoAlert - Multi-Horizon Forecasting Engine",
  description: "Advanced prediction system synthesizing historical patterns, structural forces, current events, and contrarian viewpoints",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
