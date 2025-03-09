import { type ITicket, Ticket, type TicketPayment } from "@/api/tickets/ticketsModel";

export class TicketRepository {
  async findById(id: string): Promise<ITicket | null> {
    return Ticket.findOne({ ticketId: id });
  }

  async insert(ticket: TicketPayment): Promise<ITicket> {
    return Ticket.create(ticket);
  }
}
