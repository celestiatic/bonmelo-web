import type { Users, Channels, Messages, Badges } from "@prisma/client";

export interface TypeUsers extends Users {}
export interface TypeBadges extends Badges {}
export interface TypeMessages extends Omit<Messages, "embeds"> {
  embeds: any;
}
export interface TypeChannels extends Channels {
  recipients: Array<string>;
}
export interface TypeThemeData {
  light: ThemeData;
  dark: ThemeData;
}
export interface ThemeData {
  metadata: {
    nameId: string;
    name: string;
    creator: string;
    description: string;
    tags: Array<string>;
    version: string;
  };
  accent: string;
  background: string;
  foreground: string;
  block: string;
  messageBox: string;
  mention: string;
  success: string;
  warning: string;
  error: string;
  hover: string;
  sidebar: {
    active: string;
  };
  scrollbar: {
    thumb: string;
    track: string;
  };
  primary: {
    background: string;
    foreground: string;
    header: string;
  };
  secondary: {
    background: string;
    foreground: string;
    header: string;
  };
  status: {
    online: string;
    away: string;
    streaming: string;
    invisible: string;
  };
}

export interface TypeGifs {
  id: string;
  index: number;
  itemurl: string;
  gif_preview_static_src: string;
  gif_preview_src: string;
  gif_src: string;
  width: number;
  height: number;
  size: number;
}

export const acitvityTypes = {
  "1": {
    id: "online",
    name: "Online",
    shortcode: "online",
  },
  "2": {
    id: "idle",
    name: "Idle",
    shortcode: "idle",
  },
  "3": {
    id: "donotdisturb",
    name: "Do not Disturb",
    shortcode: "dnd",
  },
  "4": {
    id: "offline",
    name: "Offline",
    shortcode: "offline",
  },
};

interface UsersType {
  public: Record<keyof TypeUsers, boolean>;
  private: Record<keyof TypeUsers, boolean>;
}
export const UserMapping: UsersType = {
  public: {
    id: true,
    created_at: true,
    username: true,
    discriminator: true,
    activityMessage: true,
    userid: false,
    activityStatus: true,
    badges: true,
    bannerColor: true,
    friends: false,
    lastseen: true,
    themeId: false,
    avatarId: true,
    userSettings: false,
    connections: false,
    onboardingSteps: false,
  },
  private: {
    id: true,
    created_at: true,
    username: true,
    discriminator: true,
    activityMessage: true,
    userid: false,
    activityStatus: true,
    badges: true,
    bannerColor: true,
    friends: true,
    lastseen: true,
    themeId: true,
    avatarId: true,
    userSettings: true,
    connections: true,
    onboardingSteps: true,
  },
};

export const UserMappingFilter = (
  data: any,
  type: "public" | "private"
): Users => {
  const returnValue: Users | any = {};
  const mapping = UserMapping[type];
  if (!mapping) return returnValue;

  for (let key in mapping) {
    const value = data[key];
    if (mapping[key] == true) {
      if (value) returnValue[key] = value;
    }
  }
  return returnValue;
};

// type UsersMappingType = Record<
//   keyof Prisma.UsersSelect,
//   { public: true; private: true }
// >;
