import axios from "axios";
import jwtDecode from "jwt-decode";
import { IUser } from "../../types";

export const createOrGetUser = async (response: any, addUser: any) => {
  const decoded: {
    name: string;
    picture: string;
    sub: string;
  } = jwtDecode(response.credential);

  const user: IUser = {
    _id: decoded.sub,
    _type: "user",
    userName: decoded.name,
    image: decoded.picture,
  };

  addUser(user);

  await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, user, {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  });
};
