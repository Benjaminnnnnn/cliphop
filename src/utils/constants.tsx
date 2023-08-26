import { BsCode, BsEmojiSunglasses } from "react-icons/bs";
import { FaGamepad, FaMedal, FaPaw, FaRegNewspaper } from "react-icons/fa";
import { GiCakeSlice, GiGalaxy, GiLipstick } from "react-icons/gi";
import { IoMusicalNotes } from "react-icons/io5";

export const topics = [
  {
    name: "development",
    icon: <BsCode />,
  },
  {
    name: "comedy",
    icon: <BsEmojiSunglasses />,
  },
  {
    name: "gaming",
    icon: <FaGamepad />,
  },
  {
    name: "food",
    icon: <GiCakeSlice />,
  },
  {
    name: "dance",
    icon: <GiGalaxy />,
  },
  {
    name: "beauty",
    icon: <GiLipstick />,
  },
  {
    name: "animals",
    icon: <FaPaw />,
  },
  {
    name: "sports",
    icon: <FaMedal />,
  },
  {
    name: "music",
    icon: <IoMusicalNotes />,
  },
  {
    name: "news",
    icon: <FaRegNewspaper />,
  },
].sort((a, b) => {
  if (a.name <= b.name) {
    return -1;
  } else {
    return 1;
  }
});

export const footerList1 = [
  "About",
  "Newsroom",
  "Store",
  "Contact",
  "Carrers",
  "ByteDance",
  "Creator Directory",
];
export const footerList2 = [
  "Cliphop for Good",
  "Advertise",
  "Developers",
  "Transparency",
  "Cliphop Rewards",
];
export const footerList3 = [
  "Help",
  "Safety",
  "Terms",
  "Privacy",
  "Creator Portal",
  "Community Guidelines",
];
