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
    <div>
      <div className="flex cursor-pointer flex-col items-center justify-center">
        {liked ? (
          <div
            className="rounded-full p-2 text-[#F51997] hover:bg-primary md:p-4"
            onClick={handleDislike}
          >
            <MdFavorite className="text-lg  md:text-2xl"></MdFavorite>
          </div>
        ) : (
          <div
            className="rounded-full p-2 hover:bg-primary md:p-4"
            onClick={handleLike}
          >
            <MdFavoriteBorder className="text-lg md:text-2xl"></MdFavoriteBorder>
          </div>
        )}

        <p className=" text-base font-semibold">{likes?.length | 0}</p>
      </div>
    </div>
  );
};

export default LikeButton;
