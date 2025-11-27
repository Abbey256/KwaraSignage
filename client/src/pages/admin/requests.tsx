import { useQuery, useMutation } from "@tanstack/react-query";
import { RequestsTable } from "@/components/admin/requests-table";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Billboard, Request } from "@/lib/types";

export default function AdminRequests() {
  const { data: billboards = [] } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/requests/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billboard Requests</h1>
        <p className="text-muted-foreground">
          Review and manage booking inquiries from the public
        </p>
      </div>

      <RequestsTable
        requests={requests}
        billboards={billboards}
        onUpdateStatus={async (id, status) => {
          await updateStatus.mutateAsync({ id, status });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
