interface themeData {
  global?: {
    fonts?: {
      body?: Array<string>;
    };
  };
  sidebar?: {
    image?: string;
    color: string;
    darken?: number;
    blur?: number;
  };
  chatToolBar?: {
    image?: string;
    color?: string;
    darken?: number;
    blur?: number;
  };
  chatBackground?: {
    image?: string;
    color: string;
    darken?: number;
    blur?: number;
  };
}

const lightTheme: themeData = {
  sidebar: {
    color: "#F5F5FF",
  },
  chatBackground: {
    color: "#fff",
    darken: 0,
  },
  chatToolBar: {
    darken: 0,
    blur: 0.5
  },
};
export default lightTheme;
