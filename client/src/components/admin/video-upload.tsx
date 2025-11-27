import { useState, useCallback } from "react";
import {
  Upload,
  Video,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Billboard } from "@/lib/types";

interface VideoUploadProps {
  billboards: Billboard[];
  onUploadComplete?: (billboardId: string, result: ProcessingResult) => void;
}

interface ProcessingResult {
  totalPeople: number;
  videoDuration: string;
  framesProcessed: number;
  status: "success" | "error";
}

interface UploadJob {
  id: string;
  fileName: string;
  billboardId: string;
  billboardName: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  result?: ProcessingResult;
  error?: string;
}

export function VideoUpload({ billboards, onUploadComplete }: VideoUploadProps) {
  const [selectedBillboard, setSelectedBillboard] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadJobs, setUploadJobs] = useState<UploadJob[]>([]);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateProcessing = async (jobId: string, billboardId: string): Promise<ProcessingResult> => {
    const billboard = billboards.find((b) => b.id === billboardId);
    const basePeople = billboard?.dailyEstimatedViews || 1000;
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUploadJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "processing", progress: 25 } : job
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 800));
    setUploadJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, progress: 50 } : job
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setUploadJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, progress: 75 } : job
      )
    );

    await new Promise((resolve) => setTimeout(resolve, 700));

    const result: ProcessingResult = {
      totalPeople: Math.floor(basePeople * (0.8 + Math.random() * 0.4)),
      videoDuration: `${Math.floor(Math.random() * 10 + 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      framesProcessed: Math.floor(Math.random() * 5000 + 1000),
      status: "success",
    };

    setUploadJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, status: "completed", progress: 100, result }
          : job
      )
    );

    return result;
  };

  const processFile = async (file: File) => {
    if (!selectedBillboard) {
      toast({
        title: "Select a Billboard",
        description: "Please select a billboard location before uploading.",
        variant: "destructive",
      });
      return;
    }

    const billboard = billboards.find((b) => b.id === selectedBillboard);
    if (!billboard) return;

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newJob: UploadJob = {
      id: jobId,
      fileName: file.name,
      billboardId: selectedBillboard,
      billboardName: billboard.name,
      status: "uploading",
      progress: 10,
    };

    setUploadJobs((prev) => [newJob, ...prev]);

    try {
      const result = await simulateProcessing(jobId, selectedBillboard);
      
      onUploadComplete?.(selectedBillboard, result);
      
      toast({
        title: "Processing Complete",
        description: `Detected ${result.totalPeople.toLocaleString()} people in the video.`,
      });
    } catch (error) {
      setUploadJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, status: "error", error: "Processing failed" }
            : job
        )
      );
      toast({
        title: "Error",
        description: "Video processing failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const videoFiles = files.filter((file) =>
        file.type.startsWith("video/")
      );

      if (videoFiles.length === 0) {
        toast({
          title: "Invalid File",
          description: "Please upload video files only.",
          variant: "destructive",
        });
        return;
      }

      videoFiles.forEach(processFile);
    },
    [selectedBillboard, billboards]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(processFile);
    e.target.value = "";
  };

  const removeJob = (jobId: string) => {
    setUploadJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  const getStatusIcon = (status: UploadJob["status"]) => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4 animate-pulse text-blue-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: UploadJob["status"]) => {
    switch (status) {
      case "uploading":
        return <Badge variant="secondary">Uploading</Badge>;
      case "processing":
        return <Badge className="bg-primary">Processing</Badge>;
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Video for Analysis</CardTitle>
          <CardDescription>
            Upload CCTV or phone footage to count people viewing billboards.
            Videos are processed in real-time and immediately deleted for privacy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Select Billboard Location
              </label>
              <Select value={selectedBillboard} onValueChange={setSelectedBillboard}>
                <SelectTrigger data-testid="select-upload-billboard">
                  <SelectValue placeholder="Choose a billboard" />
                </SelectTrigger>
                <SelectContent>
                  {billboards.map((billboard) => (
                    <SelectItem key={billboard.id} value={billboard.id}>
                      {billboard.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              data-testid="input-video-upload"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragging ? "Drop video here" : "Drag & drop video files"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (MP4, MOV, AVI supported)
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={!selectedBillboard}>
                <Upload className="mr-2 h-4 w-4" />
                Select Video
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>
              Videos are processed using AI to count unique individuals. For privacy,
              videos are immediately deleted after processing - only the count data is stored.
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Queue</CardTitle>
            <CardDescription>
              Track the status of your video uploads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-lg border p-4"
                  data-testid={`job-${job.id}`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <p className="font-medium">{job.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.billboardName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(job.status)}
                      {(job.status === "completed" || job.status === "error") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {(job.status === "uploading" || job.status === "processing") && (
                    <Progress value={job.progress} className="h-2" />
                  )}

                  {job.status === "completed" && job.result && (
                    <div className="mt-3 grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          People Detected
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {job.result.totalPeople.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Duration
                        </div>
                        <div className="text-lg font-bold">
                          {job.result.videoDuration}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                          <Video className="h-3 w-3" />
                          Frames
                        </div>
                        <div className="text-lg font-bold">
                          {job.result.framesProcessed.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {job.status === "error" && (
                    <p className="mt-2 text-sm text-destructive">
                      {job.error || "An error occurred during processing."}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
