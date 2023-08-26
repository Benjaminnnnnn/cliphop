import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";
// import { IoLogOutOutline } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IUser } from "../../types";
import useAuthStore from "../store/authStore";
import { createOrGetUser } from "../utils";
import Logo from "../utils/tiktik-logo.png";

const MenuCollapse = ({
  removeUser,
  setIsOpen,
}: {
  removeUser: () => void;
  setIsOpen: (prevIsOpen: boolean) => void;
}) => (
  // use a modal to close the menu when user clicks anywhere
  <div
    className="absolute left-0 top-0 z-10 h-[100vh] w-[100vw]"
    onClick={() => {
      setIsOpen(false);
    }}
  >
    <div className="w-30 absolute right-2 top-16 h-60 rounded-lg border-2 bg-white drop-shadow md:h-80 md:w-60">
      <button
        className="my-2 inline-flex w-full items-center gap-2 px-4 py-2 hover:bg-primary md:py-4"
        type="button"
        onClick={() => {
          googleLogout();
          removeUser();
          // workaround for zustand state change not triggering nextjs re-render
          location.reload();
        }}
      >
        {/* <AiOutlineLogout color="red" fontSize={24}></AiOutlineLogout> */}
        <IoLogOutOutline fontSize={24}></IoLogOutOutline>
        <span>Logout</span>
      </button>
    </div>
  </div>
);

const Navbar = () => {
  const { userProfile, addUser, removeUser } = useAuthStore();
  const [user, setUser] = useState<IUser | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setUser(userProfile);
  }, []);

  return (
    <div className="flex w-full items-center justify-between border-b-2 border-gray-200 px-4 py-2">
      <Link href="/">
        <div className="w-[100px] md:w-[130px]">
          <Image className="cursor-pointer" src={Logo} alt="cliphop"></Image>
        </div>
      </Link>

      <div>SEARCH</div>

      <div>
        {user ? (
          <div className="flex items-center gap-5 lg:gap-8">
            <Link href="/upload">
              <button className="flex items-center gap-2 rounded-lg border-2 px-2 py-2 text-base font-semibold hover:bg-gray-100 md:px-4">
                <IoMdAdd className="text-xl"></IoMdAdd>
                {` `}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>

            {user.image && (
              <>
                <div
                  className="relative flex h-10 w-10 flex-col rounded-full border-4 border-transparent hover:border-blue-500 md:h-12 md:w-12"
                  onClick={() => {
                    setIsOpen((prevIsOpen) => !prevIsOpen);
                  }}
                >
                  {/* <Link href="/"> */}
                  <Image
                    className="cursor-pointer rounded-full "
                    src={user.image}
                    alt="user-profile"
                    layout="fill"
                    objectFit="cover"
                  ></Image>
                  {/* </Link> */}
                </div>
                {isOpen && (
                  <MenuCollapse
                    removeUser={removeUser}
                    setIsOpen={setIsOpen}
                  ></MenuCollapse>
                )}
              </>
            )}

            {/* <button
              type="button"
              onClick={() => {
                googleLogout();
                removeUser();
                // workaround for zustand state change not triggering nextjs re-render
                location.reload();
              }}
            >
              <AiOutlineLogout color="red" fontSize={24}></AiOutlineLogout>
            </button> */}
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => {
              // workaround for zustand state change not triggering nextjs re-render
              createOrGetUser(response, addUser);
              location.reload();
            }}
            onError={() => {
              console.log("error");
            }}
          ></GoogleLogin>
        )}
      </div>
    </div>
  );
};

export default Navbar;
