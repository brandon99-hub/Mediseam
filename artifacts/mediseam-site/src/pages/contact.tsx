import { usePageTitle } from "@/hooks/use-page-title";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Building, TrendingUp, HelpCircle, MapPin, Mail } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  organisation: z.string().optional(),
  type: z.enum(["Hospital", "Investor", "Patient", "Other"], {
    required_error: "Please select who you are",
  }),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  usePageTitle("Contact — MediSeam");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      organisation: "",
      type: undefined,
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Thanks — we'll be in touch.",
      description: "Your message has been sent successfully. We'll get back to you shortly.",
    });
    form.reset();
  };

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mb-16"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Let's talk.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground text-balance">
              Whether you are a hospital exploring a partnership, an investor, or a patient with a question, we want to hear from you.
            </motion.p>
          </motion.div>

          {/* Cards */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                    <Building className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Hospital partnerships</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    Interested in bringing MediSeam to your facility? We will walk you through exactly how it works and what it means for your patients and your team.
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full" onClick={scrollToForm}>Book a call</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Investors</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    We are building the health data infrastructure Kenya has been waiting for. If you want to be part of that conversation we are ready.
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full" onClick={scrollToForm}>Get in touch</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col bg-card border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">General enquiries</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    Any other questions — patients, press, or anything else.
                  </p>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant="outline" className="w-full" onClick={scrollToForm}>Send us a message</Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <div id="contact-form" className="scroll-mt-32 border-t pt-24 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email address *</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="organisation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organisation <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Hospital Name, Clinic, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Hospital">Hospital</SelectItem>
                                <SelectItem value="Investor">Investor</SelectItem>
                                <SelectItem value="Patient">Patient</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" size="lg" className="w-full md:w-auto">
                      Send message
                    </Button>
                  </form>
                </Form>
              </div>
            </div>

            {/* Direct Contact */}
            <div className="lg:col-span-1 lg:pl-8 flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <a href="mailto:info@mediseam.com" className="text-muted-foreground hover:text-primary transition-colors">info@mediseam.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground">Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/50 rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-2">Response times</h3>
                <p className="text-sm text-muted-foreground">
                  We aim to respond to all enquiries within 24 hours during regular business days.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
