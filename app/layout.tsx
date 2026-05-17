import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Christian Aruba Dating — Faith, Love & Community",
  description:
    "A Christ-centered dating community for singles in Aruba. Meet faithful, like-minded believers on the island.",
  openGraph: {
    title: "Christian Aruba Dating",
    description:
      "A Christ-centered dating community for singles in Aruba.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
