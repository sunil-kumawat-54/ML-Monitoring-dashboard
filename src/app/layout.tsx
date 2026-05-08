import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import AuthGuard from "@/components/auth/AuthGuard";
import TopBar from "@/components/navigation/TopBar";
import Sidebar from "@/components/navigation/Sidebar";
import Footer from "@/components/navigation/Footer";
import AmbientLayer from "@/components/AmbientLayer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antigravity ML Monitor",
  description: "ML Monitoring Dashboard inspired by Evidently AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} h-full flex flex-col font-sans text-primary bg-void overflow-hidden relative`}
      >
        <AuthProvider>
          <AuthGuard>
            <AmbientLayer />
            <TopBar />
            <div className="flex flex-1 overflow-hidden z-10 relative">
              <Sidebar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
                <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-6">
                  {children}
                </div>
              </main>
            </div>
            <Footer />
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
