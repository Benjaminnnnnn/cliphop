import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdAdd } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IUser } from "../../types";
import useAuthStore from "../store/authStore";
import { createOrGetUser } from "../utils";
import Logo from "../utils/cliphop-logo-only.png";

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
    <div className="w-30 absolute right-2 top-16 flex h-60 flex-col rounded-lg border-2 bg-white drop-shadow md:h-80 md:w-60">
      <button className="mt-2 hidden w-full items-center gap-2 px-4 py-2 hover:bg-primary">
        <AiOutlineSearch fontSize={24}></AiOutlineSearch>
        <span>Search</span>
      </button>
      <button
        className="mt-2 inline-flex w-full items-center gap-2 px-4 py-2 hover:bg-primary md:py-4"
        type="button"
        onClick={() => {
          googleLogout();
          removeUser();
          // workaround for zustand state change not triggering nextjs re-render
          location.reload();
        }}
      >
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
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    setUser(userProfile);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };

  return (
    <div className="sticky top-0 z-30 mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-[0_20px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur md:mt-3 md:px-6">
      <Link href="/">
        <div className="relative flex items-center">
          <div className="relative flex h-12 w-20 items-center">
            <Image
              className="cursor-pointer select-none"
              src={Logo}
              alt="cliphop logo"
              layout="fill"
              objectFit="contain"
            ></Image>
          </div>
          <div className="hidden cursor-pointer flex-col leading-tight md:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Cliphop
            </span>
            <span className="text-lg font-semibold text-ink">
              Video Playground
            </span>
          </div>
        </div>
      </Link>

      <div className="relative left-2 hidden md:block">
        <form onSubmit={handleSearch}>
          <input
            className="w-[320px] rounded-full border border-white/80 bg-white/80 px-5 py-3 text-sm font-medium text-slate-800 shadow-[0_10px_35px_-18px_rgba(15,23,42,0.4)] ring-1 ring-transparent transition focus:border-brand/60 focus:outline-none focus:ring-brand/40 md:w-[360px] md:text-base"
            type="text"
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchValue(e.target.value)
            }
            placeholder="Search accounts and videos"
          />
          <button
            type="submit"
            className="absolute right-6 top-1/2 -translate-y-1/2 border-l border-slate-200 pl-4 text-xl text-slate-400 transition hover:text-brand md:right-5"
          >
            <svg
              className="h-4 w-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </button>
        </form>
      </div>

      <div>
        {user ? (
          <div className="flex items-center gap-3 lg:gap-6">
            <Link href="/upload">
              <button className="flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#ff5f6d,#ff7f68,#ffc371)] px-3 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(255,95,109,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(255,95,109,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 active:translate-y-0 md:px-4 md:text-base">
                <IoMdAdd className="text-xl"></IoMdAdd>
                {` `}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>

            {user.image && (
              <>
                <div
                  className="relative flex h-10 w-10 flex-col rounded-full border-4 border-transparent ring-2 ring-white/60 transition hover:border-brand hover:ring-brand/30 md:h-12 md:w-12"
                  onClick={() => {
                    setIsOpen((prevIsOpen) => !prevIsOpen);
                  }}
                >
                  <Image
                    className="cursor-pointer rounded-full"
                    src={user.image}
                    alt="user-profile"
                    layout="fill"
                    objectFit="cover"
                  ></Image>
                </div>
                {isOpen && (
                  <MenuCollapse
                    removeUser={removeUser}
                    setIsOpen={setIsOpen}
                  ></MenuCollapse>
                )}
              </>
            )}
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
