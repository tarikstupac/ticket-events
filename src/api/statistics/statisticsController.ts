import type { Request, RequestHandler, Response } from "express";

import type { DailyStatisticsQueryParams } from "@/api/statistics/statisticsModel";
import { statisticsService } from "@/api/statistics/statisticsService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class StatisticsController {
  public getDailyStatistics: RequestHandler = async (req: Request, res: Response) => {
    const queryParams: DailyStatisticsQueryParams = req.query as unknown as DailyStatisticsQueryParams;
    const response = await statisticsService.getDailyStatistics(queryParams);
    handleServiceResponse(response, res);
  };
}

export const statisticsController = new StatisticsController();
