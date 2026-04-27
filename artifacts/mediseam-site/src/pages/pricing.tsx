import { useSEO } from "@/hooks/use-seo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetStartedFlow } from "@/components/get-started-flow";

export default function Pricing() {
  useSEO(
    "MediSeam Pricing | Hospital Health Data Plans Kenya",
    "Transparent monthly plans for clinics and hospitals across Kenya. Unlimited patients on every tier. Connect your facility to MediSeam from KES 30,000 per month."
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
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
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Simple, transparent pricing
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground">
              No hidden fees. No patient limits. One platform for a connected healthcare network.
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          >
            {/* Starter Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                  <CardDescription className="text-base mt-2">For single-location clinics and dispensaries</CardDescription>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">KES 30,000</span>
                    <span className="text-sm font-medium text-muted-foreground">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm mt-4">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span><strong>Everything MediSeam offers</strong> — no feature is locked behind a higher tier</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Up to 1 branch</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Up to 5 staff accounts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Email support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Onboarding guide and setup documentation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>24 month contract</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <GetStartedFlow
                    defaultPlanId="starter"
                    trigger={
                      <Button className="w-full" variant="outline">
                        Get Started
                      </Button>
                    }
                  />
                </CardFooter>
              </Card>
            </motion.div>

            {/* Growth Plan */}
            <motion.div variants={fadeInUp} className="relative z-10 md:-mt-4 md:-mb-4">
              <Card className="h-full flex flex-col border-primary shadow-xl bg-primary text-primary-foreground">
                <div className="absolute top-0 inset-x-0 -translate-y-1/2 flex justify-center">
                  <span className="bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Growth</CardTitle>
                  <CardDescription className="text-base mt-2 text-primary-foreground/80">For hospitals with multiple branches</CardDescription>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">KES 70,000</span>
                    <span className="text-sm font-medium text-primary-foreground/80">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm font-medium mb-4 text-primary-foreground/90">Everything in Starter plus:</p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>Up to 5 branches</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>Up to 25 staff accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>Dedicated onboarding session — we set everything up with your team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>Custom integration with your existing hospital system</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0" />
                      <span>24 month contract</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <GetStartedFlow
                    defaultPlanId="growth"
                    trigger={
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground border-none">
                        Get Started
                      </Button>
                    }
                  />
                </CardFooter>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                  <CardDescription className="text-base mt-2">For large hospital chains and networks</CardDescription>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight">KES 150,000</span>
                    <span className="text-sm font-medium text-muted-foreground">/ month</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm font-medium mb-4 text-foreground">Everything in Growth plus:</p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Unlimited branches</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Unlimited staff accounts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Dedicated account manager — one point of contact for everything</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Custom integration with your existing hospital system included</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>99.9% uptime guarantee</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>White-label option — your brand, our technology</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>Quarterly compliance reports</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>36 month contract</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/contact">Talk to us</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>

          {/* Government Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-secondary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 mb-24"
          >
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Working with government?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We offer custom pricing for county governments, SHA, and public hospital networks. Volume licensing, government data requirements, and direct national health system integration all handled.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">Contact our team</Link>
              </Button>
            </div>
            <div className="flex-1 w-full flex justify-center md:justify-end">
              {/* Decorative element for government section */}
              <div className="w-full max-w-sm aspect-[4/3] rounded-2xl bg-card border shadow-sm p-6 relative">
                <div className="flex gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-1/3 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted/50 rounded"></div>
                  <div className="h-4 w-5/6 bg-muted/50 rounded"></div>
                </div>
                <div className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-primary"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-medium">Is patient volume really unlimited?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Yes. We do not believe your pricing should punish you for caring for more people. Every plan covers every patient you see at no additional cost.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-medium">Can we keep our existing hospital system?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Yes. MediSeam connects to whatever system you already use. Nothing gets replaced. Nothing gets disrupted. Growth and Enterprise plans include a dedicated integration session with our team.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-medium">What does the contract look like?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  Starter and Growth plans run for 24 months. Enterprise runs for 36 months. Annual payment is available with a 5% discount.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-medium">How does MediSeam keep patient data decentralised?</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  We never store your medical records on our own servers. When a record is created it is encrypted and stored on IPFS — a decentralised global storage network where no single company, hospital, or government controls the data. The only key that unlocks a patient's records belongs to the patient. Every access event is permanently logged on Hedera Hashgraph's blockchain — a public ledger that is independently verifiable by anyone. MediSeam cannot alter those records, cannot access them without consent, and cannot take them down. The data lives on the network — not with us.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
