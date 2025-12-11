import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
import { FiMaximize2 } from "react-icons/fi";
import { Video } from "../../../types";
import Comments from "../../components/Comments";
import LikeButton from "../../components/LikeButton";
import useAuthStore from "../../store/authStore";

interface IProps {
  postDetails: Video;
}

const VideoDetail = ({ postDetails }: IProps) => {
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(postDetails);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { userProfile } = useAuthStore();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/like`,
        {
          userId: userProfile._id,
          postId: post._id,
          like,
        }
      );

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComent = async (e: any) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingComment(true);
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${post._id}`,
          { userId: userProfile._id, comment: comment.trim() }
        );

        setPost({ ...post, comments: data.comments });
        setComment("");
        setIsPostingComment(false);
      } catch (error) {}
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

  if (!post) return null;

  return (
    <div className="absolute left-0 top-0 flex h-[100vh] w-full flex-wrap bg-white lg:flex-nowrap">
      {/* main video section */}
      <div className="relative flex w-[1000px] items-center justify-center bg-black lg:w-3/4">
        <div className="absolute left-4 top-6 z-50 flex gap-6 lg:left-6">
          <a onClick={() => router.back()}>
            <IoMdArrowBack className="cursor-pointer text-3xl text-white"></IoMdArrowBack>
          </a>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="h-[60vh] lg:h-[100vh]">
            <video
              src={post.video.asset.url}
              ref={videoRef}
              loop
              muted={isMuted}
              onClick={onVideoClick}
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              className="h-full cursor-pointer"
            ></video>
          </div>
          {isHover && (
            <>
              <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-3">
                <button
                  onClick={() => seekBy(-5)}
                  className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  -5s
                </button>
                <button
                  onClick={onVideoClick}
                  className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  {!isPlaying ? (
                    <BsFillPlayFill className="text-5xl"></BsFillPlayFill>
                  ) : (
                    <BsFillPauseFill className="text-5xl"></BsFillPauseFill>
                  )}
                </button>
                <button
                  onClick={() => seekBy(5)}
                  className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-black/80 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.75)] backdrop-blur transition hover:scale-105"
                >
                  +5s
                </button>
              </div>
            </>
          )}
        </div>
        <div className="absolute right-6 top-6 flex items-center gap-3">
          <button
            onClick={handleFullscreen}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.7)] backdrop-blur transition hover:scale-105"
          >
            <FiMaximize2 className="text-xl"></FiMaximize2>
          </button>
          {isMuted ? (
            <button
              onClick={() => setIsMuted(false)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.7)] backdrop-blur transition hover:scale-105"
            >
              <HiVolumeOff className="text-2xl lg:text-3xl"></HiVolumeOff>
            </button>
          ) : (
            <button
              onClick={() => setIsMuted(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.7)] backdrop-blur transition hover:scale-105"
            >
              <HiVolumeUp className="text-2xl lg:text-3xl"></HiVolumeUp>
            </button>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-20 flex items-center gap-3">
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
            className="h-1 flex-1 cursor-pointer accent-white"
          />
          <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white">
            <span>{Math.floor(currentTime)}s</span>
            <span className="text-white/60">/</span>
            <span>{Math.floor(duration)}s</span>
          </div>
        </div>
      </div>

      {/* like and comment section */}
      <div className="relative h-full w-full lg:w-[700px]">
        <div className="flex h-full flex-col gap-6 px-4 py-6 lg:px-6">
          {/* like section */}
          <div className="flex flex-col gap-4 rounded-2xl bg-white/90 p-5 shadow-sm">
            <div className="flex gap-3 rounded p-2 font-semibold">
              <div className="h-16 w-16 cursor-pointer md:h-20 md:w-20 ">
                <Link href={`/profile/${post.postedBy._id}`}>
                  <div className="relative h-16 w-16 rounded-full md:h-20 md:w-20">
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
              <div className="my-auto cursor-pointer ">
                <Link href="/">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-primary md:text-lg">
                        {post.postedBy.userName}
                      </p>
                      <GoVerified className="text-md text-blue-400"></GoVerified>
                    </div>
                    <p className="hidden text-xs font-medium capitalize text-gray-500 md:block">
                      {post.postedBy.userName}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="ml-2 mr-4 rounded-xl bg-slate-50 px-3 py-2 shadow-inner shadow-white/60">
              <p className="text-base font-semibold text-slate-800">
                {post.caption}
              </p>
            </div>

            {userProfile && (
              <div className="ml-2 mt-2 flex">
                <LikeButton
                  likes={post.likes}
                  handleLike={() => handleLike(true)}
                  handleDislike={() => handleLike(false)}
                ></LikeButton>
              </div>
            )}
          </div>

          {/* comment section */}
          <Comments
            allComments={post.comments}
            comment={comment}
            setComment={setComment}
            addComment={addComent}
            isPostingComment={isPostingComment}
          ></Comments>
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
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/${id}`
  );

  return {
    props: { postDetails: data },
  };
};

export default VideoDetail;
