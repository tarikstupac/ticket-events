import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const leaderboardSchema = z.object({
  ticketId: z.string(),
  paymentPayoutRatio: z.number(),
});
export type Leaderboard = z.infer<typeof leaderboardSchema>;

export const leaderboardResponseSchema = z.array(leaderboardSchema);
