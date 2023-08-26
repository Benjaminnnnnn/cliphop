import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../utils/client";
import { allUsersQuery } from "../../utils/queries";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const data = await client.fetch(allUsersQuery());
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      res.status(500).json("Failed to fetch all users.");
    }
  }
}
