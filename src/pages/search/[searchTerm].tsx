import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { GoVerified } from "react-icons/go";
import { Video } from "../../../types";
import Navbar from "../../components/Navbar";
import NoResults from "../../components/NoResults";
import NoSSRWrapper from "../../components/NoSSRWrapper";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";

const Search = ({ videos }: { videos: Video[] }) => {
  const [showAccounts, setShowAccounts] = useState(true);
  const router = useRouter();
  const { allUsers } = useAuthStore();
  const { searchTerm }: any = router.query;

  const searchedUsers = allUsers.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showAccountsStyle = showAccounts
    ? "border-b-2 border-black"
    : "text-gray-400";
  const showVideosStyle = !showAccounts
    ? "border-b-2 border-black"
    : "text-gray-400";

  return (
    <NoSSRWrapper>
      <div className="w-full">
        <Navbar></Navbar>
        <div className="mx-auto w-[90%]">
          <div className="my-4 flex gap-10 border-b-2 border-gray-200 bg-white md:mb-10">
            <p
              className={`mt-2 cursor-pointer text-xl font-semibold ${showAccountsStyle}`}
              onClick={() => setShowAccounts(true)}
            >
              Accounts
            </p>
            <p
              className={`mt-2 cursor-pointer text-xl font-semibold ${showVideosStyle}`}
              onClick={() => setShowAccounts(false)}
            >
              Videos
            </p>
          </div>

          {showAccounts ? (
            <div className="flex flex-col items-start justify-center gap-3">
              {searchedUsers.length > 0 ? (
                searchedUsers.map((user, idx) => (
                  <div
                    className="w-full items-center border-b-2 border-gray-200 p-2 pb-3"
                    key={idx}
                  >
                    <Link href={`/profile/${user._id}`}>
                      <div className="flex w-fit items-start gap-2">
                        <div className="relative h-10 w-10 cursor-pointer md:h-16 md:w-16">
                          <Image
                            src={user.image}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                            alt="user profile"
                          ></Image>
                        </div>

                        <div className="cursor-pointer">
                          <p className="flex items-center gap-2 text-base font-bold text-primary md:text-lg">
                            {user.userName}
                            <GoVerified className="text-blue-400"></GoVerified>
                          </p>

                          <p className="text-xs capitalize text-gray-400 md:text-sm">
                            {user.userName}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <NoResults
                  text={`No account results for ${searchTerm}`}
                ></NoResults>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {videos.length > 0 ? (
                videos.map((video, index) => (
                  <VideoCard post={video} key={index}></VideoCard>
                ))
              ) : (
                <NoResults
                  text={`No video results for ${searchTerm}`}
                ></NoResults>
              )}
            </div>
          )}
        </div>
      </div>
    </NoSSRWrapper>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/search/${searchTerm}`
  );

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Search;
