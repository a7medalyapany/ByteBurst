import React from "react";
import "./globals.css";
import "../styles/prism.css";
import type { Metadata } from "next";

// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://byte-burst-lake.vercel.app/"),
  title: {
    default: "ByteBurst - Your Coding Hub for Tech Answers",
    template: "%s | ByteBurst",
  },
  description:
    "Dive into ByteBurst for top-notch tech solutions. Get coding help, share knowledge, and level up your skills. Join the ByteBurst community now!",
  icons: {
    icon: "/assets/images/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/images/opengraph-image.png"],
  },
  openGraph: {
    images: ["/assets/images/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              footerActionLink: "hover:text-secondary",
            },
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
