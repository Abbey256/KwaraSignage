import { useQuery, useMutation } from "@tanstack/react-query";
import { VideoUpload } from "@/components/admin/video-upload";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Billboard } from "@/lib/types";

export default function AdminUpload() {
  const { data: billboards = [] } = useQuery<Billboard[]>({
    queryKey: ["/api/billboards"],
  });

  const saveAnalytics = useMutation({
    mutationFn: async (data: { billboardId: string; totalPeople: number; videoDuration: string; framesProcessed: number }) => {
      return apiRequest("POST", "/api/analytics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
    },
  });

  const handleUploadComplete = async (billboardId: string, result: { totalPeople: number; videoDuration: string; framesProcessed: number }) => {
    await saveAnalytics.mutateAsync({
      billboardId,
      totalPeople: result.totalPeople,
      videoDuration: result.videoDuration,
      framesProcessed: result.framesProcessed,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Video Upload & Analysis</h1>
        <p className="text-muted-foreground">
          Upload CCTV footage to count people viewing billboards
        </p>
      </div>

      <VideoUpload
        billboards={billboards}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
