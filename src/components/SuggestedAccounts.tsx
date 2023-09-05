import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { GoVerified } from "react-icons/go";
import { IUser } from "../../types";
import useAuthStore from "../store/authStore";

const SuggestedAccounts = () => {
  const { fetchAllUsers, allUsers } = useAuthStore();

  // const users = allUsers.sort(() => 0.5 - Math.random());

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className="hidden border-gray-200 pb-4 md:block xl:border-b-2">
      <p className="m-3 mt-4 hidden font-semibold text-gray-500 xl:block">
        Suggested Accounts
      </p>

      <div>
        {allUsers?.slice(0, 5).map((user: IUser) => (
          <Link href={`/profile/${user._id}`} key={user._id}>
            <div className="flex cursor-pointer items-center gap-3 rounded p-2 font-semibold hover:bg-primary ">
              <div className="relative h-8 w-8">
                <Image
                  src={user.image}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                  alt="user profile"
                ></Image>
              </div>

              <div className="hidden xl:block ">
                <p className="flex items-center gap-2 text-base font-bold lowercase text-primary">
                  {user.userName.replaceAll(" ", "")}
                  <GoVerified className="text-blue-400"></GoVerified>
                </p>

                <p className="text-xs capitalize text-gray-400">
                  {user.userName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedAccounts;
