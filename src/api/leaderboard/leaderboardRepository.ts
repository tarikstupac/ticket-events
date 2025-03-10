import { redisClient } from "@/redis";

export class LeaderboardRepository {
  async update(ticketId: string, score: number): Promise<void> {
    await redisClient;
    await redisClient.zAdd("leaderboard", [{ score: Number.parseFloat(score.toFixed(5)), value: ticketId }]);
  }
  async getTop100(): Promise<{ score: number; value: string }[]> {
    await redisClient;
    return redisClient.zRangeWithScores("leaderboard", 0, 99, { REV: true });
  }
}
