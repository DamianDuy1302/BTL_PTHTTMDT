import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import AuthRoute from "@/components/routes/AuthRoute";
import { Toaster } from "@/components/ui/toaster";
import { cn, constructMetadata } from "@/lib/utils";
import { Inter } from "next/font/google";

import ".././globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar></NavBar>
      <div className="flex-grow flex-1">{children}</div>
      <Footer></Footer>
    </>
  );
}
