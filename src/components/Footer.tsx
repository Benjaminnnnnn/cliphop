import { footerList1, footerList2, footerList3 } from "../utils/constants";

const List = ({ items, mt }: { items: string[]; mt: boolean }) => (
  <div className={`${mt && "mt-5"} flex flex-wrap gap-2`}>
    {items.map((item) => (
      <p
        key={item}
        className="cursor-pointer text-sm text-gray-400 hover:underline"
      >
        {item}
      </p>
    ))}
  </div>
);

const Footer = () => {
  return (
    <div className="mt-6 hidden xl:block">
      <List items={footerList1} mt={false}></List>
      <List items={footerList2} mt></List>
      <List items={footerList3} mt></List>

      <p className="mt-5 text-sm text-gray-400">2022 Cliphop</p>
    </div>
  );
};

export default Footer;
