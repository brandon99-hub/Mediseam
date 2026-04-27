import { Link, useLocation } from "wouter";
import { Home, CreditCard, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function FloatingNav() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/pricing", label: "Pricing", icon: CreditCard },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];

  return (
    <div className="md:hidden fixed bottom-8 inset-x-0 z-[100] flex justify-center px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-10"
      >
        {navLinks.map((link) => {
          const isActive = location === link.href;
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href}>
              <div className={cn(
                "relative flex flex-col items-center justify-center min-w-[56px] min-h-[56px] px-2 py-3 rounded-full transition-all duration-300 shadow-xl border border-white/10",
                isActive 
                  ? "bg-primary text-primary-foreground scale-110 shadow-primary/20" 
                  : "bg-background/40 backdrop-blur-xl text-muted-foreground hover:bg-background/60"
              )}>
                <Icon className={cn("h-5 w-5 mb-1", isActive ? "animate-in zoom-in-90 duration-300" : "")} />
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-tighter transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {link.label}
                </span>
              </div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
