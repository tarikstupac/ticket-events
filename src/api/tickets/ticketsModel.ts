import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { type Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

extendZodWithOpenApi(z);

// Payment schema
export type TicketPayment = z.infer<typeof TicketPaymentSchema>;
export const TicketPaymentSchema = z.object({
  ticketId: z.string({ required_error: "ticketId is required" }).uuid("ticketId must be a valid uuid v4"),
  playerUsername: z
    .string({ required_error: "playerUsername is required" })
    .uuid("playerUsername must be a valid uuid v4"),
  paymentAmount: z
    .number({
      required_error: "paymentAmount is required",
      invalid_type_error: "paymentAmount must be a number",
    })
    .min(0.01, "paymentAmount must be greater than 0.00")
    .multipleOf(0.01, "paymentAmount must contain 2 decimal places at most")
    .finite(),
});
export const CreatePaymentSchema = z.object({
  body: TicketPaymentSchema,
});

// Payout schema
export type TicketPayout = z.infer<typeof TicketPayoutSchema>;
export const TicketPayoutSchema = z.object({
  ticketId: z.string({ required_error: "ticketId is required" }).uuid("ticketId must be a valid uuid v4"),
  payoutAmount: z
    .number({
      required_error: "payoutAmount is required",
      invalid_type_error: "payoutAmount must be a number",
    })
    .min(0.01, "payoutAmount must be greater than 0.00")
    .multipleOf(0.01, "paymentAmount must contain 2 decimal places at most")
    .finite(),
  isClosed: z.boolean({
    required_error: "isClosed is required",
    invalid_type_error: "isClosed must be a boolean",
  }),
});
export const UpdatePayoutSchema = z.object({
  body: TicketPayoutSchema,
});

// Ticket schema
export const TicketSchema = z.object({
  ticketId: z.string().uuid(),
  playerUsername: z.string().uuid(),
  paymentAmount: z.number(),
  payoutAmount: z.number().optional(),
  isClosed: z.boolean(),
});
export type TicketResponse = z.infer<typeof TicketSchema>;
export interface ITicket extends Document {
  ticketId: string;
  playerUsername: string;
  paymentAmount: number;
  payoutAmount?: number;
  isClosed: boolean;
}

// Ticket model
const schema: Schema = new Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      default: uuidv4,
      validate: {
        validator: (v: string) =>
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v),
        message: (props: any) => `${props.value} is not a valid UUID`,
      },
    },
    playerUsername: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) =>
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v),
        message: (props: any) => `${props.value} is not a valid UUID`,
      },
    },
    paymentAmount: {
      type: Number,
      required: true,
      set: (v: number) => Number.parseFloat(v.toFixed(2)),
      min: 0.01,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
        message: (props: any) => `${props.value} is not a valid amount`,
      },
    },
    payoutAmount: {
      type: Number,
      min: 0.01,
      set: (v: number) => Number.parseFloat(v.toFixed(2)),
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
        message: (props: any) => `${props.value} is not a valid amount`,
      },
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Ticket = model<ITicket>("Ticket", schema);
