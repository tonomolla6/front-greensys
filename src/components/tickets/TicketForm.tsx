import { useState } from "react";
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
};
