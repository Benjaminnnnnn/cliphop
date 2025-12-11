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
    <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-brand/30 bg-white/60 p-8 text-center shadow-inner shadow-white/70">
      <p className="mb-3 text-6xl text-brand">
        <Icon text={text}></Icon>
      </p>
      <p className="text-xl font-semibold text-ink">{text}</p>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Spark something new — upload your first clip or follow a creator to see
        their drops.
      </p>
    </div>
  );
};

export default NoResults;
