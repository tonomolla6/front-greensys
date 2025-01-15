import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Client, ClientSchema } from "@/types/clients";

const API_URL = "/api/clients";

export const useClients = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["clients", filters],
    queryFn: async () => {
      const { data } = await axios.get(API_URL, { params: filters });
      return data.map((client: any) => ClientSchema.parse(client));
    },
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/${id}`);
      return ClientSchema.parse(data);
    },
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClient: Omit<Client, "id">) => {
      const { data } = await axios.post(API_URL, newClient);
      return ClientSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data } = await axios.patch(`${API_URL}/${id}`, updates);
      return ClientSchema.parse(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", data.id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.removeQueries({ queryKey: ["client", id] });
    },
  });
};
