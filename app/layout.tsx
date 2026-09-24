import type { Metadata } from "next";
import { DM_Sans, Fira_Code } from "next/font/google";

import "./globals.css";

// DM Sans for everything, Fira Code for code — the BSP type pairing.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BSP Chapter Hub",
  description:
    "Announcements, resources and monthly reporting for Byte-Sized Python chapters.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
