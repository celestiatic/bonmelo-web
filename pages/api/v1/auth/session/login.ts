// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler } from "@/clients/server/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channelid } = req.query;
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: true });
    res.status(200).send(userData);

  } catch (err:any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
}