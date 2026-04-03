import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: "My Bill - จัดการค่าใช้จ่าย",
  description: "แอปบันทึกค่าใช้จ่ายส่วนตัว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={cn("dark", inter.variable, notoSansThai.variable, "font-sans", geist.variable)}>
      <body className="min-h-dvh antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#131320",
              border: "1px solid #1e1e3a",
              color: "#f1f5f9",
            },
          }}
        />
      </body>
    </html>
  );
}
