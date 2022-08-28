import type { NextApiRequest, NextApiResponse } from "next";
import { isDev, serverVersion } from "@/constants/development";
import { supabase } from "@/clients/server/supabase";
import { TypeChannels, TypeUsers, UserMappingFilter } from '@/clients/server/apiMapper'
import { prismaClient } from "@/clients/server/prisma";
import { Bots, Channels, prisma, Users } from "@prisma/client";
import NextCors from "nextjs-cors";
import * as dev from '@/constants/development'

export async function middleware(
  req: NextApiRequest,
  res: NextApiResponse,
  { requireAuth = true }
):Promise<Users|Bots|null> {
    const initialized = res['initialized'] || false

    return new Promise(async (resolve, reject) => {

      // inits
      await NextCors(req, res, {
        // Options
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
        origin: ['*'],
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
      });

      async function checkAuth(): Promise<TypeUsers|Bots|null> {
        return new Promise(async (resolve, reject) => {
          if (requireAuth) {
            const { accesstoken, accesstype, applicationid } = req.headers;
            const userData = await getUserData(accesstoken as string, {
              accessType: accesstype as string,
              applicationId: applicationid as string,
            }).catch((err) => {
              console.log(accesstoken);
              return reject({
                code: `${err?.code}`,
                reason: err?.reason,
                status: 500,
              });
            });
            if (!userData) {
              return reject({
                code: "user_not_found",
                reason: "User not found",
                status: 404,
              }) as any;
            }
            resolve(userData);
          } else {
            resolve(null)
          }
        });
      }
      // await setupSocket(req, res);
      const userData = await checkAuth().catch((err) => reject(err));
      res["initialized"] = true;
      resolve(userData as TypeUsers);
    });
}

export function disconnect(): boolean {
  prismaClient.$disconnect()
  return true
}

export function rejectHandler(
  res: any,
  {
    status = 500,
    code = "unknown/rejected/unknown",
    reason = "A mistake on the server has occurred",
    error = null
  }
  : 
  {
    status:number
    code:string
    reason:string
    error?:any
  }
) {
  const finalobj = {
    success: false,
    server: {
      version: serverVersion,
    },
    status: status,
    code: code,
    reason: reason,
    ...(isDev && {
      devError: error,
    })
  };
  res.status(status).send(finalobj);
  return true;
}

interface Resolvation {
  status?: number;
  code?: string;
  data: Object | any;
}

export function resolveHandler(
  res: any,
  { status = 200, code = "resolved/unknown", data = {} }: Resolvation
) {
  const finalobj = {
    success: true,
    server: {
      version: serverVersion,
    },
    status: status,
    code: code,
    data: data,
  };
  res.status(status).send(finalobj);
  return true;
}

// export async function _getUserData(accessToken) {
//   return new Promise(async (resolve, reject) => {
//     const result = await prismaClient.bots.findFirst({
//       where: {
//         accessToken: accessToken as string,
//         parentApplication: applicationId as string,
//       },
//     });
//     prismaClient.$disconnect();
//     if (!result) reject();
//     resolve(result);
//   });
// }

export async function getUserData(
  accessToken:string,
  { accessType, applicationId }:{accessType:string, applicationId?:string}
): Promise<Users|Bots> {
  return new Promise(async (resolve, reject) => {

    // checks
    if (!accessToken || !accessType) return reject({
      status: 400,
      code: 'missing_parameters',
      reason: 'Missing parameters such as accessToken and accessType',
    })
    const auth = supabase.auth;

    async function _getUserData(accessToken, { avatar = true }): Promise<TypeUsers> {
      return new Promise(async (resolve, reject) => {
        const { user, error } = await auth.api.getUser(accessToken as string);
        if (!user || error) {
          return reject({
            code: "auth_failure",
            status: error?.status || 401,
            reason: error?.message || "Authentication keychain not found",
          });
        }

        const userdata = await prismaClient.users.findFirst({
          where: {
            userid: user?.id,
          },
        });

        let toresolve: any = userdata;
        const extradatas = {
          avatarURL: "",
        };
        if (avatar == true) {
          const avatardata = await supabase.storage
            .from("avatars")
            .createSignedUrl(userdata?.id as string, 604800);

          if (avatardata?.signedURL || !avatardata?.error) {
            extradatas["avatarURL"] = avatardata.signedURL as string;
          }
        }

        Object.assign(toresolve, extradatas);
        resolve(toresolve);
      });
    }

    async function _getBotData(accessToken):Promise<Bots> {
      return new Promise(async (resolve, reject) => {
        const result = await prismaClient.bots.findFirst({
          where: {
            accessToken: accessToken as string,
            parentApplication: applicationId as string,
          },
        });
        prismaClient.$disconnect();
        if (!result)
          return reject({
            code: "bot_not_found",
            status: 401,
            reason:
              "Invalid Application Authentication Token or Parent Application provided.",
          });

        resolve(result);
      });
    }



    switch (accessType) {
      case "application":
        const result = await _getBotData(accessToken).catch((err) =>
          reject(err)
        );
        if (!result)
          return reject({ status: 500, code: "unableToFetchApplicationData", reason: "unknown" });
        resolve(result);
        break;

      case "user":
        const userData = await _getUserData(accessToken, { avatar: true })
        .catch((err) => reject(err))
        if (!userData) return reject({ status: 500, code: 'unableToFetchUserData', reason: 'unknown' })
        resolve(userData);
        break;

      default:
        reject({
          status: 400,
          code: 'invalid_access_type',
          reason: 'Invalid access type',
        })
        break;
    }
  });
}

export async function getUserDataMany(userData:Users, ids): Promise<Array<TypeUsers>> {
  return new Promise(async (resolve, reject) => {

    // // check if users have friends
    // if ((userData?.friends?.length || 0) == 0)
    //   return reject({ status: 405, code: "no_friends", reason: "No friends found" });

      const userSearchIds = ids
    // const userSearchIds:Array<string> = []
    // const userFriendsIds = userData.friends.map((friend:any) => friend?.id)
    // // console.log(ids)
    // // console.log(userFriendsIds);
    // for (const userSearchId of ids) {
    //   if (userFriendsIds?.includes(userSearchId)) {
    //     userSearchIds.push(userSearchId);
    //     break;
    //   }
    // }
    // if (userSearchIds.length == 0) return reject({ status: 405, code: "no_users_fetchable", reason: "No users fetchable" });

      let usersdata = await prismaClient.users.findMany({
        where: {
          id: {
            in: userSearchIds,
          },
        },
      });

      for (const userData of usersdata) {
        const index = usersdata.findIndex((user) => user.id == userData.id);
        usersdata[index] = UserMappingFilter(userData, "public");
      }

    const userIds = usersdata.map((user) => {
      return user?.id;
    });
    const rawAvatarDatas = await supabase.storage
      .from("avatars")
      .createSignedUrls(userIds, 86400);
    const avatarDatas = rawAvatarDatas?.data;
    if (!avatarDatas) return;

    for (const [index, avatarData] of avatarDatas.entries()) {
      const user = usersdata[index];
      const url = avatarData.signedURL;

      const extradatas = {
        avatarURL: url,
      };
      Object.assign(user, extradatas);
    }
    const toresolve = usersdata as Array<TypeUsers>;
    resolve(toresolve);
  });
}