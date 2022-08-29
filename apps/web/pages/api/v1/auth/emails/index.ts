// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler, resolveHandler } from "@/clients/server/api";
import { prismaClient } from "@/clients/server/prisma";
import { supabase } from "@/clients/server/supabase";
import { RouterBuilder } from "next-api-handler";

const router = new RouterBuilder();
router.post(async (req, res) => {
  const { email } = req.body;

    await middleware(req, res, { requireAuth: false });

    if (typeof email != 'string') {
      throw rejectHandler(null, {
        code: "rejected/missing_parameters",
        reason: "The email parameter was not found or the email type was not a string",
        status: 400,
      })
    }

    let userExists = false;
    const { data } = await supabase.auth.api.listUsers();
    const user = data?.find((user) => user?.email == email);
    if (user) {
      userExists = true;
    } else {
      userExists = false;
    }

    return resolveHandler(null, {
      code: "resolved/success",
      data: {
        exists: userExists,
      },
      status: 200,
    });
})

export default router.build();