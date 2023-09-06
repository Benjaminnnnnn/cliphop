import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import { IoMdArrowBack } from "react-icons/io";
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
        <div className="relative">
          <div className="h-[60vh] lg:h-[100vh]">
            <video
              src={post.video.asset.url}
              ref={videoRef}
              loop
              muted={isMuted}
              onClick={onVideoClick}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              className="h-full cursor-pointer"
            ></video>
          </div>
          <div className={`pointer-events-none absolute left-[45%] top-[48%]`}>
            {isHover &&
              (!isPlaying ? (
                <button>
                  <BsFillPlayFill className="text-6xl text-white lg:text-8xl"></BsFillPlayFill>
                </button>
              ) : (
                <button>
                  <BsFillPauseFill className="text-6xl text-white lg:text-8xl"></BsFillPauseFill>
                </button>
              ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-6">
          {isMuted ? (
            <button onClick={() => setIsMuted(false)}>
              <HiVolumeOff className="text-2xl text-white lg:text-4xl"></HiVolumeOff>
            </button>
          ) : (
            <button onClick={() => setIsMuted(true)}>
              <HiVolumeUp className="text-2xl text-white lg:text-4xl"></HiVolumeUp>
            </button>
          )}
        </div>
      </div>

      {/* like and comment section */}
      <div className="relative h-full w-full lg:w-[700px]">
        <div className="flex h-full flex-col gap-4">
          {/* like section */}
          <div className="ml-4 mt-10 flex flex-col gap-4">
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

            <p className="ml-4 pr-4 text-base text-gray-800">{post.caption}</p>

            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              ></LikeButton>
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
