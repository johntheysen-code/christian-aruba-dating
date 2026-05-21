import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { TopNav } from "./components/TopNav";

export const metadata: Metadata = {
  title: "Amor y Fe — Christian dating in Aruba",
  description:
    "Amor y Fe — a Christ-centered dating community for singles in Aruba. Take the compatibility quiz and meet believers who share your faith and your way of life.",
  openGraph: {
    title: "Amor y Fe",
    description:
      "Christian dating, designed for Aruba. Less swiping. More marriage.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <TopNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
