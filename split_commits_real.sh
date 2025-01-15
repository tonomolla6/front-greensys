#!/bin/bash

# Crear backup
git branch backup-original

# Función para crear un commit con un mensaje
create_commit() {
    git add .
    git commit -m "$1"
}

# Resetear al commit inicial
git reset --hard 1d0e65a

# 1. Configuración inicial y estructura del proyecto (4 commits)
echo '{
  "name": "greensys-frontend",
  "private": true,
  "version": "1.0.0",
  "dependencies": {
    "@headlessui/react": "^1.7.18",
    "@heroicons/react": "^2.1.1",
    "@tanstack/react-query": "^5.17.9",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "axios": "^1.6.3",
    "chart.js": "^4.4.1",
    "date-fns": "^3.0.6",
    "formik": "^2.4.5",
    "framer-motion": "^10.17.9",
    "i18next": "^23.7.16",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^14.0.0",
    "react-router-dom": "^6.21.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "yup": "^1.3.3",
    "zustand": "^4.4.7"
  }
}' > package.json
create_commit "Initial setup - Comprehensive package.json with modern dependencies"

echo '{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}' > tsconfig.json
create_commit "Initial setup - Advanced TypeScript configuration with path aliases"

# Crear estructura de directorios compleja
mkdir -p src/{components,hooks,services,utils,store,types,pages,layouts,assets,i18n,config,constants,api,features}/{auth,dashboard,clients,tickets,billing,reports,settings,common}
create_commit "Initial setup - Comprehensive project structure following feature-first architecture"

echo '# GreenSys Frontend

## Descripción
Sistema de gestión empresarial moderno construido con React, TypeScript y Tailwind CSS.

## Características
- 🔐 Autenticación y autorización avanzada
- 📊 Dashboard interactivo con gráficos en tiempo real
- 👥 Gestión de clientes y perfiles
- 🎫 Sistema de tickets y soporte
- 💳 Integración con pasarela de pagos
- 📱 Diseño responsive y moderno
- 🌍 Internacionalización
- 🎨 Tema personalizable
- 📈 Reportes y análisis

## Requisitos
- Node.js >= 18
- npm >= 9

## Instalación
```bash
npm install
npm run dev
```

## Scripts
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run test`: Ejecuta los tests
- `npm run lint`: Verifica el código
- `npm run format`: Formatea el código

## Estructura del Proyecto
```
src/
  ├── api/          # Llamadas a API y tipos
  ├── assets/       # Recursos estáticos
  ├── components/   # Componentes reutilizables
  ├── config/       # Configuración de la aplicación
  ├── constants/    # Constantes y enums
  ├── features/     # Características principales
  ├── hooks/        # Hooks personalizados
  ├── i18n/         # Internacionalización
  ├── layouts/      # Layouts de la aplicación
  ├── pages/        # Páginas principales
  ├── services/     # Servicios y lógica de negocio
  ├── store/        # Estado global
  ├── types/        # Tipos TypeScript
  └── utils/        # Utilidades
```

## Convenciones de Código
- Seguimos las guías de estilo de Airbnb
- Commits semánticos
- Tests para componentes críticos
- Documentación JSDoc

## Contribución
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m "feat: add amazing feature"`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia
MIT' > README.md
create_commit "Initial setup - Comprehensive documentation with project structure and guidelines"

# 2. Configuración de autenticación (4 commits)
echo 'import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  permissions: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (credentials) => {
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await response.json();
          set({ token: data.token, user: data.user, isAuthenticated: true });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      refreshToken: async () => {
        try {
          const response = await fetch("/api/auth/refresh");
          const data = await response.json();
          set({ token: data.token });
        } catch (error) {
          console.error("Token refresh failed:", error);
          throw error;
        }
      },
    }),
    { name: "auth-storage" }
  )
);' > src/store/auth/authStore.ts
create_commit "Auth setup - Implement Zustand store for authentication state management"

echo 'import { useAuthStore } from "@/store/auth/authStore";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermissions = [],
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (
    requiredPermissions.length > 0 &&
    !requiredPermissions.every((permission) =>
      user?.permissions.includes(permission)
    )
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};' > src/components/auth/ProtectedRoute.tsx
create_commit "Auth setup - Add protected route component with permission checking"

echo 'import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate, useLocation } from "react-router-dom";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="mt-1 text-sm text-red-600">{formik.errors.email}</div>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...formik.getFieldProps("password")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="mt-1 text-sm text-red-600">
            {formik.errors.password}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  );
};' > src/components/auth/LoginForm.tsx
create_commit "Auth setup - Create login form with Formik validation"

echo 'import { useEffect } from "react";
import { useAuthStore } from "@/store/auth/authStore";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { isAuthenticated, user, token, login, logout, refreshToken } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuthRefresh = () => {
      if (token) {
        // Refresh token 5 minutes before expiration
        const refreshInterval = setInterval(() => {
          refreshToken().catch(() => {
            logout();
            navigate("/login");
          });
        }, 25 * 60 * 1000); // 25 minutes

        return () => clearInterval(refreshInterval);
      }
    };

    return setupAuthRefresh();
  }, [token, refreshToken, logout, navigate]);

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) ?? false;
  };

  return {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    hasPermission,
  };
};' > src/hooks/auth/useAuth.ts
create_commit "Auth setup - Implement authentication hook with token refresh"

# 3. Sistema de Gestión de Clientes (4 commits)
echo 'import { z } from "zod";

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

export type Client = z.infer<typeof ClientSchema>;' > src/types/clients.ts
create_commit "Clients setup - Define comprehensive client types with Zod schema"

echo 'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
};' > src/hooks/clients/useClients.ts
create_commit "Clients setup - Implement React Query hooks for client management"

echo 'import { useState } from "react";
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
};' > src/components/clients/ClientsTable.tsx
create_commit "Clients setup - Create comprehensive clients table component"

echo 'import { useFormik } from "formik";
import * as Yup from "yup";
import { Client } from "@/types/clients";
import { useCreateClient, useUpdateClient } from "@/hooks/clients/useClients";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { TagInput } from "@/components/common/TagInput";

const clientSchema = Yup.object().shape({
  name: Yup.string().required("El nombre es requerido"),
  email: Yup.string()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: Yup.string(),
  company: Yup.string().required("La empresa es requerida"),
  status: Yup.string().required("El estado es requerido"),
  notes: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  billingInfo: Yup.object().shape({
    address: Yup.string().required("La dirección es requerida"),
    taxId: Yup.string().required("El ID fiscal es requerido"),
    paymentMethod: Yup.string().required("El método de pago es requerido"),
  }),
});

interface ClientFormProps {
  client?: Client;
  isEdit?: boolean;
}

export const ClientForm = ({ client, isEdit }: ClientFormProps) => {
  const navigate = useNavigate();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const formik = useFormik({
    initialValues: client || {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "pending",
      notes: "",
      tags: [],
      billingInfo: {
        address: "",
        taxId: "",
        paymentMethod: "bank_transfer",
      },
    },
    validationSchema: clientSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit && client) {
          await updateClient.mutateAsync({ id: client.id, ...values });
          toast.success("Cliente actualizado correctamente");
        } else {
          await createClient.mutateAsync(values);
          toast.success("Cliente creado correctamente");
        }
        navigate("/clients");
      } catch (error) {
        toast.error(
          isEdit
            ? "Error al actualizar el cliente"
            : "Error al crear el cliente"
        );
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {isEdit ? "Editar Cliente" : "Nuevo Cliente"}
          </h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Nombre"
              {...formik.getFieldProps("name")}
              error={formik.touched.name && formik.errors.name}
            />
            <Input
              label="Email"
              type="email"
              {...formik.getFieldProps("email")}
              error={formik.touched.email && formik.errors.email}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Teléfono"
              {...formik.getFieldProps("phone")}
              error={formik.touched.phone && formik.errors.phone}
            />
            <Input
              label="Empresa"
              {...formik.getFieldProps("company")}
              error={formik.touched.company && formik.errors.company}
            />
          </div>

          <Select
            label="Estado"
            options={[
              { value: "active", label: "Activo" },
              { value: "inactive", label: "Inactivo" },
              { value: "pending", label: "Pendiente" },
            ]}
            {...formik.getFieldProps("status")}
            error={formik.touched.status && formik.errors.status}
          />

          <TagInput
            label="Etiquetas"
            value={formik.values.tags}
            onChange={(tags) => formik.setFieldValue("tags", tags)}
            error={formik.touched.tags && formik.errors.tags}
          />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Información de Facturación</h3>
            <Input
              label="Dirección"
              {...formik.getFieldProps("billingInfo.address")}
              error={
                formik.touched.billingInfo?.address &&
                formik.errors.billingInfo?.address
              }
            />
            <Input
              label="ID Fiscal"
              {...formik.getFieldProps("billingInfo.taxId")}
              error={
                formik.touched.billingInfo?.taxId &&
                formik.errors.billingInfo?.taxId
              }
            />
            <Select
              label="Método de Pago"
              options={[
                { value: "credit_card", label: "Tarjeta de Crédito" },
                { value: "bank_transfer", label: "Transferencia Bancaria" },
                { value: "paypal", label: "PayPal" },
              ]}
              {...formik.getFieldProps("billingInfo.paymentMethod")}
              error={
                formik.touched.billingInfo?.paymentMethod &&
                formik.errors.billingInfo?.paymentMethod
              }
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/clients")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createClient.isPending || updateClient.isPending}
          >
            {isEdit ? "Actualizar" : "Crear"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};' > src/components/clients/ClientForm.tsx
create_commit "Clients setup - Create comprehensive client form component"

# 4. Sistema de Tickets y Soporte (4 commits)
echo 'import { z } from "zod";

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
export type TicketCategory = z.infer<typeof TicketCategoryEnum>;' > src/types/tickets.ts
create_commit "Tickets setup - Define comprehensive ticket types with Zod schema"

echo 'import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
};' > src/hooks/tickets/useTickets.ts
create_commit "Tickets setup - Implement React Query hooks for ticket management"

echo 'import { useState } from "react";
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
};' > src/components/tickets/TicketsTable.tsx
create_commit "Tickets setup - Create comprehensive tickets table component"

echo 'import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Ticket } from "@/types/tickets";
import {
  useCreateTicket,
  useUpdateTicket,
  useTicketComments,
  useAddComment,
  useUploadAttachment,
} from "@/hooks/tickets/useTickets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/common/Card";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/common/Button";
import { TagInput } from "@/components/common/TagInput";
import { FileUpload } from "@/components/common/FileUpload";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { CommentList } from "@/components/tickets/CommentList";

const ticketSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .required("El título es requerido"),
  description: Yup.string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .required("La descripción es requerida"),
  clientId: Yup.string().required("El cliente es requerido"),
  priority: Yup.string().required("La prioridad es requerida"),
  status: Yup.string().required("El estado es requerido"),
  category: Yup.string().required("La categoría es requerida"),
  dueDate: Yup.date().nullable(),
  tags: Yup.array().of(Yup.string()),
});

interface TicketFormProps {
  ticket?: Ticket;
  isEdit?: boolean;
}

export const TicketForm = ({ ticket, isEdit }: TicketFormProps) => {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();
  const addComment = useAddComment();
  const uploadAttachment = useUploadAttachment();
  const { data: comments } = useTicketComments(ticket?.id || "");
  const [newComment, setNewComment] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);

  const formik = useFormik({
    initialValues: ticket || {
      title: "",
      description: "",
      clientId: "",
      priority: "medium",
      status: "open",
      category: "technical",
      dueDate: null,
      tags: [],
      attachments: [],
    },
    validationSchema: ticketSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit && ticket) {
          await updateTicket.mutateAsync({ id: ticket.id, ...values });
          toast.success("Ticket actualizado correctamente");
        } else {
          await createTicket.mutateAsync(values);
          toast.success("Ticket creado correctamente");
        }
        navigate("/tickets");
      } catch (error) {
        toast.error(
          isEdit ? "Error al actualizar el ticket" : "Error al crear el ticket"
        );
      }
    },
  });

  const handleAddComment = async () => {
    if (!ticket || !newComment.trim()) return;

    try {
      await addComment.mutateAsync({
        ticketId: ticket.id,
        comment: {
          content: newComment,
          userId: "current-user-id", // Replace with actual user ID
          isInternal: isInternalComment,
          attachments: [],
        },
      });
      setNewComment("");
      toast.success("Comentario añadido correctamente");
    } catch (error) {
      toast.error("Error al añadir el comentario");
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!ticket) return;

    try {
      await uploadAttachment.mutateAsync({
        ticketId: ticket.id,
        file,
      });
      toast.success("Archivo subido correctamente");
    } catch (error) {
      toast.error("Error al subir el archivo");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">
              {isEdit ? "Editar Ticket" : "Nuevo Ticket"}
            </h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Título"
              {...formik.getFieldProps("title")}
              error={formik.touched.title && formik.errors.title}
            />

            <RichTextEditor
              label="Descripción"
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
              error={formik.touched.description && formik.errors.description}
            />

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Cliente"
                options={[]} // Add client options
                {...formik.getFieldProps("clientId")}
                error={formik.touched.clientId && formik.errors.clientId}
              />

              <Select
                label="Prioridad"
                options={[
                  { value: "low", label: "Baja" },
                  { value: "medium", label: "Media" },
                  { value: "high", label: "Alta" },
                  { value: "urgent", label: "Urgente" },
                ]}
                {...formik.getFieldProps("priority")}
                error={formik.touched.priority && formik.errors.priority}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Select
                label="Estado"
                options={[
                  { value: "open", label: "Abierto" },
                  { value: "in_progress", label: "En Progreso" },
                  { value: "waiting_client", label: "Esperando Cliente" },
                  { value: "resolved", label: "Resuelto" },
                  { value: "closed", label: "Cerrado" },
                ]}
                {...formik.getFieldProps("status")}
                error={formik.touched.status && formik.errors.status}
              />

              <Select
                label="Categoría"
                options={[
                  { value: "technical", label: "Técnico" },
                  { value: "billing", label: "Facturación" },
                  { value: "feature_request", label: "Solicitud de Función" },
                  { value: "bug", label: "Error" },
                  { value: "other", label: "Otro" },
                ]}
                {...formik.getFieldProps("category")}
                error={formik.touched.category && formik.errors.category}
              />
            </div>

            <Input
              type="datetime-local"
              label="Fecha límite"
              {...formik.getFieldProps("dueDate")}
              error={formik.touched.dueDate && formik.errors.dueDate}
            />

            <TagInput
              label="Etiquetas"
              value={formik.values.tags}
              onChange={(tags) => formik.setFieldValue("tags", tags)}
              error={formik.touched.tags && formik.errors.tags}
            />

            <FileUpload
              label="Adjuntos"
              onUpload={handleFileUpload}
              maxSize={5 * 1024 * 1024} // 5MB
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/tickets")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createTicket.isPending || updateTicket.isPending}
            >
              {isEdit ? "Actualizar" : "Crear"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {isEdit && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Comentarios</h3>
          </CardHeader>
          <CardContent>
            <CommentList comments={comments || []} />

            <div className="mt-4 space-y-4">
              <RichTextEditor
                value={newComment}
                onChange={setNewComment}
                placeholder="Escribe un comentario..."
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-sm text-gray-600">
                    Comentario interno
                  </span>
                </label>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleAddComment}
                  loading={addComment.isPending}
                  disabled={!newComment.trim()}
                >
                  Añadir Comentario
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};' > src/components/tickets/TicketForm.tsx
create_commit "Tickets setup - Create comprehensive ticket form with comments"

# ... (continuaré con más características)

echo "¡Tercera parte del script completada! Continuaré con más características..." 