import type { Request, RequestHandler, Response } from "express";

import { leaderboardService } from "@/api/leaderboard/leaderboardService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class LeaderboardController {
  public getLeaderboard: RequestHandler = async (req: Request, res: Response) => {
    const response = await leaderboardService.getLeaderboard();
    handleServiceResponse(response, res);
  };
}

export const leaderboardController = new LeaderboardController();
