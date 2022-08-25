import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/constants/declarations/next"
import { middleware, rejectHandler } from '@/clients/server/api'

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  try {
    await middleware(req, res, { requireAuth: false });
    res.status(200)
  } catch(err:any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
};
