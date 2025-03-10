import { StatusCodes } from "http-status-codes";

import {
  type DailyStatisticsQueryParams,
  DailyStatisticsResultSchema,
  type IStatisticsWithTotal,
} from "@/api/statistics/statisticsModel";
import { StatisticsRepository } from "@/api/statistics/statisticsRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class StatisticsService {
  private statisticsRepository: StatisticsRepository;

  constructor(statisticsRepository: StatisticsRepository = new StatisticsRepository()) {
    this.statisticsRepository = statisticsRepository;
  }

  async getDailyStatistics(params: DailyStatisticsQueryParams) {
    try {
      const { page, size, playerUsername, date, timezoneOffset = "0" } = params;

      const limit = Number.parseInt(size);
      const skip = (Number.parseInt(page) - 1) * limit;

      const query: any = {};

      if (date) {
        const [month, day, year] = date.split("-");
        const parsedDate = new Date(Date.UTC(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day)));
        const startDate = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate(), 0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const adjustedStartDate = new Date(startDate.getTime() + Number.parseInt(timezoneOffset) * 60 * 60 * 1000);
        const adjustedEndDate = new Date(endDate.getTime() + Number.parseInt(timezoneOffset) * 60 * 60 * 1000);
        query.date = {
          $gte: adjustedStartDate,
          $lt: adjustedEndDate,
        };
      }
      let queryResult: IStatisticsWithTotal | null;
      let statistics: any;
      if (playerUsername) {
        query.playerUsername = playerUsername;
        queryResult = await this.statisticsRepository.findStatisticsByPlayerWithLimitSkip(query, limit, skip);
        statistics = queryResult?.statistics.map((stat) => {
          return {
            totalPaymentAmount: stat.totalPaymentAmount,
            totalPayoutAmount: stat.totalPayoutAmount,
            numberOfTickets: stat.numberOfTickets,
            date: stat.date,
          };
        });
      } else {
        queryResult = await this.statisticsRepository.findAggregateStatisticsWithLimitSkip(query, limit, skip);
        statistics = queryResult?.statistics.map((stat) => {
          return {
            totalPaymentAmount: stat.totalPaymentAmount,
            totalPayoutAmount: stat.totalPayoutAmount,
            numberOfTickets: stat.numberOfTickets,
            date: stat._id,
          };
        });
      }
      if (!queryResult) {
        return ServiceResponse.failure("No statistics found.", null, StatusCodes.NOT_FOUND);
      }
      const result = DailyStatisticsResultSchema.parse({
        page: Number.parseInt(page),
        size: Number.parseInt(size),
        total: queryResult.total,
        statistics,
      });
      return ServiceResponse.success("Statistics retrieved.", result);
    } catch (ex) {
      const errorMessage = `Error getting statistics: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting statistics.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
export const statisticsService = new StatisticsService();
