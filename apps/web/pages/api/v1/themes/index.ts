// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler, resolveHandler } from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: false });

    const themes = await prismaClient.themes.findMany();

    resolveHandler(res, {
      code: "resolved/success",
      data: themes,
      status: 200,
    });
  } catch (err:any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
}
