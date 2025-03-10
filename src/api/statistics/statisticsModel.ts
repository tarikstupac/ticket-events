import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { type Document, Schema, model } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export interface IStatistics extends Document {
  date: string;
  playerUsername: string;
  numberOfTickets: number;
  totalPaymentAmount: number;
  totalPayoutAmount: number;
}

export interface IStatisticsWithTotal {
  statistics: IStatistics[];
  total: number;
}
export const DailyStatisticsResultSchema = z.object({
  statistics: z.array(
    z.object({
      date: z.date(),
      numberOfTickets: z.number(),
      totalPaymentAmount: z.number(),
      totalPayoutAmount: z.number(),
    }),
  ),
  total: z.number(),
  page: z.number(),
  size: z.number(),
});

export type DailyStatisticsQueryParams = z.infer<typeof GetDailyStatisticsSchema.shape.query>;
export const GetDailyStatisticsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .default("1")
      .refine(
        (page) => {
          return !Number.isNaN(Number.parseInt(page));
        },
        {
          message: "Page must be a number",
        },
      ),
    size: z
      .string()
      .default("10")
      .refine(
        (size) => {
          return !Number.isNaN(Number.parseInt(size));
        },
        {
          message: "Size must be a number",
        },
      ),
    playerUsername: z.string().uuid().optional(),
    date: z
      .string()
      .optional()
      .refine(
        (date) => {
          if (!date) return true;
          const regex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{4}$/;
          return regex.test(date);
        },
        {
          message: "Date must be in 'MM-DD-YYYY' format",
        },
      ),
    timezoneOffset: z
      .string()
      .default("0")
      .refine(
        (timezoneOffset) => {
          return !Number.isNaN(Number.parseInt(timezoneOffset));
        },
        {
          message: "Timezone offset must be a number",
        },
      ),
  }),
});

const schema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
    validate: {
      validator: (value: any) => {
        // Check if it's a valid date
        return !Number.isNaN(value) && value instanceof Date;
      },
      message: (props: any) => `${props.value} is not a valid UTC date!`,
    },
  },
  playerUsername: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v),
      message: (props: any) => `${props.value} is not a valid UUID`,
    },
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPaymentAmount: {
    type: Number,
    required: true,
    set: (v: number) => Number.parseFloat(v.toFixed(2)),
    min: 0.01,
    validate: {
      validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
      message: (props: any) => `${props.value} is not a valid amount`,
    },
  },
  totalPayoutAmount: {
    type: Number,
    required: true,
    set: (v: number) => Number.parseFloat(v.toFixed(2)),
    min: 0.01,
    validate: {
      validator: (v: number) => /^\d+(\.\d{1,2})?$/.test(v.toString()),
      message: (props: any) => `${props.value} is not a valid amount`,
    },
  },
});

export const Statistics = model<IStatistics>("Statistics", schema);
