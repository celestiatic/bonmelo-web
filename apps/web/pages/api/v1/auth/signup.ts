// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler, resolveHandler } from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import { supabase } from "@/clients/server/supabase";
import { serverAddress } from "@/constants/development";
import type { NextApiRequest, NextApiResponse } from "next";
import rn from 'random-number'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await middleware(req, res, { requireAuth: false });
    if (req.method != "POST")
      return rejectHandler(res, {
        code: "rejected/method_invalid",
        reason: "Request Method not allowed, must be POST.",
        status: 403,
      });

    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } = req.body;
    
    if (username.match(/^[0-9A-Za-z]+$/) === null) {
      return rejectHandler(res, {
        code: "rejected/username_invalid",
        reason: "Username must be alphanumeric",
        status: 400,
      });
    }

      const checkbeforeuserdata = await prismaClient.users.findFirst({
        where: {
          username: username,
        },
      });
      if (checkbeforeuserdata) {
        rejectHandler(res, {
          code: "rejected/user_already_exists_indb_basedusername",
          reason: "Username already exists",
          status: 403,
        });
        return;
      }

    const userUsedDiscrimnators = await prismaClient.users.findMany({
      where: {
        username: username,
      },
      select: {
        discriminator: true,
      }
    })
    let discriminator = rn({ min: 1111, max: 9999, integer: true }).toString();

    while (userUsedDiscrimnators.find(u => u.discriminator == discriminator)) {
      discriminator = rn({ min: 1111, max: 9999, integer: true }).toString();
    }

    const newuser = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        redirectTo: `${serverAddress}/auth`,
      }
    );
    if (!newuser.user) {
      rejectHandler(res, {
        code: "rejected/user_signup_fail",
        reason: "A error occured while signing up and the process could not be completed",
        status: 500,
        error: newuser?.error,
      });
      return;
    }
      const userdata = await prismaClient.users.create({
        data: {
          userid: newuser?.user?.id,
          username: username,
          lastseen: Date.now().toString(),
          discriminator: discriminator,
        },
      });
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
      error: err,
    });
  }
}
