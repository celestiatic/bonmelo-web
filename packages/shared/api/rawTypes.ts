import * as database from "@prisma/client";
export const {
  applications,
  badges,
  bots,
  channels,
  connections,
  messages,
  settings,
  themes,
  users,
} = database.PrismaClient.prototype;

export type Applications = typeof applications;
export type Badges = typeof badges;
export type Bots = typeof bots;
export type Channels = typeof channels;
export type Connections = typeof connections;
export type Messages = typeof messages;
export type Settings = typeof settings;
export type Users = typeof users;
