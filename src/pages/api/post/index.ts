import type { NextApiRequest, NextApiResponse } from "next";
import { Video } from "../../../../types";
import { client } from "../../../utils/client";
import { allPostsQuery } from "../../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Video>
) {
  if (req.method === "GET") {
    const query = allPostsQuery();
    const data = await client.fetch(query);
    res.status(200).json(data);
  }
}
