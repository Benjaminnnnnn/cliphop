import { footerList1, footerList2, footerList3 } from "../utils/constants";

const List = ({ items, mt }: { items: string[]; mt: boolean }) => (
  <div className={`${mt && "mt-5"} flex flex-wrap gap-2`}>
    {items.map((item) => (
      <p
        key={item}
        className="cursor-pointer text-xs font-medium text-slate-500 hover:text-brand hover:underline"
      >
        {item}
      </p>
    ))}
  </div>
);

const Footer = () => {
  return (
    <div className="mt-6 hidden rounded-2xl bg-white/60 p-4 shadow-inner shadow-white/60 xl:block">
      <List items={footerList1} mt={false}></List>
      <List items={footerList2} mt></List>
      <List items={footerList3} mt></List>

      <p className="mt-5 text-sm font-medium text-slate-400">
        2022 Cliphop · Made for creators
      </p>
    </div>
  );
};

export default Footer;
