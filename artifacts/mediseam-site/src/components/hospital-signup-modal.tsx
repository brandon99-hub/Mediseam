import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building2, ArrowRight } from "lucide-react";

const formSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Use letters, numbers, dots, dashes or underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(2, "Full name is required"),
  department: z.string().min(2, "Department is required"),
  licenseNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HospitalSignupModalProps {
  trigger: ReactNode;
}

export function HospitalSignupModal({ trigger }: HospitalSignupModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: "",
      username: "",
      password: "",
      email: "",
      fullName: "",
      department: "",
      licenseNumber: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    toast({
      title: "Request received.",
      description: "We will review your hospital details and reach out shortly.",
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-2">
            <Building2 className="h-5 w-5" />
          </div>
          <DialogTitle className="text-2xl">Register your hospital</DialogTitle>
          <DialogDescription>
            Tell us about your facility and create the administrator account. We will be
            in touch to complete onboarding.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Kenyatta National Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="admin.knh" autoComplete="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="At least 8 characters"
                        autoComplete="new-password"
                        {...field}
                      />
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
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@hospital.co.ke"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Wanjiku Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department *</FormLabel>
                    <FormControl>
                      <Input placeholder="ICT, Administration, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    License number{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="If you are also a medical professional"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2 flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Create hospital account
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <div className="mt-2 pt-5 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Are you a patient?{" "}
            <a
              href="/login"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              Sign in to your account
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
