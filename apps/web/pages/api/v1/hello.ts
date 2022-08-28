// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler, resolveHandler } from "@/clients/server/api";
import { UserMappingFilter } from "@/clients/server/apiMapper";
import { prismaClient } from "@/clients/server/prisma";
import { Users } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accesstoken, accesstype, applicationid } = req.headers;

  interface dataType {
    channels: Array<any>;
    users: Array<any>;
    currentUser: any;
    connections: any;
  }

  try {
    const userData = await middleware(req, res, { requireAuth: true });
    const data: dataType = {
      channels: [],
      users: [],
      currentUser: {},
      connections: {},
    };

    // Channels Fetching
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
        if (convomemberid == userData?.id) return;
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

    // Put userdata inside usersdata
    usersdata.push(userData as Users)

    channels.forEach((channel) => {
      for (const memberid of channel.members) {
        const parseduser = usersdata.find((user) => user.id == memberid);
        if (parseduser) {
          channels.find((channelData) => channelData.id == channel.id)!.members[
            memberid
          ] = parseduser;
        }
      }
    });

    const filteredUsersData:Array<Users> = []
    for (const userDataIterate of usersdata) {
      const filtered =
        userData?.id == userDataIterate?.id
          ? userDataIterate
          : UserMappingFilter(userData, "public");
      filteredUsersData.push(filtered);
    }

    // connections fetching
    const connections = await prismaClient.connections.findFirst({
      where: {
        userid: userData?.id as string,
      },
    })

    // sets
    data['channels'] = channels;
    data["users"] = filteredUsersData;
    data["currentUser"] = UserMappingFilter(userData, 'private');
    data["connections"] = connections;

    prismaClient.$disconnect();
    resolveHandler(res, {
      data: data,
      code: "resolved/success",
      status: 200,
    });
  } catch (err: any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
}
