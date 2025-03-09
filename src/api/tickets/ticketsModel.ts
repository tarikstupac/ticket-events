import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { type Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

extendZodWithOpenApi(z);

export type TicketPayment = z.infer<typeof TicketPaymentSchema>;
export const TicketPaymentSchema = z.object({
  ticketId: z.string().uuid(),
  playerUsername: z.string().uuid(),
  paymentAmount: z
    .number()
    .refine((val) => val > 0.0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Invalid amount format",
    }),
});

export type TicketPayout = z.infer<typeof TicketPayoutSchema>;
export const TicketPayoutSchema = z.object({
  ticketId: z.string().uuid(),
  payoutAmount: z
    .number()
    .refine((val) => val > 0.0, {
      message: "Amount must be greater than 0",
    })
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "Invalid amount format",
    }),
  isClosed: z.boolean(),
});

interface ITicket extends Document {
  ticketId: string;
  playerUsername: string;
  paymentAmount: number;
  payoutAmount?: number;
  isClosed: boolean;
}

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
      min: 0,
      validate: {
        validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
        message: (props: any) => `${props.value} is not a valid amount`,
      },
    },
    payoutAmount: {
      type: Number,
      min: 0,
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
