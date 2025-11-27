import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Search,
  MoreHorizontal,
  Eye,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Billboard } from "@/lib/types";

const billboardFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  size: z.string().min(1, "Size is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["available", "occupied"]),
  address: z.string().optional(),
  description: z.string().optional(),
  dailyEstimatedViews: z.coerce.number().min(0),
  weeklyEstimatedViews: z.coerce.number().min(0),
  monthlyEstimatedViews: z.coerce.number().min(0),
});

type BillboardFormValues = z.infer<typeof billboardFormSchema>;

interface BillboardManagementProps {
  billboards: Billboard[];
  onAddBillboard: (billboard: Omit<Billboard, "id">) => Promise<void>;
  onUpdateBillboard: (id: string, billboard: Partial<Billboard>) => Promise<void>;
  onDeleteBillboard: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function BillboardManagement({
  billboards,
  onAddBillboard,
  onUpdateBillboard,
  onDeleteBillboard,
  isLoading,
}: BillboardManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBillboard, setEditingBillboard] = useState<Billboard | null>(null);
  const [deletingBillboard, setDeletingBillboard] = useState<Billboard | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: {
      name: "",
      latitude: 8.4799,
      longitude: 4.5418,
      size: "",
      imageUrl: "",
      status: "available",
      address: "",
      description: "",
      dailyEstimatedViews: 0,
      weeklyEstimatedViews: 0,
      monthlyEstimatedViews: 0,
    },
  });

  const filteredBillboards = billboards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (billboard?: Billboard) => {
    if (billboard) {
      setEditingBillboard(billboard);
      form.reset({
        name: billboard.name,
        latitude: billboard.latitude,
        longitude: billboard.longitude,
        size: billboard.size,
        imageUrl: billboard.imageUrl || "",
        status: billboard.status as "available" | "occupied",
        address: billboard.address || "",
        description: billboard.description || "",
        dailyEstimatedViews: billboard.dailyEstimatedViews,
        weeklyEstimatedViews: billboard.weeklyEstimatedViews,
        monthlyEstimatedViews: billboard.monthlyEstimatedViews,
      });
    } else {
      setEditingBillboard(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBillboard(null);
    form.reset();
  };

  async function onSubmit(data: BillboardFormValues) {
    setIsSubmitting(true);
    try {
      if (editingBillboard) {
        await onUpdateBillboard(editingBillboard.id, data);
        toast({ title: "Billboard updated successfully" });
      } else {
        await onAddBillboard(data as Omit<Billboard, "id">);
        toast({ title: "Billboard added successfully" });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save billboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleDelete = async () => {
    if (!deletingBillboard) return;
    setIsSubmitting(true);
    try {
      await onDeleteBillboard(deletingBillboard.id);
      toast({ title: "Billboard deleted successfully" });
      setIsDeleteDialogOpen(false);
      setDeletingBillboard(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete billboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Billboard Management</CardTitle>
              <CardDescription>Manage all billboard locations</CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-billboard">
              <Plus className="mr-2 h-4 w-4" />
              Add Billboard
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search billboards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-billboards"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Billboard</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Daily Views</TableHead>
                  <TableHead className="text-right">Monthly Views</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredBillboards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No billboards found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBillboards.map((billboard) => (
                    <TableRow key={billboard.id} data-testid={`row-billboard-${billboard.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {billboard.imageUrl ? (
                            <img
                              src={billboard.imageUrl}
                              alt={billboard.name}
                              className="h-10 w-14 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{billboard.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {billboard.address || `${billboard.latitude.toFixed(4)}, ${billboard.longitude.toFixed(4)}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{billboard.size}</TableCell>
                      <TableCell>
                        <Badge
                          variant={billboard.status === "available" ? "default" : "secondary"}
                        >
                          {billboard.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(billboard.dailyEstimatedViews)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(billboard.monthlyEstimatedViews)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${billboard.id}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(billboard)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setDeletingBillboard(billboard);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingBillboard ? "Edit Billboard" : "Add New Billboard"}
            </DialogTitle>
            <DialogDescription>
              {editingBillboard
                ? "Update the billboard information below."
                : "Fill in the details to add a new billboard location."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Unity Road Junction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="number" step="any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="48ft x 14ft" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Ilorin, Kwara State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the billboard location..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="dailyEstimatedViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Views</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weeklyEstimatedViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Views</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyEstimatedViews"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Views</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingBillboard ? (
                    "Update Billboard"
                  ) : (
                    "Add Billboard"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Billboard</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingBillboard?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
