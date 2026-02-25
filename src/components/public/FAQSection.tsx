"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ { id: string; question: string; answer: string; order: number }

interface Props { faqs: FAQ[] }

export default function FAQSection({ faqs }: Props) {
  if (!faqs.length) return null;
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          className="border border-border/50 rounded-xl px-4 bg-card/30 hover:bg-card/50 transition-colors"
        >
          <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
