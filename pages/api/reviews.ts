import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: { review, score, createdById, createdForId },
    } = req;

    const reviews = await client.review.create({
      data: {
        review,
        score,
        createdBy: {
          connect: { id: createdById },
        },
        createdFor: {
          connect: {
            id: createdForId,
          },
        },
      },
    });
    res.json({
      ok: true,
      reviews,
    });
  }

  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const reviews = await client.review.findMany({
      where: {
        createdForId: user?.id,
      },
      include: {
        createdBy: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.json({
      ok: true,
      reviews,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
