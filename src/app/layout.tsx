import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SUN Longevity — MAF 180 Aerob Kondisjon, Hjertehelse & Forebyggende Livsstil",
  description: "Bygget på Dr. Phil Maffetones MAF 180-metode for maksimal fettforbrenning, aerob base, optimal søvn og biologisk langlivethet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body className="antialiased bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
