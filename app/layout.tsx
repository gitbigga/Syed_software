import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leveragesystems.tech"),
  title: {
    default: "Leverage Systems | Business Automation",
    template: "%s | Leverage Systems",
  },
  description:
    "Leverage Systems identifies repetitive work inside businesses and builds automation systems that handle it automatically.",
  applicationName: "Leverage Systems",
  authors: [{ name: "Leverage Systems" }],
  creator: "Leverage Systems",
  publisher: "Leverage Systems",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://leveragesystems.tech",
    siteName: "Leverage Systems",
    title: "Automate the work slowing your business down.",
    description:
      "We identify repetitive work inside your operation and build systems that handle it automatically.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Leverage Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leverage Systems | Business Automation",
    description:
      "Automate repetitive work, follow up faster and give your team more time for valuable work.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2226",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  );
}
