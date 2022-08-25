import { PrismaClient } from "@prisma/client";
import type pristype from "@prisma/client";
import Redis from "ioredis";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import { isDev } from "@/constants/development";

const allowRedisLogs = false
let prisma: pristype.PrismaClient;

function initPrisma():pristype.PrismaClient {
  const redisCacheTime = isDev ? 45 : 600 // left is dev, right is production
  const prismaClient = new PrismaClient();
  const reCreatePrismaRedisCache: any = createPrismaRedisCache;
  const PrismaRedisCache:any = reCreatePrismaRedisCache({
    models: [
      { model: "Users", cacheTime: redisCacheTime },
      { model: "Channels", cacheTime: redisCacheTime },
      { model: "Messages", cacheTime: redisCacheTime },
      { model: "Badges", cacheTime: redisCacheTime },
      { model: "Connections", cacheTime: redisCacheTime },
    ],
    storage: {
      type: "memory",
      options: {
        invalidation: true,
        log: isDev && allowRedisLogs ? console : null,
      },
    },
    cacheTime: redisCacheTime,
    onDedupe: (key) => {
      if (isDev && allowRedisLogs) console.log("Prisma Redis Deduped", key);
    },
    onHit: (key) => {
      if (isDev && allowRedisLogs) console.log("Prisma Redis Hit", key);
    },
    onMiss: (key) => {
      if (isDev && allowRedisLogs) console.log("Prisma Redis Missed", key);
    },
    onError: (key) => {
      console.log("Prisma Redis Error", key);
    },
  });

  prismaClient.$use(PrismaRedisCache);
  return prismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = initPrisma();
} else {
  if (!global.prisma) {
    global.prisma = initPrisma();
  }

  prisma = global.prisma;
}

export const prismaClient = prisma;
