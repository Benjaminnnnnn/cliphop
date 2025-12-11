import { useEffect, useState } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import useAuthStore from "../store/authStore";

interface IProps {
  likes: any[];
  handleLike: () => void;
  handleDislike: () => void;
}

const LikeButton = ({ handleLike, handleDislike, likes }: IProps) => {
  const [liked, setLiked] = useState(false);
  const { userProfile } = useAuthStore();
  const filterLikes = likes?.filter((like) => like._ref === userProfile?._id);

  useEffect(() => {
    if (filterLikes.length > 0) {
      setLiked(true);
    } else {
      setLiked(false);
      // console.log(liked);
    }
  }, [filterLikes, likes]);

  return (
    <div className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {liked ? (
        <button
          className="rounded-full p-1.5 text-rose-500 transition hover:bg-rose-50"
          onClick={handleDislike}
        >
          <MdFavorite className="text-xl md:text-2xl"></MdFavorite>
        </button>
      ) : (
        <button
          className="rounded-full p-1.5 text-slate-700 transition hover:bg-slate-100"
          onClick={handleLike}
        >
          <MdFavoriteBorder className="text-xl md:text-2xl"></MdFavoriteBorder>
        </button>
      )}

      <p className="text-sm font-semibold text-slate-800">{likes?.length | 0}</p>
    </div>
  );
};

export default LikeButton;
