import { leaderboardService } from "@/api/leaderboard/leaderboardService";
import { Ticket } from "@/api/tickets/ticketsModel";

export const ticketChangeStream = Ticket.watch();

ticketChangeStream.on("change", async (change: any) => {
  if (change.operationType === "update" && change.updateDescription.updatedFields.isClosed) {
    const documentId = change.documentKey._id.toString();
    await leaderboardService.updateLeaderboard(documentId);
  }
});
