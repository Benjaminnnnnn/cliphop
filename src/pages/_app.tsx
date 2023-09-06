import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import { fade } from "../utils/motion";

export default function App({ Component, pageProps }: AppProps) {
  const [isSSR, setIsSSR] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) null;

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <div className="h-screen w-screen overflow-x-hidden">
        {/* <Navbar></Navbar> */}
        {/* <div className="mt-4 flex gap-6 md:gap-20">
          <div className="ml-4 h-[92vh] overflow-hidden xl:hover:overflow-auto">
            <Sidebar></Sidebar>
          </div> */}

        {/* main content */}
        {/* <div className="videos flex h-[88vh] flex-1 flex-col gap-10 overflow-auto"> */}
        <AnimatePresence initial={false}>
          <motion.div
            className="videos flex h-full flex-1 flex-col overflow-auto"
            initial="initial"
            animate="animate"
            exit="exit"
            key={router.pathname}
            variants={fade()}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
        {/* </div> */}
      </div>
    </GoogleOAuthProvider>
  );
}
