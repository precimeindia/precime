'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      setName('');
      setPhone('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-[#d4af37]/30 bg-card/50 p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-[#d4af37]/10 text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Request Received</h3>
        <p className="text-sm text-muted-foreground">Thank you! An expert will contact you shortly.</p>
        <Button 
          variant="outline" 
          onClick={() => setStatus('idle')}
          className="mt-6 text-xs"
        >
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full animate-in fade-in duration-500">
      <div className="space-y-3">
        <div>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSubmitting}
            className="bg-background border-border/50 focus-visible:ring-[#d4af37]/50"
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isSubmitting}
            className="bg-background border-border/50 focus-visible:ring-[#d4af37]/50"
          />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-500 font-medium">Something went wrong. Please try again later.</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2 rounded-full px-6 bg-[#d4af37] hover:bg-[#c5a030] text-black transition-all font-semibold"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
        ) : (
          "Get Started Now"
        )}
      </Button>
    </form>
  );
}
