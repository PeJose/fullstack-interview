import { z } from "zod";

export const CreateMembershipSchema = z
  .object({
    name: z
      .string({ message: "missingMandatoryFields" })
      .min(1, "missingMandatoryFields"),
    recurringPrice: z
      .number({ message: "missingMandatoryFields" })
      .min(0, "negativeRecurringPrice"),
    paymentMethod: z.string().nullable(),
    billingInterval: z.enum(["monthly", "yearly", "weekly"], {
      message: "invalidBillingPeriods",
    }),
    billingPeriods: z.number(),
    validFrom: z.string().nullish(),
  })
  .superRefine((data, ctx) => {
    if (data.recurringPrice < 100 && data.paymentMethod === "cash") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "cashPriceBelow100",
        path: ["recurringPrice"],
      });
    }

    if (data.billingInterval === "monthly") {
      if (data.billingPeriods > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "billingPeriodsMoreThan12Months",
          path: ["billingPeriods"],
        });
      }
      if (data.billingPeriods < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "billingPeriodsLessThan6Months",
          path: ["billingPeriods"],
        });
      }
    } else if (data.billingInterval === "yearly") {
      if (data.billingPeriods > 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "billingPeriodsMoreThan10Years",
          path: ["billingPeriods"],
        });
      }
      if (data.billingPeriods < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "billingPeriodsLessThan3Years",
          path: ["billingPeriods"],
        });
      }
    }
  });
