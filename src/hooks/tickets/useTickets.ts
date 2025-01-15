import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Ticket,
  TicketComment,
  TicketSchema,
  TicketCommentSchema,
} from "@/types/tickets";

const API_URL = "/api/tickets";

export const useTickets = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: filters });
      return data.map((ticket: any) => TicketSchema.parse(ticket));
    },
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return TicketSchema.parse(data);
    },
  });
};

export const useTicketComments = (ticketId: string) => {
  return useQuery({
    queryKey: ["ticket-comments", ticketId],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${ticketId}/comments`);
      return data.map((comment: any) => TicketCommentSchema.parse(comment));
    },
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTicket: Omit<Ticket, "id">) => {
      const { data } = await axios.post(API_URL, newTicket);
      return TicketSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ticket> & { id: string }) => {
      const { data } = await axios.patch(`${API_URL}/${id}`, updates);
      return TicketSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", data.id] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ticketId,
      comment,
    }: {
      ticketId: string;
      comment: Omit<TicketComment, "id" | "ticketId" | "createdAt">;
    }) => {
      const { data } = await axios.post(
        `${API_URL}/${ticketId}/comments`,
        comment
      );
      return TicketCommentSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["ticket-comments", data.ticketId],
      });
    },
  });
};

export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: async ({
      ticketId,
      file,
    }: {
      ticketId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(
        `${API_URL}/${ticketId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
  });
};
