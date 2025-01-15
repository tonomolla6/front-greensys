import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string(),
  status: z.enum(["active", "inactive", "pending"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()),
  billingInfo: z.object({
    address: z.string(),
    taxId: z.string(),
    paymentMethod: z.enum(["credit_card", "bank_transfer", "paypal"]),
  }),
});

export type Client = z.infer<typeof ClientSchema>;
