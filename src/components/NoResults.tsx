import { NextPage } from "next";
import { BiCommentX } from "react-icons/bi";
import { MdOutlineAccountCircle, MdOutlineVideocamOff } from "react-icons/md";

interface IProps {
  text: string;
}

const Icon = ({ text }: { text: string }) => {
  switch (text) {
    case "No comments yet":
      return <BiCommentX></BiCommentX>;
    case "No Accounts":
      return <MdOutlineAccountCircle></MdOutlineAccountCircle>;
    default:
      return <MdOutlineVideocamOff></MdOutlineVideocamOff>;
  }
};

const NoResults: NextPage<IProps> = ({ text }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="text-6xl">
        <Icon text={text}></Icon>
      </p>
      <p className="text-center text-xl">{text}</p>
    </div>
  );
};

export default NoResults;
