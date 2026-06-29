import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Vote Receipts | 119th Congress Corporate Lobbying Ledger",
  description:
    "An autonomous, open-source transparency engine mapping over $1.3B in corporate lobbying outlays into itemized, transactional receipts. Search and audit corporate financial footprints in the 119th Congress.",
  keywords:
    "lobbying data, money in politics, 119th congress, corporate lobbying receipts, open data, government transparency, FEC data, senate disclosures",
  robots: "index, follow",
  authors: [{ name: "The Vote Receipts" }],
  metadataBase: new URL("https://thevotereceipts.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://thevotereceipts.com/",
    title: "The Vote Receipts | Itemized Corporate Lobbying Ledger",
    description:
      "We itemized over $1.3 Billion spent to influence the federal government. Search any bill or corporation to print their financial receipt.",
    siteName: "The Vote Receipts",
    images: [
      {
        url: "https://thevotereceipts.com/preview.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Vote Receipts | Itemized Corporate Lobbying Ledger",
    description:
      "An autonomous transparency engine mapping federal lobbying data into itemized transactional receipts. 100% open and free.",
    images: ["https://thevotereceipts.com/preview.png"],
  },
  other: {
    "theme-color": "#000000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Dataset",
              name: "The Vote Receipts: 119th Congress Corporate Lobbying Ledger",
              description:
                "A compiled dataset mapping $1,308,963,091 of federal corporate lobbying expenses, PAC tracking, and roll call votes across the 119th Congress (2025-2026).",
              url: "https://thevotereceipts.com/",
              keywords: [
                "Lobbying",
                "Federal Government",
                "119th Congress",
                "PAC Contributions",
                "Corporate Influence",
              ],
              license: "https://creativecommons.org/publicdomain/zero/1.0/",
              isAccessibleForFree: true,
              creator: {
                "@type": "Organization",
                name: "The Vote Receipts",
              },
              temporalCoverage: "2025-01-03/2026-03-31",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
