"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16 py-10 bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-black font-bold text-xs">PM</div>
              <span className="font-bold text-foreground">Precious Metals India</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Daily precious metal ratios relative to copper for Indian investors and researchers. Data updated daily before 10:00 AM IST.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="/#faq" className="hover:text-[#d4af37] transition-colors">FAQ</a></li>
              <li><a href="https://precime.com/blog" className="hover:text-[#d4af37] transition-colors">Blog</a></li>
              <li><a href="https://precime.com/contact" className="hover:text-[#d4af37] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Domains</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>precime.com</li>
              <li>precime.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/30 pt-6">
          <p className="text-xs text-muted-foreground/60 leading-relaxed text-center max-w-3xl mx-auto">
            <strong className="text-muted-foreground">Disclaimer:</strong> The metal-to-copper ratios published on this website are for informational and educational purposes only.
            They do not constitute financial, investment, or trading advice. Precious Metals India is not a licensed financial advisor.
            Always consult a qualified financial professional before making investment decisions. Market data may be delayed or approximate.
          </p>
          <p className="text-xs text-muted-foreground/40 text-center mt-4">
            © {new Date().getFullYear()} Precious Metals India. All rights reserved. · precime.com · precime.in
          </p>
        </div>
      </div>
    </footer>
  );
}
