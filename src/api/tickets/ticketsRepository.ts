import { type ITicket, Ticket, type TicketPayment, type TicketPayout } from "@/api/tickets/ticketsModel";

export class TicketRepository {
  async findById(id: string): Promise<ITicket | null> {
    return Ticket.findOne({ ticketId: id });
  }

  async insert(ticket: TicketPayment): Promise<ITicket> {
    return Ticket.create(ticket);
  }
  async update(ticket: TicketPayout): Promise<ITicket | null> {
    return Ticket.findOneAndUpdate(
      { ticketId: ticket.ticketId },
      {
        $inc: { payoutAmount: ticket.payoutAmount },
        isClosed: ticket.isClosed,
      },
      { new: true },
    );
  }
}
