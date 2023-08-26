import { NextPage } from "next";
import { BiCommentX } from "react-icons/bi";
import { MdOutlineVideocamOff } from "react-icons/md";

interface IProps {
  text: string;
}

const NoResults: NextPage<IProps> = ({ text }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="text-6xl">
        {text === "No comments yet" ? (
          <BiCommentX></BiCommentX>
        ) : (
          <MdOutlineVideocamOff></MdOutlineVideocamOff>
        )}
      </p>
      <p className="text-center text-xl">{text}</p>
    </div>
  );
};

export default NoResults;
