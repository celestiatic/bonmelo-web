// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { resolveHandler, rejectHandler, middleware } from "@/clients/server/api";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: true });

    resolveHandler(res, {
      code: "resolved/success",
      data: userData,
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
