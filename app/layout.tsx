import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dev Fairy Metrics ✨ | Beautiful GitHub Stats",
  description:
    "A kawaii-styled GitHub profile stats dashboard. View your language percentages, repository metrics, and contribution data with a sweet jelly marshmallow aesthetic.",
  keywords: [
    "github stats",
    "github profile",
    "developer metrics",
    "language stats",
    "github dashboard",
  ],
  openGraph: {
    title: "Dev Fairy Metrics ✨",
    description:
      "Gorgeous, GitHub stats dashboard with magic vibes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NuqsAdapter>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: "100px",
                padding: "12px 24px",
                fontSize: "0.9rem",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.3)",
              },
            }}
            richColors
          />
        </NuqsAdapter>
      </body>
    </html>
  );
}
