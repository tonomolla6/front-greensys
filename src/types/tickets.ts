import { z } from "zod";

export const TicketPriorityEnum = z.enum(["low", "medium", "high", "urgent"]);
export const TicketStatusEnum = z.enum([
  "open",
  "in_progress",
  "waiting_client",
  "resolved",
  "closed",
]);
export const TicketCategoryEnum = z.enum([
  "technical",
  "billing",
  "feature_request",
  "bug",
  "other",
]);

export const TicketSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  clientId: z.string(),
  assignedTo: z.string().optional(),
  priority: TicketPriorityEnum,
  status: TicketStatusEnum,
  category: TicketCategoryEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()),
  attachments: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z.string(),
      size: z.number(),
    })
  ),
});

export const TicketCommentSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.string().datetime(),
  attachments: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      type: z.string(),
      size: z.number(),
    })
  ),
  isInternal: z.boolean(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketComment = z.infer<typeof TicketCommentSchema>;
export type TicketPriority = z.infer<typeof TicketPriorityEnum>;
export type TicketStatus = z.infer<typeof TicketStatusEnum>;
export type TicketCategory = z.infer<typeof TicketCategoryEnum>;
