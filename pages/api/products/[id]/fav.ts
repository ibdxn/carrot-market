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
      query: { productId },
      session: { user },
    } = req;

    const favExists = await client.fav.findFirst({
      where: {
        productId: Number(productId),
        userId: user?.id,
      },
    });
    res.json({ ok: true, favExists });
  }

  if (req.method === "POST") {
    const {
      query: { id },
      session: { user },
    } = req;

    const alreadyExists = await client.fav.findFirst({
      where: {
        productId: Number(id),
        userId: user?.id,
      },
    });
    if (alreadyExists) {
      await client.fav.delete({
        where: {
          id: alreadyExists.id,
        },
      });
    } else {
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          product: {
            connect: {
              id: Number(id),
            },
          },
        },
      });
    }
    res.json({ ok: true });
  }
}
export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
