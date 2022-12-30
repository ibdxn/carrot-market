import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";
//9:36
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: {answer}
  } = req;

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
            id: Number(id)
        }
      },
      answer,
    },
  });
  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });

  if (!post) res.status(404).json({ ok: false, error: "Not found post" });

  res.json({
    ok: true,
    answer: newAnswer,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
