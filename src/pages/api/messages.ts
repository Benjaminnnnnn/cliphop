import type { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../utils/client";

const messageFields = `{
  _id,
  text,
  createdAt,
  read,
  from->{_id,userName,image},
  to->{_id,userName,image},
  conversation->{_id}
}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { conversationId } = req.query;
    if (!conversationId) {
      return res.status(400).json({ error: "Missing conversationId" });
    }

    try {
      const messages = await client.fetch(
        `*[_type=="message" && conversation._ref==$conversationId] | order(createdAt asc) ${messageFields}`,
        { conversationId }
      );
      return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json({ error: "Unable to fetch messages" });
    }
  }

  if (req.method === "POST") {
    const { conversationId, text, from, to } = req.body;
    if (!conversationId || !text || !from || !to) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const now = new Date().toISOString();

    try {
      const messageDoc = {
        _type: "message",
        _id: uuid(),
        text,
        createdAt: now,
        read: false,
        from: { _type: "reference", _ref: from },
        to: { _type: "reference", _ref: to },
        conversation: { _type: "reference", _ref: conversationId },
      };

      const created = await client.create(messageDoc);

      await client
        .patch(conversationId)
        .set({
          lastMessage: { _type: "reference", _ref: created._id },
          updatedAt: now,
        })
        .commit();

      const populated = await client.fetch(
        `*[_type=="message" && _id==$id]${messageFields}`,
        { id: created._id }
      );

      return res.status(200).json(populated);
    } catch (err) {
      return res.status(500).json({ error: "Unable to send message" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
