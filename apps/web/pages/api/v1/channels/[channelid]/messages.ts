// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  rejectHandler,
  resolveHandler,
  middleware,
} from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import { UserMapping } from "@/clients/server/apiMapper";
import { NextApiResponseServerIO } from "@/constants/declarations/next";
import { Messages } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { EmbedParser } from "@/clients/server/EmbedParser";
import { messagesPerBonscore } from "@/constants/development";
import { client } from '@/clients/server/trpc'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const { channelid, before, take } = req.query;
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    const userData = await middleware(req, res, { requireAuth: true });
    let errors = [];

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

    if (req.method == "POST") {
      const { content } = req.body;
      if (content.trim()?.length == 0)
        return rejectHandler(res, {
          code: "rejected/message_content_empty",
          reason: "Message content is empty",
          status: 400,
        });

      const embedParser = new EmbedParser();
      const embeds = await embedParser.extract(content);

      const messageUuid = uuidv4();
      const messageData: Messages = {
        id: messageUuid,
        created_at: new Date(),
        embeds: (embeds as any) || [],
        authorid: userData!.id,
        timestamp: Date.now().toString(),
        content: content,
        channelid: channel!.id!.toString(),
        edited: false,
        visible: true,
      };
      // res.socket.server.io
      //   .to(channel!.id!.toString())
      //   .emit("message_create", messageData);
      // client.mutation("createMessage", {
      //   messageData: messageData,
      // });
      resolveHandler(res, {
        code: "resolved/success",
        data: messageData,
        status: 200,
      });

      // Message add to database
      await prismaClient.messages.create({
        data: messageData,
      });

      // Bonscore parsing
      const messagesCount = await prismaClient.messages.count({
        where: {
          channelid: channel?.id?.toString(),
        },
      });
      const bonScore = Math.floor(
        messagesCount / messagesPerBonscore
      ).toString();
      if (channel?.bonscore != bonScore)
        await prismaClient.channels.update({
          where: {
            id: channel?.id?.toString(),
          },
          data: {
            bonscore: bonScore,
          },
        });

      prismaClient.$disconnect();
    }

    if (req.method == "GET") {
      const messages = await prismaClient.messages.findMany({
        where: {
          channelid: channelid!.toString() as string,
        },
        orderBy: {
          timestamp: "desc",
        },
        take: take ? Number(take as string) : 50,
        ...(before && {
          cursor: {
            id: before as string,
          },
        }),
      });

      let userstofetch: Array<string> = [];
      for (const message of messages) {
        if (!message) return;
        const authorid = message?.authorid as string;
        if (!userstofetch.includes(authorid)) userstofetch?.push(authorid);
      }
      const users = await prismaClient.users.findMany({
        where: {
          id: {
            in: userstofetch,
          },
        },
        select: UserMapping.public,
      });
      for (const message of messages) {
        message["author"] = users.find((user) => user.id == message?.authorid);
      }

      prismaClient.$disconnect();

      resolveHandler(res, {
        code: "resolved/success",
        data: messages,
        status: 200,
      });
    }

    // Global
    const nowDate = Date.now().toString();
    await prismaClient.channels.update({
      where: {
        id: channel?.id,
      },
      data: {
        lastseentimestamp: nowDate,
      },
    });
  } catch (err: any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
      error: err
    });
  }
}
