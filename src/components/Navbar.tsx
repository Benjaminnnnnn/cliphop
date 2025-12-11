import { GoogleLogin, googleLogout } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMdAdd } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { IUser } from "../../types";
import useAuthStore from "../store/authStore";
import { createOrGetUser } from "../utils";
import Logo from "../utils/cliphop-logo-only.png";

const MenuCollapse = ({
  removeUser,
  setIsOpen,
  userId,
}: {
  removeUser: () => void;
  setIsOpen: (prevIsOpen: boolean) => void;
  userId: string;
}) => (
  <>
    <div
      className="fixed inset-0 z-30 h-screen w-screen"
      onClick={() => setIsOpen(false)}
    />
    <div
      className="absolute right-0 top-[calc(100%+10px)] z-40 flex w-52 flex-col rounded-xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur md:w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <Link href={`/profile/${userId}`}>
        <a className="inline-flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
          <CgProfile className="text-lg" />
          <span>Profile</span>
        </a>
      </Link>
      <button
        className="inline-flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        type="button"
        onClick={() => {
          googleLogout();
          removeUser();
          // workaround for zustand state change not triggering nextjs re-render
          location.reload();
        }}
      >
        <IoLogOutOutline className="text-lg"></IoLogOutOutline>
        <span>Logout</span>
      </button>
    </div>
  </>
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
            className="w-[320px] rounded-full border border-slate-200 bg-white/90 px-5 py-3 text-sm font-medium text-slate-800 shadow-inner shadow-white/60 ring-1 ring-transparent transition focus:border-brand/60 focus:outline-none focus:ring-brand/40 md:w-[360px] md:text-base"
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
              <button className="flex items-center gap-2 rounded-full bg-[#ff6b6b] px-3 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(255,107,107,0.45)] transition  hover:shadow-[0_16px_36px_-14px_rgba(255,107,107,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b6b]/60 active:translate-y-0 md:px-4 md:text-base">
                <IoMdAdd className="text-xl"></IoMdAdd>
                {` `}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>

            {user.image && (
              <div className="relative">
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
                    userId={user?._id || ""}
                  ></MenuCollapse>
                )}
              </div>
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
