module.exports = {
  important: true,
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent)",
        accentDark: "var(--accent_dark)",
        background: "var(--background)",
        backgroundDark: "var(--background_dark)",
        primaryBackground: "var(--primary-background)",
        primaryBackgroundDark: "var(--primary-background_dark)",
        chatBackground: "var(--chatBackground)",
        chatBackgroundDark: "var(--chatBackground_dark)",
        foreground: "var(--foreground)",
        foregroundDark: "var(--foreground_dark)",
        secondaryForeground: "var(--secondary-foreground)",
        secondaryForegroundDark: "var(--secondary-foreground_dark)",
        messageBox: "var(--message-box)",
        messageBoxDark: "var(--message-box_dark)",
        alertDialog: "var(--alert-dialog)",
        alertDialogDark: "var(--alert-dialog_dark)",
        embedBackground: "var(--embed-background)",
        embedBackgroundDark: "var(--embed-background_dark)",
        mention: "var(--mention)",
        mentionDark: "var(--mention_dark)",
        success: "var(--success)",
        successDark: "var(--success_dark)",
        warning: "var(--warning)",
        warningDark: "var(--warning_dark)",
        error: "var(--error)",
        errorDark: "var(--error_dark)",
        hover: "var(--hover)",
        hoverDark: "var(--hover_dark)",
        primaryHeader: "var(--primary-header)",
        primaryHeaderDark: "var(--primary-header_dark)",
      },
    },
    fontFamily: {
      Fredoka: ["Fredoka", "serif"],
      Torus: ["Torus", "serif"],
      Pishel: ["Pishel", "serif"],
      PalmerLake: ["PalmerLake", "serif"],
      Bonfont: ["Bonfont", "serif"],
      TTInterface: ["TTInterface", "Helvetica", "sans-serif"],
    },
  },
  plugins: [
    require("@mertasan/tailwindcss-variables")({
      darkToRoot: false,
    }),
  ],
};