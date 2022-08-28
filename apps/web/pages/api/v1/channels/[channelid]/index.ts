// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  getUserData,
  middleware,
  rejectHandler,
  resolveHandler,
} from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channelid } = req.query
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: true });

    if (!channelid)
      return rejectHandler(res, {
        code: "rejected/missing_parameters",
        reason: "The channelid parameter was not found",
        status: 400,
      });

    const channel = await prismaClient.channels.findFirst({
      where: {
        id: channelid!.toString(),
      },
    });
    if (!channel)
      return rejectHandler(res, {
        code: "rejected/channel_not_found",
        reason: "Channel not found",
        status: 404,
      });

      if (!channel.members.includes(userData!.id))
        return rejectHandler(res, {
          code: "rejected/access_forbidden",
          reason: "Access forbidden",
          status: 403,
        });
      prismaClient.$disconnect();
      resolveHandler(res, {
        code: "resolved/success",
        data: channel,
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