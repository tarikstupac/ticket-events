import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { StatusCodes } from "http-status-codes";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { leaderboardController } from "@/api/leaderboard/leaderboardController";
import { leaderboardResponseSchema } from "@/api/leaderboard/leaderboardModel";

export const leaderboardRegistry = new OpenAPIRegistry();
export const leaderboardRouter: Router = express.Router();

leaderboardRegistry.register("Leaderboard", leaderboardResponseSchema);

leaderboardRegistry.registerPath({
  method: "get",
  path: "/leaderboard",
  tags: ["Leaderboard"],
  summary: "Get leaderboard",
  responses: createApiResponse(leaderboardResponseSchema, "Success"),
});

leaderboardRouter.get("/", leaderboardController.getLeaderboard);
