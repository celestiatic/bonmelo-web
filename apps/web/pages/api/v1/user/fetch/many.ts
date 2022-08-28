// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { resolveHandler, rejectHandler, middleware } from "@/clients/server/api";
import { getUserData, getUserDataMany } from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import { Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: true });

    // Filter to remove blanks and nulls
    const ids = (id as Array<string>).filter((id) => id);

    const userdata = await getUserDataMany(userData as Users, ids).catch(
      (err) => {
        return rejectHandler(res, {
          code: `rejected/${err?.code}`,
          reason: err?.reason,
          status: 500,
        });
      }
    );
    prismaClient.$disconnect();

    resolveHandler(res, {
      code: "resolved/success",
      data: userdata,
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
