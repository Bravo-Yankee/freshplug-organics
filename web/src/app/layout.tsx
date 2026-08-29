import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { InactivityLogout } from "@/components/auth/InactivityLogout";
import "@/styles/legacy.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} - Premium Organic Poultry Products`,
    template: `%s - ${siteConfig.legalName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/images/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/assets/images/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.legalName,
    title: `${siteConfig.legalName} - Premium Organic Poultry Products`,
    description: siteConfig.description,
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.legalName} - Premium Organic Poultry Products`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        {children}
        <InactivityLogout />
      </body>
    </html>
  );
}
