import Link from "next/link";
import { useState } from "react";
import { AiFillHome, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Discover from "./Discover";
import Footer from "./Footer";
import NoSSRWrapper from "./NoSSRWrapper";
import SuggestedAccounts from "./SuggestedAccounts";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const normalLink =
    "flex items-center gap-3 p-3 justify-center xl:justify-start cursor-pointer font-semibold text-highlight rounded-xl transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-lg";

  return (
    <div className="hidden sm:flex sm:flex-col">
      <div
        className="mb-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-4 py-2 text-2xl text-slate-600 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.8)] transition hover:shadow-[0_16px_50px_-30px_rgba(255,95,109,0.45)]"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? (
          <AiOutlineClose></AiOutlineClose>
        ) : (
          <AiOutlineMenu></AiOutlineMenu>
        )}
      </div>

      {showSidebar && (
        <div className="flex w-20 flex-col justify-center rounded-3xl border border-white/60 bg-white/70 p-3 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.7)] backdrop-blur xl:w-400 xl:border-0">
          <div className="mb-2 hidden px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 xl:block">
            Navigation
          </div>
          <div className="border-gray-200 xl:border-b xl:border-white/80 xl:pb-4">
            <Link href="/">
              <div className={normalLink}>
                <p className="text-2xl text-brand">
                  <AiFillHome></AiFillHome>
                </p>
                <span className="hidden text-lg font-semibold text-ink xl:block">
                  For You
                </span>
              </div>
            </Link>
          </div>

          <Discover></Discover>
          <NoSSRWrapper>
            <SuggestedAccounts></SuggestedAccounts>
          </NoSSRWrapper>
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
