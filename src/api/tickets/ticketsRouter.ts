import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { StatusCodes } from "http-status-codes";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { ticketController } from "@/api/tickets/ticketsController";
import {
  CreatePaymentSchema,
  TicketPaymentSchema,
  TicketPayoutSchema,
  TicketSchema,
  UpdatePayoutSchema,
} from "@/api/tickets/ticketsModel";
import { validateRequest } from "@/common/utils/httpHandlers";

export const ticketRegistry = new OpenAPIRegistry();
export const ticketRouter: Router = express.Router();

ticketRegistry.register("TicketCreate", TicketPaymentSchema);
ticketRegistry.register("Ticket", TicketSchema);
ticketRegistry.register("TicketUpdate", TicketPayoutSchema);

ticketRegistry.registerPath({
  method: "post",
  path: "/tickets",
  tags: ["Tickets"],
  summary: "Create a new ticket, used for payments",
  request: {
    body: {
      content: {
        "application/json": { schema: TicketPaymentSchema },
      },
    },
  },
  responses: createApiResponse(TicketSchema, "Created", StatusCodes.CREATED),
});

ticketRegistry.registerPath({
  method: "put",
  path: "/tickets",
  tags: ["Tickets"],
  summary: "Update a ticket, used for payouts",
  request: {
    body: {
      content: {
        "application/json": { schema: TicketPayoutSchema },
      },
    },
  },
  responses: createApiResponse(TicketSchema, "Updated", StatusCodes.OK),
});

ticketRouter.post("/", validateRequest(CreatePaymentSchema), ticketController.createPayment);

ticketRouter.put("/", validateRequest(UpdatePayoutSchema), ticketController.updatePayout);
