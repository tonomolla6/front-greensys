import { useFormik } from "formik";
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
};
