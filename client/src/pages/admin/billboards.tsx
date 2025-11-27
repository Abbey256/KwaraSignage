import { useQuery, useMutation } from "@tanstack/react-query";
import { BillboardManagement } from "@/components/admin/billboard-management";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Billboard } from "@/lib/types";

export default function AdminBillboards() {
  const { data: billboards = [], isLoading } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const addBillboard = useMutation({
    mutationFn: async (billboard: Omit<Billboard, "id">) => {
      return apiRequest("POST", "/api/billboards", billboard);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/billboards"] });
    },
  });

  const updateBillboard = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Billboard> }) => {
      return apiRequest("PATCH", `/api/billboards/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/billboards"] });
    },
  });

  const deleteBillboard = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/billboards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/billboards"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billboard Management</h1>
        <p className="text-muted-foreground">
          Add, edit, and manage all billboard locations
        </p>
      </div>

      <BillboardManagement
        billboards={billboards}
        onAddBillboard={async (billboard) => {
          await addBillboard.mutateAsync(billboard);
        }}
        onUpdateBillboard={async (id, data) => {
          await updateBillboard.mutateAsync({ id, data });
        }}
        onDeleteBillboard={async (id) => {
          await deleteBillboard.mutateAsync(id);
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
