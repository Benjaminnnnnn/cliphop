import Link from "next/link";
import { useRouter } from "next/router";
import { topics } from "../utils/constants";

const Discover = () => {
  const router = useRouter();
  const { topic } = router.query;

  const activeTopicStyle =
    "flex cursor-pointer items-center justify-center gap-2 rounded px-3 py-2 text-blue-500 hover:bg-primary xl:rounded-full xl:border-2 xl:border-blue-500";
  const topicStyle =
    "flex cursor-pointer items-center justify-center gap-2 rounded px-3 py-2 text-black hover:bg-primary xl:rounded-full xl:border-2 xl:border-gray-300";

  return (
    <div className="pb-6 xl:border-b-2 xl:border-gray-200">
      <p className="m-3 mt-4 hidden font-semibold text-gray-500 xl:block">
        Popular Topics
      </p>
      <div className="flex flex-wrap gap-3">
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={topic === item.name ? activeTopicStyle : topicStyle}
            >
              <span className="font-bol0d text-2xl xl:text-center">
                {item.icon}
              </span>
              <span className="hidden text-center font-medium capitalize xl:block">
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Discover;
