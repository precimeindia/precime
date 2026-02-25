"use client";

import { ExternalLink } from "lucide-react";

interface BlogLink { id: string; title: string; url: string; order: number }
interface Props { blogLinks: BlogLink[] }

export default function BlogLinks({ blogLinks }: Props) {
  if (!blogLinks.length) return (
    <p className="text-muted-foreground text-sm">No blog posts yet.</p>
  );
  return (
    <div className="grid gap-4">
      {blogLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-[#d4af37]/30 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#d4af37]/20 transition-colors">
            <span className="text-[#d4af37] text-lg">📰</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug">
              {link.title}
            </p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{link.url}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[#d4af37] flex-shrink-0 mt-0.5 transition-colors" />
        </a>
      ))}
    </div>
  );
}
