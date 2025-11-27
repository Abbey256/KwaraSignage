import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, MapPin, Phone, Mail, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import type { Billboard } from "@/lib/types";

const contactFormSchema = z.object({
  billboardId: z.string().min(1, "Please select a billboard"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  billboards: Billboard[];
  selectedBillboard?: Billboard | null;
  onClearSelection?: () => void;
}

export function ContactForm({ billboards, selectedBillboard, onClearSelection }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      billboardId: selectedBillboard?.id || "",
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  if (selectedBillboard && form.getValues("billboardId") !== selectedBillboard.id) {
    form.setValue("billboardId", selectedBillboard.id);
  }

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      setIsSuccess(true);
      toast({
        title: "Request Submitted!",
        description: "We'll get back to you within 24-48 hours.",
      });
      form.reset();
      onClearSelection?.();
      
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const availableBillboards = billboards.filter((b) => b.status === "available");

  if (isSuccess) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Request Submitted Successfully!</h3>
          <p className="mb-6 max-w-md text-muted-foreground">
            Thank you for your interest. Our team will review your request and contact you within 24-48 business hours.
          </p>
          <Button onClick={() => setIsSuccess(false)} data-testid="button-new-request">
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Request a Billboard</CardTitle>
            <CardDescription>
              Fill out the form below to request a billboard location. Our team will contact you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="billboardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Billboard Location</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-billboard">
                            <SelectValue placeholder="Choose a billboard location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableBillboards.map((billboard) => (
                            <SelectItem key={billboard.id} value={billboard.id}>
                              {billboard.name} - {billboard.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+234 803 XXX XXXX" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your advertising needs..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="button-submit-request">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Reach out to us directly for any inquiries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Office Address</h4>
                <p className="text-sm text-muted-foreground">
                  Kwara State Signage Agency<br />
                  Government House Complex<br />
                  Ilorin, Kwara State, Nigeria
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-sm text-muted-foreground">
                  +234 (0) 803 XXX XXXX<br />
                  +234 (0) 805 XXX XXXX
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  signage@kwarastate.gov.ng<br />
                  info@kwarasignage.gov.ng
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <h4 className="mb-2 font-medium">Office Hours</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
