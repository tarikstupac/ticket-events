import { StatusCodes } from "http-status-codes";

import { type TicketPayment, type TicketPayout, type TicketResponse, TicketSchema } from "@/api/tickets/ticketsModel";
import { TicketRepository } from "@/api/tickets/ticketsRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor(ticketRepository: TicketRepository = new TicketRepository()) {
    this.ticketRepository = ticketRepository;
  }

  async createPayment(ticket: TicketPayment): Promise<ServiceResponse<TicketResponse | null>> {
    try {
      const exists = await this.ticketRepository.findById(ticket.ticketId);
      if (exists) {
        return ServiceResponse.failure("Ticket already exists", null, StatusCodes.BAD_REQUEST);
      }
      const newTicket = await this.ticketRepository.insert(ticket);
      return ServiceResponse.success<TicketResponse>("Ticket created", TicketSchema.parse(newTicket));
    } catch (ex) {
      const errorMessage = `Error creating a ticket: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating a ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePayout(ticket: TicketPayout): Promise<ServiceResponse<TicketResponse | null>> {
    try {
      const exists = await this.ticketRepository.findById(ticket.ticketId);
      if (!exists) {
        return ServiceResponse.failure("Ticket not found", null, StatusCodes.NOT_FOUND);
      }
      if (exists.isClosed) {
        return ServiceResponse.failure("Ticket is already closed", null, StatusCodes.BAD_REQUEST);
      }

      const updatedTicket = await this.ticketRepository.update(ticket);
      if (!updatedTicket) {
        return ServiceResponse.failure("Error updating a ticket", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }
      return ServiceResponse.success<TicketResponse>("Ticket updated", TicketSchema.parse(updatedTicket));
    } catch (ex) {
      const errorMessage = `Error updating a ticket: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating a ticket.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const ticketService = new TicketService();
