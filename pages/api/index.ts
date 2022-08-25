// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as dev from '@/constants/development';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).send({
    currentDate: new Date().toISOString(),
    currentTimestamp: Date.now(),
    serverVersion: dev.serverVersion,
    serverRegion: dev.serverRegion
  });
}
