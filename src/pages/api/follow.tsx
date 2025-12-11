import type { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../utils/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, targetUserId, follow } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ error: "Missing user ids" });
  }

  try {
    if (follow) {
      await client
        .patch(targetUserId)
        .setIfMissing({ followers: [] })
        .insert("after", "followers[-1]", [{ _key: uuid(), _ref: userId }])
        .commit();

      await client
        .patch(userId)
        .setIfMissing({ following: [] })
        .insert("after", "following[-1]", [{ _key: uuid(), _ref: targetUserId }])
        .commit();
    } else {
      await client
        .patch(targetUserId)
        .unset([`followers[_ref=="${userId}"]`])
        .commit();

      await client
        .patch(userId)
        .unset([`following[_ref=="${targetUserId}"]`])
        .commit();
    }

    const updatedTarget = await client.fetch(
      `*[_type == "user" && _id == '${targetUserId}'][0]{followers[]{_key,_ref}}`
    );

    res.status(200).json({ followers: updatedTarget?.followers || [] });
  } catch (error) {
    res.status(500).json({ error: "Unable to update follow status." });
  }
}
