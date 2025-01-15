import { useState } from "react";
import { useTickets } from "@/hooks/tickets/useTickets";
import { Ticket, TicketPriority, TicketStatus } from "@/types/tickets";
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
import { useAuth } from "@/hooks/auth/useAuth";

const priorityColors: Record<TicketPriority, string> = {
  low: "info",
  medium: "warning",
  high: "error",
  urgent: "error",
};

const statusColors: Record<TicketStatus, string> = {
  open: "info",
  in_progress: "warning",
  waiting_client: "warning",
  resolved: "success",
  closed: "default",
};

export const TicketsTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [priority, setPriority] = useState<string[]>([]);
  const { hasPermission } = useAuth();

  const { data: tickets, isLoading } = useTickets({
    page,
    search,
    status: status.join(","),
    priority: priority.join(","),
  });

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
            placeholder="Buscar tickets..."
          />
          <FilterDropdown
            options={[
              "open",
              "in_progress",
              "waiting_client",
              "resolved",
              "closed",
            ]}
            value={status}
            onChange={setStatus}
            placeholder="Filtrar por estado"
          />
          <FilterDropdown
            options={["low", "medium", "high", "urgent"]}
            value={priority}
            onChange={setPriority}
            placeholder="Filtrar por prioridad"
          />
        </div>
        {hasPermission("create:tickets") && (
          <Button variant="primary" href="/tickets/new">
            Nuevo Ticket
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Asignado a</TableCell>
            <TableCell>Última actualización</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>#{ticket.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{ticket.title}</div>
                  <div className="text-sm text-gray-500">
                    {ticket.category} - {ticket.tags.join(", ")}
                  </div>
                </div>
              </TableCell>
              <TableCell>{ticket.clientId}</TableCell>
              <TableCell>
                <Badge color={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge color={priorityColors[ticket.priority]}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>{ticket.assignedTo || "Sin asignar"}</TableCell>
              <TableCell>
                {format(new Date(ticket.updatedAt), "Pp", { locale: es })}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    href={`/tickets/${ticket.id}`}
                  >
                    Ver
                  </Button>
                  {hasPermission("update:tickets") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      href={`/tickets/${ticket.id}/edit`}
                    >
                      Editar
                    </Button>
                  )}
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
    </div>
  );
};
