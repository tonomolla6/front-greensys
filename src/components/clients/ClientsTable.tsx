import { useState } from "react";
import { useClients, useDeleteClient } from "@/hooks/clients/useClients";
import { Client } from "@/types/clients";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/common/Table";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { SearchInput } from "@/components/common/SearchInput";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toast } from "react-hot-toast";

const statusColors = {
  active: "success",
  inactive: "error",
  pending: "warning",
} as const;

export const ClientsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients, isLoading } = useClients({
    page,
    search,
    status: status.join(","),
  });

  const deleteClient = useDeleteClient();

  const handleDelete = async (client: Client) => {
    try {
      await deleteClient.mutateAsync(client.id);
      toast.success("Cliente eliminado correctamente");
      setSelectedClient(null);
    } catch (error) {
      toast.error("Error al eliminar el cliente");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar clientes..."
          />
          <FilterDropdown
            options={["active", "inactive", "pending"]}
            value={status}
            onChange={setStatus}
            placeholder="Filtrar por estado"
          />
        </div>
        <Button variant="primary" href="/clients/new">
          Nuevo Cliente
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Empresa</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha de Registro</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients?.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                </div>
              </TableCell>
              <TableCell>{client.company}</TableCell>
              <TableCell>
                <Badge color={statusColors[client.status]}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(client.createdAt), "PP", { locale: es })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    href={`/clients/${client.id}`}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    href={`/clients/${client.id}/edit`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClient(client)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        page={page}
        onPageChange={setPage}
        total={100}
        perPage={10}
      />

      <ConfirmDialog
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        onConfirm={() => selectedClient && handleDelete(selectedClient)}
        title="Eliminar Cliente"
        description={`¿Estás seguro de que quieres eliminar a ${selectedClient?.name}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};
