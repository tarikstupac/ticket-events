import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ticketController } from "@/api/tickets/ticketsController";
import { CreatePaymentSchema, TicketPaymentSchema, TicketSchema } from "@/api/tickets/ticketsModel";
import { validateRequest } from "@/common/utils/httpHandlers";

export const ticketRegistry = new OpenAPIRegistry();
export const ticketRouter: Router = express.Router();

ticketRegistry.register("TicketCreate", TicketPaymentSchema);
ticketRegistry.register("Ticket", TicketSchema);

ticketRegistry.registerPath({
  method: "post",
  path: "/tickets",
  tags: ["Tickets"],
  summary: "Create a new ticket",
  request: {
    body: {
      content: {
        "application/json": { schema: TicketPaymentSchema },
      },
    },
  },
  responses: createApiResponse(TicketSchema, "Success"),
});

ticketRouter.post("/", validateRequest(CreatePaymentSchema), ticketController.createPayment);
