import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import {
  singleUserQuery,
  userCreatedPostsQuery,
  userLikedPostsQuery,
} from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      const userQuery = singleUserQuery(id);
      const userVideosQuery = userCreatedPostsQuery(id);
      const userLikedVideosQuery = userLikedPostsQuery(id);

      const user = await client.fetch(userQuery);
      const userVideos = await client.fetch(userVideosQuery);
      const userLikedVideos = await client.fetch(userLikedVideosQuery);

      res.status(200).json({
        user: user[0],
        userVideos,
        userLikedVideos,
      });
    } catch (error) {
      res.status(500).json("Failed to get user profile.");
    }
  }
}
