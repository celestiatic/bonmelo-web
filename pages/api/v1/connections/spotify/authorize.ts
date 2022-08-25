// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { middleware, rejectHandler, resolveHandler } from "@/clients/server/api";
import type { NextApiRequest, NextApiResponse } from "next";
import Spotify from 'spotify-web-api-node'
import queryString from 'query-string'
import { prismaClient } from "@/clients/server/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { code } = req.body

    try {
        const userData = await middleware(req, res, { requireAuth: true });
        if (!code) {
            return rejectHandler(res, {
                code: "invalid/missing-code",
                reason: "Missing code",
                status: 400,
            });
        }

        const spotifyConfig = {
          clientId: process.env["SPOTIFY_CLIENTID"],
          clientSecret: process.env["SPOTIFY_CLIENTSECRET"],
          redirectUri: process.env["SPOTIFY_REDIRECT_URI"],
        };

        async function fetchSpotifyAccessToken(code:string) {
            const spotifyUrl = new URL("https://accounts.spotify.com/api/token");
            spotifyUrl.searchParams.append("grant_type", "authorization_code");

            const data = await fetch(spotifyUrl?.href, {
              method: "POST",
              headers: new Headers({
                Authorization: `Basic ${Buffer.from(
                  `${spotifyConfig?.clientId}:${spotifyConfig?.clientSecret}`
                ).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
              }),
              body: queryString.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: spotifyConfig?.redirectUri,
              }),
            }).then(async (response) => {
              const clonedResponse = response.clone();
              const jsonData = await clonedResponse.json();
              return jsonData;
            });
            return data;
        }

        const accessData = await fetchSpotifyAccessToken(code);
        const SpotifyWebApi = new Spotify(spotifyConfig);
        SpotifyWebApi.setAccessToken(accessData?.['access_token']);
        const playbackState = await SpotifyWebApi.getMyCurrentPlaybackState()

        if (playbackState) {

          const currentUserConnectionData = await prismaClient.connections.findFirst({
            where: {
              userid: userData?.id
            }
          })
          if (!currentUserConnectionData) {
            await prismaClient.connections.create({
              data: {
                userid: userData?.id,
              },
            });
          }

            await prismaClient.connections.update({
              where: {
                userid: userData?.id,
              },
              data: {
                spotifyAuthData: accessData,
              },
            });

            resolveHandler(res, {
              status: 200,
              data: accessData,
              code: "resolved/success",
            });
        } else {
            rejectHandler(res, {
                code: "rejected/error",
                reason: "Failed to get playback state using access token",
                status: 500,
            });
        }
    } catch (err:any) {
        console.log(err)
        return rejectHandler(res, {
          code: err?.code,
          reason: err?.reason,
          status: err?.status || 500,
          error: err
        });
    }
}