import { useState, useEffect, type ReactNode } from "react";
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
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type PlanId = "starter" | "growth" | "enterprise";

const PLANS: Array<{
  id: PlanId;
  name: string;
  price: number;
  description: string;
  contract: string;
  popular?: boolean;
}> = [
  {
    id: "starter",
    name: "Starter",
    price: 30000,
    description: "Single-location clinics and dispensaries",
    contract: "24 months",
  },
  {
    id: "growth",
    name: "Growth",
    price: 70000,
    description: "Hospitals with multiple branches",
    contract: "24 months",
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 150000,
    description: "Large hospital chains and networks",
    contract: "36 months",
  },
];

const formatKES = (n: number) => `KES ${n.toLocaleString("en-US")}`;

const paymentSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type PaymentValues = z.infer<typeof paymentSchema>;

const registerSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Use letters, numbers, dots, dashes or underscores"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  department: z.string().min(2, "Department is required"),
  licenseNumber: z.string().optional(),
});
type RegisterValues = z.infer<typeof registerSchema>;

type Step = "plan" | "payment" | "register";

interface GetStartedFlowProps {
  trigger: ReactNode;
  defaultPlanId?: PlanId;
}

export function GetStartedFlow({ trigger, defaultPlanId }: GetStartedFlowProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [email, setEmail] = useState("");

  const plan = planId ? PLANS.find((p) => p.id === planId) ?? null : null;

  const paymentForm = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { email: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      hospitalName: "",
      username: "",
      password: "",
      fullName: "",
      department: "",
      licenseNumber: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (defaultPlanId) {
        setPlanId(defaultPlanId);
        setStep("payment");
      } else {
        setPlanId(null);
        setStep("plan");
      }
      setEmail("");
      paymentForm.reset({ email: "" });
      registerForm.reset({
        hospitalName: "",
        username: "",
        password: "",
        fullName: "",
        department: "",
        licenseNumber: "",
      });
    }
  }, [open, defaultPlanId, paymentForm, registerForm]);

  const handleSelectPlan = (id: PlanId) => {
    setPlanId(id);
    setStep("payment");
  };

  const handlePayment = (values: PaymentValues) => {
    setEmail(values.email);
    toast({
      title: "Payment confirmed.",
      description: `Your ${plan?.name} subscription is active. Now create your administrator account.`,
    });
    setStep("register");
  };

  const handleRegister = (values: RegisterValues) => {
    console.log({ ...values, email, plan: planId });
    toast({
      title: "Account created.",
      description:
        "Welcome to MediSeam. Our team will be in touch with onboarding details.",
    });
    setOpen(false);
  };

  const handleBack = () => {
    if (step === "payment" && !defaultPlanId) {
      setStep("plan");
      setPlanId(null);
    } else if (step === "register") {
      setStep("payment");
    }
  };

  const stepNumber = step === "plan" ? 1 : step === "payment" ? 2 : 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className={cn(stepNumber >= 1 && "text-foreground font-medium")}>
              1. Plan
            </span>
            <span className="opacity-40">›</span>
            <span className={cn(stepNumber >= 2 && "text-foreground font-medium")}>
              2. Payment
            </span>
            <span className="opacity-40">›</span>
            <span className={cn(stepNumber >= 3 && "text-foreground font-medium")}>
              3. Account
            </span>
          </div>
          {step === "plan" && (
            <>
              <DialogTitle className="text-2xl">Pick your plan</DialogTitle>
              <DialogDescription>
                Every plan includes everything MediSeam offers. Choose based on the
                size of your operation.
              </DialogDescription>
            </>
          )}
          {step === "payment" && plan && (
            <>
              <DialogTitle className="text-2xl">Complete your payment</DialogTitle>
              <DialogDescription>
                We will use your email to link this payment to your hospital
                account.
              </DialogDescription>
            </>
          )}
          {step === "register" && plan && (
            <>
              <DialogTitle className="text-2xl">
                Create your hospital account
              </DialogTitle>
              <DialogDescription>
                Final step. These details set up your administrator login.
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-3 pt-2"
            >
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlan(p.id)}
                  className={cn(
                    "group relative flex items-start justify-between gap-4 rounded-xl border border-border p-4 text-left transition-colors hover-elevate active-elevate-2",
                    p.popular && "border-primary/40",
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-base">{p.name}</span>
                      {p.popular && (
                        <span className="rounded-full bg-accent/20 text-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {p.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {p.contract} contract
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-lg">{formatKES(p.price)}</div>
                    <div className="text-xs text-muted-foreground">/ month</div>
                  </div>
                </button>
              ))}

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
            </motion.div>
          )}

          {step === "payment" && plan && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 pt-2"
            >
              <div className="rounded-xl border border-border bg-secondary/40 p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Selected plan
                  </div>
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {plan.contract} contract
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg">{formatKES(plan.price)}</div>
                  <div className="text-xs text-muted-foreground">/ month</div>
                </div>
              </div>

              <Form {...paymentForm}>
                <form
                  onSubmit={paymentForm.handleSubmit(handlePayment)}
                  className="space-y-5"
                >
                  <FormField
                    control={paymentForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="admin@hospital.co.ke"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">
                          This email links your payment to your hospital
                          account.
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="rounded-xl border border-dashed border-border bg-card p-4 flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Secure checkout</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You will be redirected to our payment partner to
                        complete the transaction. Payment provider is being
                        finalised.
                      </p>
                    </div>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                    {!defaultPlanId ? (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Change plan
                      </Button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Pay {formatKES(plan.price)}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          )}

          {step === "register" && plan && (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 pt-2"
            >
              <div className="rounded-xl border border-border bg-secondary/40 p-3 flex items-center gap-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0 truncate">
                  <span className="text-muted-foreground">Paid as </span>
                  <span className="font-medium">{email}</span>
                  <span className="text-muted-foreground"> · {plan.name}</span>
                </div>
              </div>

              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-5"
                >
                  <FormField
                    control={registerForm.control}
                    name="hospitalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kenyatta National Hospital"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="admin.knh"
                              autoComplete="username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
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

                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input value={email} readOnly disabled className="pr-9" />
                        <Lock className="h-3.5 w-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">
                      Linked to your payment.
                    </p>
                  </FormItem>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ICT, Administration, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          License number{" "}
                          <span className="text-muted-foreground font-normal">
                            (optional)
                          </span>
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

                  <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      Create hospital account
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
