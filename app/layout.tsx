import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CutOut Studio — Free Unlimited 4K AI Background Remover",
  description: "Remove background from images in full 4K resolution. 100% Free and Private.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#090D16] text-slate-100">
        {children}
      </body>
    </html>
  );
}
