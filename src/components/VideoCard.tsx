import { NextPage } from "next";
import { Video } from "../../types";

import Image from "next/image";
import Link from "next/link";

import { useRef, useState } from "react";
import { GoVerified } from "react-icons/go";

import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  const [isHover, setIsHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const onVideoPress = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex cursor-pointer gap-3 rounded p-2 font-semibold">
          <div className="h-10 w-10 md:h-16 md:w-16">
            <Link href="/">
              <>
                <Image
                  width={62}
                  height={62}
                  className="rounded-full"
                  src={post.postedBy.image}
                  alt="user-profile"
                  layout="responsive"
                ></Image>
              </>
            </Link>
          </div>

          <div>
            <Link href="/">
              <div className="flex items-center gap-2">
                <p className="font-bold text-primary md:text-base">
                  {post.postedBy.userName}
                </p>
                <GoVerified className="text-md text-blue-400"></GoVerified>
                <p className="hidden text-xs font-medium capitalize text-gray-500 md:block">
                  {post.postedBy.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex gap-4 lg:ml-20">
        <div
          className="rounded-3xl"
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          <Link href="/">
            <video
              src={post.video.asset.url}
              loop
              className="aspect-video h-[300px] w-[200px] cursor-pointer rounded-2xl bg-gray-100 md:h-[400px] lg:h-[530px] lg:w-[600px]"
              ref={videoRef}
              muted={isMuted}
            ></video>
          </Link>

          {isHover && (
            <div className="absolute bottom-6 left-8 flex cursor-pointer justify-between gap-10 md:left-10">
              {isPlaying ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-2xl text-black lg:text-4xl"></BsFillPauseFill>
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-2xl text-black lg:text-4xl"></BsFillPlayFill>
                </button>
              )}
              {isMuted ? (
                <button onClick={() => setIsMuted(false)}>
                  <HiVolumeOff className="text-2xl text-black lg:text-4xl"></HiVolumeOff>
                </button>
              ) : (
                <button onClick={() => setIsMuted(true)}>
                  <HiVolumeUp className="text-2xl text-black lg:text-4xl"></HiVolumeUp>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
