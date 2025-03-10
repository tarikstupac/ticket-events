import { StatusCodes } from "http-status-codes";

import { type Leaderboard, leaderboardResponseSchema } from "@/api/leaderboard/leaderboardModel";
import { LeaderboardRepository } from "@/api/leaderboard/leaderboardRepository";
import { TicketRepository } from "@/api/tickets/ticketsRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class LeaderboardService {
  private leaderboardRepository: LeaderboardRepository;
  private ticketRepository: TicketRepository;

  constructor(
    leaderboardRepository: LeaderboardRepository = new LeaderboardRepository(),
    ticketRepository: TicketRepository = new TicketRepository(),
  ) {
    this.leaderboardRepository = leaderboardRepository;
    this.ticketRepository = ticketRepository;
  }

  async getLeaderboard() {
    try {
      const topScores = await this.leaderboardRepository.getTop100();
      const result = topScores.map((topScore) => {
        return {
          paymentPayoutRatio: topScore.score,
          ticketId: topScore.value,
        } as Leaderboard;
      });
      return ServiceResponse.success("Leaderboard retrieved.", leaderboardResponseSchema.parse(result));
    } catch (ex) {
      const errorMessage = `Error getting leaderboard: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting leaderboard.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async updateLeaderboard(documentId: string) {
    try {
      const ticket = await this.ticketRepository.findByDocumentId(documentId);
      if (!ticket) {
        return ServiceResponse.failure("Ticket not found.", null, StatusCodes.NOT_FOUND);
      }
      if (ticket.payoutAmount) {
        const score = ticket.payoutAmount / ticket.paymentAmount;
        await this.leaderboardRepository.update(ticket.ticketId, score);
        return ServiceResponse.success("Leaderboard updated.", null);
      }
    } catch (ex) {
      const errorMessage = `Error updating leaderboard: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating leaderboard.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
export const leaderboardService = new LeaderboardService();
