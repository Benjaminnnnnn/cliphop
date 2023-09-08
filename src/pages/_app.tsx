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
        <AnimatePresence initial={false}>
          <motion.div
            className="videos flex h-full flex-1 flex-col"
            initial="initial"
            animate="animate"
            exit="exit"
            key={router.pathname}
            variants={fade()}
          >
            <Component {...pageProps} />
          </motion.div>
        </AnimatePresence>
      </div>
    </GoogleOAuthProvider>
  );
}
