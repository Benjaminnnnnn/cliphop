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
    <div className="group relative flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/70 p-3 pb-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:shadow-[0_22px_90px_-40px_rgba(255,95,109,0.35)]">
      <div className="flex gap-3 rounded-xl p-2 font-semibold">
        <div className="h-10 w-10 cursor-pointer md:h-16 md:w-16 ">
          <Link href={`/profile/${post.postedBy._id}`}>
            <div className="relative h-10 w-10 rounded-full md:h-16 md:w-16">
              <Image
                className="rounded-full"
                src={post.postedBy.image}
                alt="user-profile"
                objectFit="cover"
                layout="fill"
              ></Image>
            </div>
          </Link>
        </div>

        <div className="my-auto cursor-pointer md:my-0 ">
          <Link href={`/profile/${post.postedBy._id}`}>
            <div className="flex flex-col justify-start gap-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-ink md:text-lg">
                  {post.postedBy.userName}
                </p>
                <GoVerified className="text-md text-blue-400"></GoVerified>
              </div>
              <p className="hidden text-xs font-medium capitalize text-gray-500 md:block md:text-sm">
                {post.postedBy.userName}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="relative flex w-[95%] gap-4 pl-4">
        <div
          className="rounded-3xl"
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
        >
          <Link href={`/detail/${post._id}`}>
            <a>
              <video
                src={post.video.asset.url}
                loop
                className="aspect-video max-h-[600px] cursor-pointer rounded-2xl border border-white/80 bg-gradient-to-br from-slate-100 to-white shadow-inner shadow-white/60 transition group-hover:scale-[1.01]"
                ref={videoRef}
                muted={isMuted}
              ></video>
            </a>
          </Link>

          {isHover && (
            <div className="absolute bottom-6 left-8 flex cursor-pointer justify-between gap-4 md:left-12">
              <button
                onClick={onVideoPress}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/75 text-white shadow-[0_16px_35px_-18px_rgba(0,0,0,0.8)] backdrop-blur transition hover:scale-105 hover:border-brand/50 hover:shadow-[0_18px_45px_-12px_rgba(255,95,109,0.55)]"
              >
                {isPlaying ? (
                  <BsFillPauseFill className="text-2xl lg:text-3xl"></BsFillPauseFill>
                ) : (
                  <BsFillPlayFill className="text-2xl lg:text-3xl"></BsFillPlayFill>
                )}
              </button>
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/35 bg-black/75 text-white shadow-[0_16px_35px_-18px_rgba(0,0,0,0.8)] backdrop-blur transition hover:scale-105 hover:border-brand/50 hover:shadow-[0_18px_45px_-12px_rgba(255,95,109,0.55)]"
              >
                {isMuted ? (
                  <HiVolumeOff className="text-2xl lg:text-3xl"></HiVolumeOff>
                ) : (
                  <HiVolumeUp className="text-2xl lg:text-3xl"></HiVolumeUp>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
