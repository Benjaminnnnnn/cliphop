import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GoVerified } from "react-icons/go";
import { IUser, Video } from "../../../types";
import Navbar from "../../components/Navbar";
import NoResults from "../../components/NoResults";
import VideoCard from "../../components/VideoCard";

interface IProps {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const UserProfile = ({ data }: IProps) => {
  const { user, userVideos, userLikedVideos } = data;
  const [showVideos, setShowVideos] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  const showVideosStyle = showVideos
    ? "border-b-2 border-black"
    : "text-gray-400";
  const likeVideosStyle = !showVideos
    ? "border-b-2 border-black"
    : "text-gray-400";

  useEffect(() => {
    if (showVideos) {
      setVideos(userVideos);
    } else {
      setVideos(userLikedVideos);
    }
  }, [showVideos]);

  // reset when user navigate from one user profile to another profile
  useEffect(() => {
    setShowVideos(true);
    setVideos(userVideos);
  }, [userVideos, userLikedVideos]);

  return (
    <div className="w-full">
      <Navbar></Navbar>
      <div className="mt-4 flex flex-col items-center gap-6 bg-white md:mt-10 md:gap-10">
        <div className="w-[90%] cursor-default">
          <div className="flex items-center gap-4 rounded p-2 pl-0 font-semibold md:gap-6">
            <div className="relative h-16 w-16 md:h-20 md:w-20">
              <Image
                src={user.image}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                alt="user profile"
              ></Image>
            </div>

            <div className="self-start">
              <p className="flex items-center gap-2 text-lg font-bold capitalize text-primary md:text-xl">
                {user.userName}
                <GoVerified className="text-blue-400"></GoVerified>
              </p>

              <p className="text-xs capitalize text-gray-400 md:text-sm">
                {user.userName}
              </p>
            </div>
          </div>

          <div className="my-4 flex gap-10 border-b-2 border-gray-200 bg-white ">
            <p
              className={`mt-2 cursor-pointer text-xl font-semibold ${showVideosStyle}`}
              onClick={() => setShowVideos(true)}
            >
              Posted
            </p>
            <p
              className={`mt-2 cursor-pointer text-xl font-semibold ${likeVideosStyle}`}
              onClick={() => setShowVideos(false)}
            >
              Liked
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {videos.length > 0 ? (
            videos.map((video, index) => (
              <VideoCard post={video} key={index}></VideoCard>
            ))
          ) : (
            <NoResults
              text={`No ${showVideos ? "" : "Liked"} Videos Yet`}
            ></NoResults>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/${id}`
  );

  return {
    props: {
      data: response.data,
    },
  };
};

export default UserProfile;
