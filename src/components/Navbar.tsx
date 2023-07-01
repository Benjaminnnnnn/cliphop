import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";

import { createOrGetUser } from "../utils";
import Logo from "../utils/tiktik-logo.png";

const Navbar = () => {
  const user = false;

  return (
    <div className="flex w-full items-center justify-between border-b-2 border-gray-200 px-4 py-2">
      <Link href="/">
        <div className="w-[100px] md:w-[130px]">
          <Image
            className="cursor-pointer"
            src={Logo}
            alt="cliphop"
            layout="responsive"
          ></Image>
        </div>
      </Link>

      <div>SEARCH</div>

      <div>
        {user ? (
          <div>Logged In </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => {
              createOrGetUser(response, null);
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
