'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/cart-sheet';
import { useState } from 'react';

export default function CartIcon() {
  const { items } = useCart();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartSheet open={isSheetOpen} onOpenChange={setSheetOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={`Open shopping cart with ${totalItems} items`}
        onClick={() => setSheetOpen(true)}
      >
        <ShoppingCart />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {totalItems}
          </span>
        )}
      </Button>
    </CartSheet>
  );
}
