import { useSEO } from "@/hooks/use-seo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Shield, Globe, Eye, ArrowRight, Building2, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { GetStartedFlow } from "@/components/get-started-flow";

function CountUp({
  to,
  duration = 1.8,
  prefix = "",
  className,
}: {
  to: number;
  duration?: number;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const formatted = useTransform(
    count,
    (v) => `${prefix}${Math.round(v).toLocaleString("en-US")}`,
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, count]);

  return (
    <motion.span ref={ref} className={className}>
      {formatted}
    </motion.span>
  );
}

export default function Home() {
  useSEO(
    "MediSeam | Patient-Controlled Health Records Kenya",
    "MediSeam gives every Kenyan patient one secure digital health record that follows them to any hospital. Patient-owned. Blockchain-verified. Built for Kenya."
  );


  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col items-center"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6 bg-secondary/50 text-secondary-foreground">
                <span className="flex h-2 w-2 rounded-full bg-accent mr-2"></span>
                The new standard for Kenyan healthcare
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl text-balance">
                What if the doctor already knew your story?
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-2xl md:text-3xl font-medium text-foreground/80 mb-8 max-w-2xl text-balance">
                Your records, everywhere you go.
              </motion.p>

              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12 max-w-3xl leading-relaxed text-balance">
                Every time you visit a new hospital you start from scratch. Your history stays behind.
                MediSeam changes that. One secure health identity that follows you everywhere you go.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <GetStartedFlow
                  trigger={
                    <Button size="lg" className="text-base h-12 px-8">
                      Get Started
                    </Button>
                  }
                />
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base h-12 px-8 group"
                  onClick={scrollToHowItWorks}
                >
                  See How It Works
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Value Blocks Section */}
        <section id="how-it-works" className="py-24 bg-card px-4 md:px-6 border-y border-border">
          <div className="container mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16"
            >
              <motion.div variants={fadeInUp} className="flex flex-col items-start group">
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">You own your records</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your medical history belongs to you. Not the hospital that created it.
                  You decide who sees it, when, and for how long.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col items-start group">
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Works everywhere</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Any hospital. Any clinic. Any doctor. If you choose to share your records
                  they are there instantly. No paperwork, no repeating yourself.
                </p>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-col items-start group">
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 duration-300">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Nothing is hidden</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every time someone accesses your records it is logged permanently.
                  You can see exactly who looked at your data and when. Always.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Big Statement Section */}
        <section className="relative overflow-hidden bg-[hsl(171_50%_25%)] text-primary-foreground">
          {/* Soft radial wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, hsl(169 49% 40% / 0.5), transparent 70%)",
            }}
          />

          <div className="container mx-auto max-w-7xl px-4 md:px-6 py-28 md:py-40 relative z-10">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.2em] text-primary-foreground/60 mb-12 md:mb-16"
            >
              <span className="h-px w-10 bg-accent" />
              The state of Kenyan healthcare
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
              {/* Massive number */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 lg:self-start relative"
              >
                <div className="leading-none">
                  <CountUp
                    to={12000}
                    duration={2}
                    prefix="+"
                    className="font-bold tracking-tighter text-[clamp(3rem,10vw,9rem)] tabular-nums"
                  />
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-md"
                >
                  hospitals, clinics, and dispensaries across Kenya.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="mt-10 md:mt-12 max-w-2xl"
                >
                  <div className="flex gap-5 md:gap-6">
                    <span className="w-1 shrink-0 rounded-full bg-accent" />
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.15] tracking-tight text-balance">
                      MediSeam is changing that{" "}
                      <span className="text-accent">starting today.</span>
                    </h2>
                  </div>
                </motion.div>
              </motion.div>

              {/* Disconnected node grid + zero callout */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="lg:col-span-5"
              >
                <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.03] backdrop-blur-sm p-6 md:p-8">
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/50">
                      Records shared between them
                    </span>
                  </div>
                  <div className="flex items-end gap-4">
                    <span className="text-7xl md:text-8xl font-bold leading-none text-accent">
                      0
                    </span>
                    <span className="pb-3 text-base md:text-lg text-primary-foreground/70">
                      Not one.
                    </span>
                  </div>

                  {/* Grid of isolated nodes */}
                  <div
                    aria-hidden
                    className="mt-8 grid grid-cols-12 gap-1.5"
                  >
                    {Array.from({ length: 12 * 6 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.6 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                          duration: 0.25,
                          delay: 0.3 + (i % 12) * 0.015 + Math.floor(i / 12) * 0.04,
                        }}
                        className="block aspect-square rounded-full bg-primary-foreground/15"
                      />
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-primary-foreground/50">
                    Every dot is a hospital working alone. Every patient starts over.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* For Hospitals Section */}
        <section className="py-24 px-4 md:px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm font-medium mb-6 text-muted-foreground">
                  For Providers
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Built for hospitals too.</h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-balance">
                  MediSeam connects to your existing system without replacing it. Your patients arrive with their full history. Your doctors make better decisions. Your hospital stops paying for tests that have already been done.
                </p>
                <Button size="lg" className="text-base h-12 px-8" asChild>
                  <Link href="/contact">Partner with us <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </motion.div>
              <motion.div
                className="flex-1 w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden relative border border-border"
                style={{
                  background:
                    "radial-gradient(ellipse at center, hsl(var(--secondary)) 0%, hsl(var(--background)) 75%)",
                }}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Connecting lines from center to each hospital */}
                <svg
                  aria-hidden
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {[
                    { x: 14, y: 18 },
                    { x: 86, y: 16 },
                    { x: 92, y: 55 },
                    { x: 75, y: 88 },
                    { x: 16, y: 82 },
                  ].map((p, i) => (
                    <motion.line
                      key={i}
                      x1={50}
                      y1={50}
                      x2={p.x}
                      y2={p.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.3"
                      strokeDasharray="1 1.2"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.5 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{
                        duration: 0.9,
                        delay: 0.35 + i * 0.08,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </svg>

                {/* Hospital nodes */}
                {[
                  { label: "Nairobi", top: "18%", left: "14%", delay: 0.5 },
                  { label: "Mombasa", top: "16%", left: "86%", delay: 0.6 },
                  { label: "Kisumu", top: "55%", left: "92%", delay: 0.7 },
                  { label: "Eldoret", top: "88%", left: "75%", delay: 0.8 },
                  { label: "Nakuru", top: "82%", left: "16%", delay: 0.9 },
                ].map((node) => (
                  <motion.div
                    key={node.label}
                    className="absolute flex items-center gap-2 rounded-xl bg-background/95 backdrop-blur-sm shadow-sm border border-border px-3 py-2"
                    style={{
                      top: node.top,
                      left: node.left,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.4,
                      delay: node.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                      {node.label}
                    </span>
                  </motion.div>
                ))}

                {/* Center patient identity */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="relative">
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-primary/20"
                      animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary flex flex-col items-center justify-center text-primary-foreground shadow-lg">
                      <Shield className="h-7 w-7 mb-0.5" />
                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold">
                        You
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Closing Strip */}
        <section className="py-24 px-4 md:px-6 border-t border-border bg-card">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-10 text-balance leading-tight">
                Join the healthcare system that finally works for the patient.
              </h2>
              <GetStartedFlow
                trigger={
                  <Button size="lg" className="text-lg h-14 px-10 rounded-full">
                    Get Started
                  </Button>
                }
              />
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
