// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler } from '@/clients/server/api';
import { TypeGifs } from '@/clients/server/apiMapper';
import type { NextApiRequest, NextApiResponse } from 'next'
import { TenorClient } from '@/clients/server/TenorClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { channelid, take, query } = req.query

  try {
    const userData = await middleware(req, res, { requireAuth: true });

    const TenorResult:Array<any> = await TenorClient.Search.Query(query, take || 128);
    
    const result:Array<any> = []

    for (const [index, TenorPost] of TenorResult.entries()) {
      const mediaData = TenorPost?.media[0]
      const gifData = mediaData?.gif
      const tinyGifData = mediaData?.tinygif;
      const recomposedMediaData: TypeGifs = {
        id: TenorPost?.id,
        index: index,
        itemurl: TenorPost?.itemurl,
        gif_preview_static_src: gifData?.preview,
        gif_preview_src: tinyGifData?.url,
        gif_src: gifData?.url,
        width: gifData?.dims[0],
        height: gifData?.dims[1],
        size: gifData?.size,
      };

      result.push(recomposedMediaData);
    }

    res.status(200).send(result);

      // .then((Results) => {
      //   Results.forEach((Post) => {
      //     console.log(
      //       `Item #${Post.id} (Created: ${Post.created}) @ ${Post.url}`
      //     );
      //   });
      // })
      // .catch(console.error);

    // const tenorFetch = await fetch(
    //   `https://g.tenor.com/v1/search?q=${encodeURIComponent(
    //     query as string)}&key=${encodeURIComponent(tenorToken as string)}&limit=${take || 128}`
    // );
    // const fetchResult = await tenorFetch.json()
  } catch (err:any) {
    return rejectHandler(res, {
      code: err?.code,
      reason: err?.reason,
      status: err?.status || 500,
    });
  }
}
