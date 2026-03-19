import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MOSH - Fundraising Dinner",
  description: "Join Mothers of Special Heroes (MOSH) in creating a more inclusive future for children with neurological disabilities.",
  icons: {
    icon: [
      { url: "/favicon_ico/favicon.ico" },
      { url: "/favicon_ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon_ico/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon_ico/favicon.ico"],
  },
  manifest: "/favicon_ico/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
