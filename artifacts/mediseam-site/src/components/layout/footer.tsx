import { Link } from "wouter";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary-foreground text-primary-foreground py-10 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Link href="/" className="flex flex-col items-center md:items-start gap-2 mb-6">
              <img src="/Logo-2.png" alt="MediSeam Healthcare Limited logo." className="h-14 md:h-20 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-primary-foreground/70 text-lg max-w-sm mb-8 text-center md:text-left mx-auto md:mx-0">
              Your records everywhere you go.
            </p>
            
            <div className="flex flex-col items-center md:items-start space-y-4">
              <a href="tel:0741991213" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors">
                <Phone className="h-5 w-5 text-accent" />
                <span>0741991213</span>
              </a>
              <a href="mailto:info@mediseam.com" className="flex items-center gap-3 text-primary-foreground/80 hover:text-accent transition-colors">
                <Mail className="h-5 w-5 text-accent" />
                <span>info@mediseam.com</span>
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-semibold text-primary-foreground mb-6">Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-foreground mb-6">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </footer>
  );
}

