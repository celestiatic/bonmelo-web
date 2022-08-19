export const deploymentMode = process.env["NEXT_PUBLIC_VERCEL_ENV"] || "development";
export const isDev = deploymentMode == 'development' ?? false;
export const port = isDev ? 3000 : process.env["PORT"];
export const serverAddress = isDev
  ? `http://localhost:${port}`
  : process.env["NEXT_PUBLIC_VERCEL_URL"] || "https://chat.bonmelo.com";
export const gatewayAddress = isDev
  ? `http://localhost:3001`
  : "https://paperthin.bonmelo.com";
export const serverRegion = isDev ? 'local' : "US-WEST";
export const gitSHA =
  process.env["NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA"] || "Unavailable";
export const serverVersion = "2022.81592";
export const appVersion = "v0.1 (2022.819.2)";