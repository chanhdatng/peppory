import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3, Caveat } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Peppory - Gốm Thủ Công",
    template: "%s | Peppory",
  },
  description: "Tiệm gốm thủ công với phong cách wabi-sabi, tôn vinh vẻ đẹp của sự không hoàn hảo.",
  keywords: ["gốm", "pottery", "thủ công", "handmade", "wabi-sabi", "Việt Nam"],
  openGraph: {
    title: "Peppory - Gốm Thủ Công",
    description: "Tiệm gốm thủ công với phong cách wabi-sabi",
    url: "https://peppory.vn",
    siteName: "Peppory",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${playfair.variable} ${sourceSans.variable} ${caveat.variable} antialiased font-[family-name:var(--font-source-sans)]`}
      >
        <div className="texture-overlay" aria-hidden="true" />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
