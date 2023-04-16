import { useGoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useState } from "react";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import Discover from "./Discover";
import Footer from "./Footer";
import SuggestedAccounts from "./SuggestedAccounts";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [userProfile, setUserProfile] = useState(false);

  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded";
  const activeLink = "";

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
    onError: (tokenResponse) => console.log(tokenResponse),
  });

  return (
    <div>
      <div
        className="m-2 ml-4 mt-3 block text-xl xl:hidden"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? (
          <ImCancelCircle></ImCancelCircle>
        ) : (
          <AiOutlineMenu></AiOutlineMenu>
        )}
      </div>

      {showSidebar && (
        <div className="mt-10 flex w-20 flex-col justify-start border-r-2 border-gray-100 p-3 xl:w-400 xl:border-0">
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
          {!userProfile && (
            <div className="hidden px-2 py-4 xl:block">
              <p className="text-gray-400">
                Log in to like and comment on videos
              </p>

              <div className="pr-4">
                <button
                  className="mt-3 w-full cursor-pointer rounded-md border-[1px] border-[#F51997] bg-white px-6 py-3 text-lg font-semibold text-[#F51997] outline-none hover:bg-[#F51997] hover:text-white"
                  onClick={() => login()}
                >
                  Log in
                </button>
              </div>
            </div>
          )}

          <Discover></Discover>
          <SuggestedAccounts></SuggestedAccounts>
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
