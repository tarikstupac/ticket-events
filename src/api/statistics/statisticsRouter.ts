import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { StatusCodes } from "http-status-codes";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { statisticsController } from "@/api/statistics/statisticsController";
import { DailyStatisticsResultSchema, GetDailyStatisticsSchema } from "@/api/statistics/statisticsModel";
import { validateRequest } from "@/common/utils/httpHandlers";

export const statisticsRegistry = new OpenAPIRegistry();
export const statisticsRouter: Router = express.Router();

statisticsRegistry.register("Statistics", DailyStatisticsResultSchema);
statisticsRegistry.register("GetStatistics", GetDailyStatisticsSchema);

statisticsRegistry.registerPath({
  method: "get",
  path: "/statistics",
  tags: ["Statistics"],
  summary: "Get ticket statistics",
  request: {
    query: GetDailyStatisticsSchema.shape.query,
  },
  responses: createApiResponse(DailyStatisticsResultSchema, "Success", StatusCodes.OK),
});

statisticsRouter.get("/", validateRequest(GetDailyStatisticsSchema), statisticsController.getDailyStatistics);
