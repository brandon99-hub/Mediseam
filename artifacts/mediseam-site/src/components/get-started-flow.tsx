import React, { useState, useEffect, type ReactNode } from "react";
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
import { Label } from "@/components/ui/label";
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
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRegisterHospital, useInitializePaystack, useCheckUsername, useCheckEmail } from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";

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

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (search.get("step") === "register") {
      setOpen(true);
    }
  }, []);

  const [step, setStep] = useState<Step>("plan");
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [email, setEmail] = useState("");
  const [trxref, setTrxref] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

  const watchedUsername = registerForm.watch("username");
  const [debouncedUsername, setDebouncedUsername] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 400);
    return () => clearTimeout(timer);
  }, [watchedUsername]);

  const { data: availability, isFetching: isCheckingUsername } = useCheckUsername(debouncedUsername, {
    query: {
      enabled: debouncedUsername.length >= 3 && step === "register",
    } as any
  });

  // Email availability check
  const [emailInput, setEmailInput] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailInput.includes("@") && emailInput.includes(".")) {
        setDebouncedEmail(emailInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [emailInput]);

  const { data: emailStatus, isFetching: isCheckingEmail } = useCheckEmail(
    debouncedEmail,
    {
      query: {
        enabled: debouncedEmail.length > 5,
        staleTime: 60000,
      } as any,
    }
  );

  useEffect(() => {
    if (open) {
      const search = new URLSearchParams(window.location.search);
      const stepParam = search.get("step");
      const emailParam = search.get("email");
      const planParam = search.get("plan") as PlanId;

      if (stepParam === "register" && emailParam && planParam) {
        setStep("register");
        setEmail(emailParam);
        setPlanId(planParam as PlanId);
        setTrxref(search.get("trxref") || search.get("reference"));
      } else if (defaultPlanId) {
        setPlanId(defaultPlanId);
        setStep("payment");
      } else {
        setPlanId(null);
        setStep("plan");
      }
      
      if (!emailParam) {
        setEmail("");
        paymentForm.reset({ email: "" });
      } else {
        paymentForm.reset({ email: emailParam });
      }
      
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

  const { mutate: initializePaystack, isPending: isInitializing } = useInitializePaystack();

  const handlePayment = (values: PaymentValues) => {
    initializePaystack({
      data: {
        email: values.email,
        plan: planId || "starter",
      },
    }, {
      onSuccess: (response: any) => {
        console.log("Paystack Initialization Response:", response);
        
        // Ensure we have an access_code before opening the popup
        const accessCode = response.data?.access_code;
        
        if (!accessCode) {
          toast({
            title: "Initialization error",
            description: "Missing payment access code. Please try again.",
            variant: "destructive"
          });
          return;
        }

        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: values.email,
          amount: response.data.amount,
          currency: "KES",
          access_code: accessCode,
          onClose: () => {
            setOpen(true); // Re-open the dialog so they can try again
            toast({
              title: "Payment cancelled",
              description: "The payment window was closed before completion.",
            });
          },
          callback: (response: any) => {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set("step", "register");
            newUrl.searchParams.set("email", values.email);
            newUrl.searchParams.set("plan", planId || "starter");
            newUrl.searchParams.set("trxref", response.reference);
            window.history.replaceState({}, "", newUrl.toString());

            setEmail(values.email);
            setTrxref(response.reference);
            setStep("register");
            setOpen(true);
            
            toast({
              title: "Payment successful",
              description: "Please complete your account setup.",
            });
          }
        });
        
        // Close our dialog first to prevent overlay interference
        setOpen(false);
        handler.openIframe();
      },
      onError: (error) => {
        toast({
          title: "Initialization failed",
          description: "Could not connect to the payment provider. Please try again.",
          variant: "destructive"
        });
        console.error(error);
      }
    });
  };

  const { mutate: registerHospital, isPending } = useRegisterHospital();

  const handleRegister = (values: RegisterValues) => {
    registerHospital({
      data: {
        ...values,
        email,
        plan: planId || "starter",
        trxref: trxref || "",
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Account created successfully.",
          description: "Welcome to MediSeam. Redirecting you to the login page...",
        });
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setOpen(false);
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || "Something went wrong. Please try again or contact us.";
        toast({
          title: "Registration failed",
          description: message,
          variant: "destructive"
        });
        console.error(error);
      }
    });
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          {/* Modern Step Indicator */}
        <div className="flex items-center justify-between mb-8 max-w-sm mx-auto">
          {[
            { id: "plan", label: "Plan", num: 1 },
            { id: "payment", label: "Payment", num: 2 },
            { id: "register", label: "Account", num: 3 },
          ].map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-300",
                    step === s.id
                      ? "bg-primary border-primary text-primary-foreground font-bold scale-110 shadow-sm"
                      : (idx < ["plan", "payment", "register"].indexOf(step))
                      ? "bg-primary/20 border-primary/20 text-primary"
                      : "border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  {idx < ["plan", "payment", "register"].indexOf(step) ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 hidden sm:block",
                    step === s.id ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className="h-[2px] flex-1 bg-muted-foreground/20 mx-2 -mt-4" />
              )}
            </React.Fragment>
          ))}
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
                    "group relative flex items-start justify-between gap-4 rounded-xl border border-border p-4 text-left transition-all duration-300 hover-elevate active-tactile",
                    p.popular && "border-primary/40 bg-primary/[0.02]",
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
                          <div className="relative">
                            <Input
                              placeholder="admin@hospital.co.ke"
                              className="pr-10"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setEmailInput(e.target.value);
                              }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                              {isCheckingEmail ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : debouncedEmail && emailStatus?.available === true ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : debouncedEmail && emailStatus?.available === false ? (
                                <XCircle className="h-4 w-4 text-destructive" />
                              ) : null}
                            </div>
                          </div>
                        </FormControl>
                        {emailStatus?.available === false && (
                          <p className="text-[10px] text-destructive font-medium mt-1">
                            This email is already registered to another hospital account.
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          This email links your payment to your hospital account.
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
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full sm:w-auto hover-elevate active-tactile"
                      disabled={isInitializing || emailStatus?.available === false}
                    >
                      {isInitializing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                            <div className="relative">
                              <Input
                                placeholder="admin.knh"
                                autoComplete="username"
                                {...field}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                {isCheckingUsername && (
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                {!isCheckingUsername && debouncedUsername.length >= 3 && availability?.available && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                                {!isCheckingUsername && debouncedUsername.length >= 3 && availability?.available === false && (
                                  <XCircle className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          {debouncedUsername.length >= 3 && availability?.available === false && (
                            <p className="text-[10px] font-medium text-destructive mt-1">
                              This username is already taken.
                            </p>
                          )}
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
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                autoComplete="new-password"
                                className="pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                      <Input value={email} readOnly disabled className="pr-9" />
                      <Lock className="h-3.5 w-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Linked to your payment.
                    </p>
                  </div>

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
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full sm:w-auto hover-elevate active-tactile" 
                      disabled={isPending}
                    >
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
