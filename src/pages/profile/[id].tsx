import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { GoVerified } from "react-icons/go";
import { IUser, Video } from "../../../types";
import Navbar from "../../components/Navbar";
import NoResults from "../../components/NoResults";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";

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
  const [followers, setFollowers] = useState(user.followers || []);
  const { userProfile } = useAuthStore();

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
    setFollowers(user.followers || []);
  }, [userVideos, userLikedVideos]);

  const isFollowing = useMemo(
    () =>
      followers?.some((follower: any) => follower?._ref === userProfile?._id) ||
      false,
    [followers, userProfile?._id]
  );

  const followerCount = followers?.length || 0;
  const followingCount = user.following?.length || 0;

  const toggleFollow = async () => {
    if (!userProfile) return;
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/follow`,
        {
          userId: userProfile._id,
          targetUserId: user._id,
          follow: !isFollowing,
        }
      );
      setFollowers(data.followers || []);
    } catch (err) {
      // noop
    }
  };

  return (
    <div className="w-full">
      <Navbar></Navbar>
      <div className="mx-auto mt-6 flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 md:mt-10 md:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-10 shadow-[0_24px_70px_-60px_rgba(15,23,42,0.4)]">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,95,109,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(77,210,255,0.08),transparent_30%)]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 text-slate-900 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                <Image
                  src={user.image}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-2xl"
                  alt="user profile"
                ></Image>
              </div>

              <div className="flex flex-col gap-1">
                <p className="flex items-center gap-2 text-xl font-bold md:text-2xl">
                  {user.userName}
                  <GoVerified className="text-blue-400"></GoVerified>
                </p>
                <p className="text-sm text-slate-500">@{user.userName}</p>
                <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span>{followerCount} followers</span>
                  <span>{followingCount} following</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {userProfile && userProfile._id !== user._id && (
                <button
                  onClick={toggleFollow}
                  className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition  hover:shadow-md ${
                    isFollowing
                      ? "border border-slate-200 bg-slate-700"
                      : "border border-slate-200 bg-[#ff6b6b]"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition  hover:bg-slate-50">
                Message
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex gap-6 border-b border-slate-200 px-4 py-3 md:px-6">
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                showVideos
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setShowVideos(true)}
            >
              Posted
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                !showVideos
                  ? "bg-slate-900 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setShowVideos(false)}
            >
              Liked
            </button>
          </div>

          <div className="grid gap-5 px-4 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <VideoCard post={video} key={index}></VideoCard>
              ))
            ) : (
              <div className="col-span-full">
                <NoResults
                  text={`No ${showVideos ? "" : "Liked"} Videos Yet`}
                ></NoResults>
              </div>
            )}
          </div>
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

  console.log(id);

  return {
    props: {
      data: response.data,
    },
  };
};

export default UserProfile;
