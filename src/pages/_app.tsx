import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) null;

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <div>
        <Navbar></Navbar>
        <div className="mt-4 flex gap-6 md:gap-20">
          <div className="ml-4 h-[92vh] overflow-hidden xl:hover:overflow-auto">
            <Sidebar></Sidebar>
          </div>

          {/* main content */}
          <div className="videos flex h-[88vh] flex-1 flex-col gap-10 overflow-auto">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
