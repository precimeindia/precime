import ContactForm from "@/components/public/ContactForm";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Get Started | Precious Metals India",
  description: "Contact us to get started with precious metals trading and valuation in India.",
};

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Precious Metals India Logo"
                width={38}
                height={38}
                className="rounded-full"
                priority
              />
              <div>
                <h1 className="text-lg font-bold text-gold-gradient leading-none">Precious Metals India</h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 py-12 relative overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-[#d4af37] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4 text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5 text-xs font-normal tracking-wide">
              Connect With Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              <span className="text-gold-gradient">Get Started</span>
            </h2>
            <p className="text-muted-foreground text-sm">
              Please enter your details below. An expert from our team will reach out to you shortly.
            </p>
          </div>

          <div className="bg-card/30 border border-border/50 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl shadow-[#d4af37]/5 relative overflow-hidden">
            {/* Subtle inner border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
            
            <ContactForm />
          </div>

        </div>
      </main>
    </div>
  );
}
