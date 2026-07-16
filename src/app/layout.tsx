import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ray Entertainment and Promotion — World-Class Live Band & Entertainment",
    template: "%s | Ray Entertainment and Promotion",
  },
  description:
    "Premium live band entertainment, music academy, and event booking platform. Where music becomes an unforgettable experience.",
  keywords: [
    "live band",
    "wedding entertainment",
    "corporate events",
    "music academy",
    "online music courses",
    "event booking",
    "professional musicians",
    "luxury entertainment",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ray Entertainment and Promotion",
    title: "Ray Entertainment and Promotion — World-Class Live Band & Entertainment",
    description:
      "Premium live band entertainment, music academy, and event booking platform.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ray Entertainment and Promotion Entertainment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ray Entertainment and Promotion — World-Class Live Band & Entertainment",
    description:
      "Premium live band entertainment, music academy, and event booking platform.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
