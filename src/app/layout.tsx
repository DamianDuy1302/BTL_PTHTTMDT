import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthRoute from "@/components/routes/AuthRoute";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { constructMetadata } from ".././lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" className="h-full">
        <body
          className={cn(
            "relative h-full font-sans antialiased",
            inter.className
          )}
        >
          <AuthRoute>
            {/* min-h-screen is for not crop the footer when height is not enough */}
            <main className="relative flex flex-col min-h-screen">
              {children}
            </main>
          </AuthRoute>

          <Toaster></Toaster>
        </body>
      </html>
    </>
  );
}
