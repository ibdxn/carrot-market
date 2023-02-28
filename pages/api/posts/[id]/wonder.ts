import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { id },
      session: { user },
    } = req;

    const WonderingExists = await client.wondering.findFirst({
      where: {
        userId: user?.id,
        postId: Number(id),
      },
    });
    res.json({ ok: true, WonderingExists });
  }

  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
    } = req;

    const alreadyExists = await client.wondering.findFirst({
      where: {
        userId: user?.id,
        postId: Number(id),
      },
      select: {
        id: true,
      },
    });
    if (alreadyExists) {
      await client.wondering.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.wondering.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          post: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
    }
    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
