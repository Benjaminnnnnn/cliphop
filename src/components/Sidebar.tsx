import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { AiFillHome, AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import Discover from "./Discover";
import Footer from "./Footer";

const SuggestedAccounts = dynamic(() => import("./SuggestedAccounts"), {
  ssr: false,
});

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-highlight rounded";
  const activeLink = "";

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col items-center justify-center rounded px-4 py-2 text-2xl hover:bg-primary"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? (
          <AiOutlineClose></AiOutlineClose>
        ) : (
          <AiOutlineMenu></AiOutlineMenu>
        )}
      </div>

      {showSidebar && (
        <div className="flex w-20 flex-col justify-center border-r-2 border-gray-100 p-3 xl:w-400 xl:border-0">
          <div className="border-gray-200 xl:border-b-2 xl:pb-4">
            <Link href="/">
              <div className={normalLink}>
                <p className="text-2xl">
                  <AiFillHome></AiFillHome>
                </p>
                <span className="hidden text-xl xl:block">For You</span>
              </div>
            </Link>
          </div>

          <Discover></Discover>
          <SuggestedAccounts></SuggestedAccounts>
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
