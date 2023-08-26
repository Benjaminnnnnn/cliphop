import Image from "next/image";
import Link from "next/link";
import { GoVerified } from "react-icons/go";
import { IUser } from "../../types";
import useAuthStore from "../store/authStore";
import NoResults from "./NoResults";

interface IProps {
  allComments: IComment[];
  comment: string;
  setComment: (comment: string | ((prevComment: string) => string)) => void;
  addComment: (e: React.FormEvent) => void;
  isPostingComment: Boolean;
}

interface IComment {
  length?: number;
  comment: string;
  _key: string;
  postedBy: {
    _ref: string;
    _id: string;
  };
}

const Comments = ({
  allComments,
  comment,
  setComment,
  addComment,
  isPostingComment,
}: IProps) => {
  const { userProfile, allUsers } = useAuthStore();
  return (
    <div className="flex h-full flex-col justify-between gap-4">
      <div className="border-y-2 border-gray-200 bg-[#F8F8F8] px-10 pb-[100px] pt-4 lg:pb-0">
        <div className="overflow-scroll">
          {allComments?.length ? (
            allComments.map((comment, idx) => (
              <>
                {allUsers.map(
                  (user: IUser) =>
                    (user._id === comment.postedBy._ref ||
                      user._id === comment.postedBy._id) && (
                      <div className="items-center p-2" key={idx}>
                        <Link href={`/profile/${user._id}`}>
                          <div className="flex w-fit items-center gap-2">
                            <div className="relative h-10 w-10 cursor-pointer">
                              <Image
                                src={user.image}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                                alt="user profile"
                              ></Image>
                            </div>

                            <div className="cursor-pointer">
                              <p className="flex items-center gap-2 text-base font-bold text-primary">
                                {user.userName}
                                <GoVerified className="text-blue-400"></GoVerified>
                              </p>

                              <p className="text-xs capitalize text-gray-400">
                                {user.userName}
                              </p>
                            </div>
                          </div>
                        </Link>

                        <div className="mt-2">
                          <p>{comment.comment}</p>
                        </div>
                      </div>
                    )
                )}
              </>
            ))
          ) : (
            <NoResults text="No comments yet"></NoResults>
          )}
        </div>
      </div>
      {userProfile && (
        <div className="ml-4 pb-4">
          <form
            onSubmit={addComment}
            className="inline-flex w-full flex-1 items-center gap-4 pr-4"
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              placeholder="Add comment..."
              className="w-full rounded-md border-2 border-gray-100 bg-primary px-6 py-4 text-base focus:border-2 focus:border-gray-300 focus:outline-none"
            />

            <button
              className="h-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={addComment}
            >
              {isPostingComment ? "Commenting..." : "Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Comments;
