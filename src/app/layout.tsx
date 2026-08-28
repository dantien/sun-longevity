import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "SUN Longevity — MAF 180 Aerob Kondisjon, Hjertehelse & Forebyggende Livsstil",
  description: "Bygget på Dr. Phil Maffetones MAF 180-metode for maksimal fettforbrenning, aerob base, optimal søvn og biologisk langlivethet.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SUN Longevity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 touch-manipulation">
        {children}
      </body>
    </html>
  );
}
