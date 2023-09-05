import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import { searchPostsQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { searchTerm } = req.query;
      const videosQuery = searchPostsQuery(searchTerm);
      const videos = await client.fetch(videosQuery);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({
        message: "Cannot find the term you're searching for. Please try again.",
      });
    }
  }
}
