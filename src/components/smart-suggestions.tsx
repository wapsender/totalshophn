'use client';

import { useEffect, useState, useTransition } from 'react';
import { useCart } from '@/contexts/cart-context';
import { getSuggestions } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';

export default function SmartSuggestions() {
  const { items } = useCart();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (items.length > 0) {
      const itemNames = items.map(item => item.name);
      startTransition(async () => {
        const result = await getSuggestions(itemNames);
        setSuggestions(result);
      });
    } else {
      setSuggestions([]);
    }
  }, [items]);

  if (isPending) {
    return (
      <div className="space-y-2 rounded-lg border border-dashed border-primary/50 bg-primary/10 p-4">
        <h4 className="flex items-center font-semibold text-primary">
          <Lightbulb className="mr-2 h-5 w-5" />
          Buscando recomendaciones...
        </h4>
        <div className="space-y-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-dashed border-primary/50 bg-primary/10 p-4">
      <h4 className="mb-2 flex items-center font-semibold text-primary">
        <Lightbulb className="mr-2 h-5 w-5" />
        También podría gustarte...
      </h4>
      <ul className="list-disc list-inside text-sm text-primary/80">
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  );
}
