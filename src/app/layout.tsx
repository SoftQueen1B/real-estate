import type { Metadata } from "next";
// import "../src/styles.css";
import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Lena Real Estate",
  description: "Premium homes, land and commercial property for sale and rent across Nigeria.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
