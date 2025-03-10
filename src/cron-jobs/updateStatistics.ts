import { Statistics } from "@/api/statistics/statisticsModel";
import { Ticket } from "@/api/tickets/ticketsModel";
import { logger } from "@/server";

export const updateStatistics = async () => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentHour = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));

  try {
    const tickets = await Ticket.find({
      createdAt: {
        $gte: new Date(now.setHours(0, 0, 0, 0)),
        $lt: currentHour,
      },
    });

    const statsMap = new Map();
    tickets.forEach((ticket) => {
      const key = `${date}-${ticket.playerUsername}`;
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          date: currentHour,
          playerUsername: ticket.playerUsername,
          numberOfTickets: 0,
          totalPaymentAmount: 0,
          totalPayoutAmount: 0,
        });
      }

      const stats = statsMap.get(key);
      stats.numberOfTickets += 1;
      stats.totalPaymentAmount += ticket.paymentAmount;
      stats.totalPayoutAmount += ticket.payoutAmount || 0;
    });
    for (const stats of statsMap.values()) {
      if (stats.numberOfTickets === 0) {
        continue;
      }
      await Statistics.findOneAndUpdate({ date: stats.date, playerUsername: stats.playerUsername }, stats, {
        upsert: true,
      });
      statsMap.clear();
    }
  } catch (error) {
    logger.error("Failed to update statistics:", error);
  }
};
