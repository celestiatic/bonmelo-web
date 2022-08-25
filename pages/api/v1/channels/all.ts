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
    const userData = await middleware(req, res, { requireAuth: true });

    const channels = await prismaClient.channels.findMany({
      where: {
        members: {
          hasSome: [userData?.id as string],
        },
      },
    });

    let userstofetch: Array<string> = [];
    for (const channel of channels) {
      channel.members.forEach((convomemberid) => {
        userstofetch?.push(convomemberid);
      });
    }
    const usersdata = await prismaClient.users.findMany({
      where: {
        id: {
          in: userstofetch,
        },
      },
    });

    channels.forEach((channel) => {
      for (const memberid of channel.members) {
        const parseduser = usersdata.find((user) => user.id == memberid);
        if (parseduser) {
          channels.find((channelData) => channelData.id == channel.id)!.members[memberid] = parseduser;
        }
      }
    });
    prismaClient.$disconnect();
    resolveHandler(res, {
      data: channels,
      code: "resolved/success",
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
