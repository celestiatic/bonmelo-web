// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getUserData, middleware, rejectHandler, resolveHandler } from '@/clients/server/api';
import { prismaClient } from '@/clients/server/prisma';
import { supabase } from '@/clients/server/supabase';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { themeid } = req.query
  const { accesstoken, accesstype, applicationid } = req.headers;

  try {
    middleware(req, res, { requireAuth: false });

    const theme = await prismaClient.themes.findFirst({
      where: {
        nameId: themeid!.toString(),
      },
    });
    if (!theme)
      return rejectHandler(res, {
        code: "rejected/not_found",
        reason: "Theme was not found with specified id.",
        status: 404,
      });

    resolveHandler(res, {
      code: "resolved/success",
      data: theme,
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
