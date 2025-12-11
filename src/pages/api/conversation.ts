import type { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../utils/client";

const conversationFields = `{
  _id,
  participants[]->{_id,userName,image},
  lastMessage->{
    _id,
    text,
    createdAt,
    from->{_id,userName,image}
  },
  updatedAt
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    try {
      const conversations = await client.fetch(
        `*[_type=="conversation" && $userId in participants[]._ref] | order(updatedAt desc) ${conversationFields}`,
        { userId }
      );
      return res.status(200).json(conversations);
    } catch (err) {
      return res.status(500).json({ error: "Unable to fetch conversations" });
    }
  }

  if (req.method === "POST") {
    const { userId, participantId } = req.body;
    if (!userId || !participantId) {
      return res.status(400).json({ error: "Missing userId or participantId" });
    }

    try {
      const existing = await client.fetch(
        `*[_type=="conversation" && $userId in participants[]._ref && $participantId in participants[]._ref][0]${conversationFields}`,
        { userId, participantId }
      );

      if (existing?._id) {
        return res.status(200).json(existing);
      }

      const now = new Date().toISOString();
      const doc = {
        _type: "conversation",
        _id: uuid(),
        participants: [
          { _type: "reference", _ref: userId },
          { _type: "reference", _ref: participantId },
        ],
        updatedAt: now,
      };

      const created = await client.createIfNotExists(doc);
      const populated = await client.fetch(
        `*[_type=="conversation" && _id==$id]${conversationFields}`,
        { id: created._id }
      );

      return res.status(200).json(populated);
    } catch (err) {
      return res.status(500).json({ error: "Unable to create conversation" });
    }
  }

  if (req.method === "DELETE") {
    const { conversationId } = req.query;
    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }
    try {
      const messageIds: string[] =
        (await client.fetch(
          `*[_type=="message" && conversation._ref==$conversationId]._id`,
          { conversationId }
        )) || [];

      let tx = client.transaction().delete(conversationId as string);
      messageIds.forEach((id) => {
        tx = tx.delete(id);
      });
      await tx.commit();

      return res.status(200).json({ deleted: true });
    } catch (err) {
      return res.status(500).json({ error: "Unable to delete conversation" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
