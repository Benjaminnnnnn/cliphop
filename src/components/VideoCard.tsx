import axios from "axios";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { FiMaximize2 } from "react-icons/fi";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { TfiCommentAlt } from "react-icons/tfi";
import { Video } from "../../types";
import useAuthStore from "../store/authStore";

interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likesState, setLikesState] = useState(post.likes || []);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { userProfile } = useAuthStore();

  const likeCount = useMemo(() => likesState?.length || 0, [likesState]);
  const commentCount = useMemo(
    () => post.comments?.length || 0,
    [post.comments]
  );
  const likedByUser = useMemo(
    () => likesState?.some((like: any) => like?._ref === userProfile?._id),
    [likesState, userProfile?._id]
  );

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

  const toggleLike = async () => {
    if (!userProfile) return;
    const like = !likedByUser;
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/like`,
        {
          userId: userProfile._id,
          postId: post._id,
          like,
        }
      );
      setLikesState(data.likes);
    } catch (err) {
      // noop for now; could toast/log
    }
  };

  const seekBy = (delta: number) => {
    if (!videoRef.current) return;
    const target = Math.min(
      Math.max(videoRef.current.currentTime + delta, 0),
      duration || videoRef.current.duration || 0
    );
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleFullscreen = () => {
    const el = videoRef.current as any;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
    }
  };

  const goToDetail = () => router.push(`/detail/${post._id}`);

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      role="button"
      tabIndex={0}
      onClick={goToDetail}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetail();
        }
      }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 cursor-pointer md:h-12 md:w-12">
          <Link href={`/profile/${post.postedBy._id}`}>
            <div
              className="relative h-full w-full rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
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

        <div className="my-auto cursor-pointer md:my-0">
          <Link href={`/profile/${post.postedBy._id}`}>
            <div
              className="flex flex-col justify-start gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-900 md:text-base">
                  {post.postedBy.userName}
                </p>
                <GoVerified className="text-md text-blue-500"></GoVerified>
              </div>
              <p className="hidden text-xs font-medium text-slate-500 md:block">
                @{post.postedBy.userName.replaceAll(" ", "")}
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <div
          className="relative"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/detail/${post._id}`}>
            <a className="block">
              <video
                src={post.video.asset.url}
                loop
                className="aspect-video max-h-[620px] w-full cursor-pointer bg-slate-100 object-cover"
                ref={videoRef}
                muted={isMuted}
                onTimeUpdate={(e) =>
                  setCurrentTime(e.currentTarget.currentTime)
                }
                onLoadedMetadata={(e) =>
                  setDuration(e.currentTarget.duration || 0)
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onVideoPress();
                }}
              ></video>
            </a>
          </Link>

          <div className="from-black/55 pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t via-black/20 to-transparent px-4 pb-4 pt-12">
            <div className="bg-black/65 inline-flex max-w-full items-start gap-2 rounded-xl px-3 py-2 text-white shadow-[0_10px_25px_-18px_rgba(0,0,0,0.8)] backdrop-blur">
              <span className="line-clamp-2 text-xs font-semibold leading-snug md:text-sm">
                {post.caption || "Untitled clip"}
              </span>
            </div>
          </div>

          {isHover && (
            <>
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px] transition" />
              <div className="absolute right-3 top-3 flex items-center gap-2">
                <button
                  onClick={handleFullscreen}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  <FiMaximize2 className="text-base" />
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center gap-3 md:gap-4">
                <button
                  onClick={() => seekBy(-5)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  -5s
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVideoPress();
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105 hover:border-slate-100"
                >
                  {isPlaying ? (
                    <BsFillPauseFill className="text-2xl"></BsFillPauseFill>
                  ) : (
                    <BsFillPlayFill className="text-2xl"></BsFillPlayFill>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted((prev) => !prev);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105 hover:border-slate-100"
                >
                  {isMuted ? (
                    <HiVolumeOff className="text-2xl"></HiVolumeOff>
                  ) : (
                    <HiVolumeUp className="text-2xl"></HiVolumeUp>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    seekBy(5);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  +5s
                </button>
              </div>
              <div className="bg-black/55 pointer-events-auto absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full px-3 py-2 text-white">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => {
                    const newTime = Number(e.target.value);
                    setCurrentTime(newTime);
                    if (videoRef.current) {
                      videoRef.current.currentTime = newTime;
                    }
                  }}
                  className="h-1 w-full cursor-pointer accent-white"
                />
                <span className="text-[10px] font-semibold leading-none">
                  {Math.floor(currentTime)}s
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-1 flex items-center justify-between text-sm text-slate-600">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition  ${
              likedByUser
                ? "bg-rose-50 text-rose-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            aria-label={`Likes ${likeCount}`}
          >
            <AiFillHeart
              className={
                likedByUser ? "text-rose-500" : "text-slate-500 opacity-80"
              }
            />
            <span>{likeCount}</span>
          </button>
          <Link href={`/detail/${post._id}`}>
            <a
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition  hover:bg-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <TfiCommentAlt className="text-slate-500" />
              <span>{commentCount}</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
