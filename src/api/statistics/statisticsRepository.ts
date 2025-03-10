import { type IStatisticsWithTotal, Statistics } from "@/api/statistics/statisticsModel";
import type { PipelineStage } from "mongoose";

export class StatisticsRepository {
  async findAggregateStatisticsWithLimitSkip(
    query: Record<string, any>,
    limit: number,
    skip: number,
  ): Promise<IStatisticsWithTotal | null> {
    const aggregationPipeline: PipelineStage[] = [
      { $match: query },
      {
        $group: {
          _id: "$date",
          numberOfTickets: { $sum: "$numberOfTickets" },
          totalPaymentAmount: { $sum: "$totalPaymentAmount" },
          totalPayoutAmount: { $sum: "$totalPayoutAmount" },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const statistics = await Statistics.aggregate(aggregationPipeline);
    const total = (await Statistics.aggregate([{ $match: query }, { $group: { _id: "$date" } }])).length;
    return { statistics, total };
  }
  async findStatisticsByPlayerWithLimitSkip(
    query: Record<string, any>,
    limit: number,
    skip: number,
  ): Promise<IStatisticsWithTotal | null> {
    const statistics = await Statistics.find(query).skip(skip).limit(limit);
    const total = await Statistics.countDocuments(query);
    return { statistics, total };
  }
}
