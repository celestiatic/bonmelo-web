export const deploymentMode = process.env["NEXT_PUBLIC_VERCEL_ENV"] ?? "development";
export const isDev = deploymentMode == 'development' ?? false;
export const port = isDev ? 3000 : process.env["PORT"];
export const serverAddress =
  (process.env["NEXT_PUBLIC_SERVER_ADDRESS"] ??
  process.env["NEXT_PUBLIC_VERCEL_URL"]) || 'localhost:3000';
export const gatewayAddress = process.env["NEXT_PUBLIC_GATEWAY_ADDRESS"] ?? "localhost:3001";
export const serverRegion = "unknown";
export const gitSHA =
  process.env["NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA"] || "Unavailable";
export const serverVersion = "2022.822.1";
export const appVersion = "v0.1 (2022.822.1)";

export const messagesPerBonscore = 50