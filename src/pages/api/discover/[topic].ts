import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";
import { topicPostsQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { topic } = req.query;
      const videosQuery = topicPostsQuery(topic);
      const videos = await client.fetch(videosQuery);
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json("Unable to fetch videos by topic.");
    }
  }
}
