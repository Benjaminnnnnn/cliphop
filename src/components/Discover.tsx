import Link from "next/link";
import { useRouter } from "next/router";
import { topics } from "../utils/constants";

const Discover = () => {
  const router = useRouter();
  const { topic } = router.query;

  const activeTopicStyle =
    "flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand/90 to-brandSecondary/90 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:brightness-105";
  const topicStyle =
    "flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition  hover:border-brand/30 hover:text-brand";

  return (
    <div className="pb-6 xl:border-b xl:border-white/80">
      <p className="m-3 mt-4 hidden text-sm font-semibold uppercase tracking-[0.18em] text-slate-400 xl:block">
        Popular Topics
      </p>
      <div className="flex flex-wrap gap-3">
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={topic === item.name ? activeTopicStyle : topicStyle}
            >
              <span className="text-xl xl:text-center">{item.icon}</span>
              <span className="hidden text-center font-semibold capitalize xl:block">
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
