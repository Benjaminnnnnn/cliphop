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
    "flex items-center gap-3 px-3 py-2 justify-center xl:justify-start cursor-pointer text-sm font-semibold text-slate-800 rounded-xl transition hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="hidden sm:flex sm:flex-col">
      <div
        className="mb-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-2xl text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? (
          <AiOutlineClose></AiOutlineClose>
        ) : (
          <AiOutlineMenu></AiOutlineMenu>
        )}
      </div>

      {showSidebar && (
        <div className="flex w-20 flex-col justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm xl:w-400 xl:border-0">
          <div className="mb-2 hidden px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 xl:block">
            Navigation
          </div>
          <div className="border-gray-200 xl:border-b xl:border-slate-200 xl:pb-4">
            <Link href="/">
              <div className={normalLink}>
                <p className="text-xl text-slate-700">
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
