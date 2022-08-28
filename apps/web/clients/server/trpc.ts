import type { AppRouter } from "../../../gateway/src/clients/trpc";
import { createTRPCClient } from "@trpc/client";

export const client = createTRPCClient<AppRouter>({
  url: 'http://localhost:3001/trpc',
});
