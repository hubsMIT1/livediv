import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";
import "@liveblocks/react-ui/styles.css";
const work_sans = Work_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: "Livediv",
  description: "Livediv is a minimalist real time collabrative application similar to figma or canva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Room>
        <body className={`${work_sans.className} bg-primary-grey-200`}>{children}</body>
      </Room>
    </html>
  );
}
