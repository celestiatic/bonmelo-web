// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler } from '@/clients/server/api';
import { supabase } from '@/clients/server/supabase';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { userId, avatarId } = req.query

  try {
    middleware(req, res, { requireAuth: false });

    const downloadBlob = await supabase.storage.from('avatars').download(`${userId}/${avatarId}`)
    if (downloadBlob?.error || !downloadBlob?.data?.stream) {
      return rejectHandler(res, {
        code: 'rejected/error',
        reason: 'The avatar resource you are trying to find is not available.',
        status: 404,
      });
    }
    downloadBlob.data?.stream().pipe(res);
  } catch (err:any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
}
