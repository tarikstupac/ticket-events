import type { Request, RequestHandler, Response } from "express";

import type { TicketPayment, TicketPayout } from "@/api/tickets/ticketsModel";
import { ticketService } from "@/api/tickets/ticketsService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class TicketController {
  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    const ticket: TicketPayment = req.body;
    const response = await ticketService.createPayment(ticket);
    handleServiceResponse(response, res);
  };
  public updatePayout: RequestHandler = async (req: Request, res: Response) => {
    const ticket: TicketPayout = req.body;
    const response = await ticketService.updatePayout(ticket);
    handleServiceResponse(response, res);
  };
}

export const ticketController = new TicketController();
