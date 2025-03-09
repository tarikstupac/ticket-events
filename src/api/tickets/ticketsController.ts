import type { Request, RequestHandler, Response } from "express";

import { ticketService } from "@/api/tickets/ticketsService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { TicketPayment } from "./ticketsModel";

class TicketController {
  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    const ticket: TicketPayment = req.body;
    const response = await ticketService.createPayment(ticket);
    handleServiceResponse(response, res);
  };
}

export const ticketController = new TicketController();
