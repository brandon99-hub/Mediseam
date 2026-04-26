import { usePageTitle } from "@/hooks/use-page-title";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, Globe, Eye, ArrowRight } from "lucide-react";

export default function Home() {
  usePageTitle("MediSeam — Your records, everywhere you go.");

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
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
                What if your doctor already knew your story?
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-2xl md:text-3xl font-medium text-foreground/80 mb-8 max-w-2xl text-balance">
                Your records, everywhere you go.
              </motion.p>
              
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-12 max-w-3xl leading-relaxed text-balance">
                Every time you visit a new hospital you start from scratch. Your history stays behind. 
                MediSeam changes that. One secure health identity that follows you everywhere you go.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="text-base h-12 px-8" asChild>
                  <Link href="/contact">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base h-12 px-8" onClick={scrollToHowItWorks}>
                  See How It Works
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
                  they are there instantly — no paperwork, no repeating yourself.
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
        <section className="relative overflow-hidden bg-[hsl(174_21%_10%)] text-primary-foreground">
          {/* Soft radial wash */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, hsl(169 49% 33% / 0.35), transparent 70%)",
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
                <div className="flex items-start gap-3 md:gap-5 text-[15px]">
                  {"12,000".split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 0.7,
                        delay: 0.05 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="font-bold tracking-tighter text-[clamp(3rem,10vw,9rem)]"
                      style={{ display: "inline-block" }}
                    >
                      {ch}
                    </motion.span>
                  ))}
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
                className="flex-1 w-full aspect-square md:aspect-[4/3] bg-secondary rounded-3xl overflow-hidden relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Abstract graphic representation of hospital integration */}
                <div className="absolute inset-0 p-8 flex flex-col justify-center gap-6">
                  <div className="w-full h-1/3 bg-background rounded-2xl shadow-sm p-6 flex items-center justify-between opacity-80 translate-x-4">
                    <div className="h-4 w-1/3 bg-muted rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-accent/20"></div>
                  </div>
                  <div className="w-full h-1/3 bg-primary rounded-2xl shadow-md p-6 flex items-center justify-between z-10 transform -translate-x-4">
                    <div className="h-4 w-1/2 bg-primary-foreground/30 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-accent"></div>
                  </div>
                  <div className="w-full h-1/3 bg-background rounded-2xl shadow-sm p-6 flex items-center justify-between opacity-80 translate-x-4">
                    <div className="h-4 w-1/4 bg-muted rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-accent/20"></div>
                  </div>
                </div>
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
              <Button size="lg" className="text-lg h-14 px-10 rounded-full" asChild>
                <Link href="/contact">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
