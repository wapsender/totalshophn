'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ShoppingCart, Tag, CreditCard, AlertTriangle, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import SmartSuggestions from './smart-suggestions';
import { useState } from 'react';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { purchaseWithBalance } from '@/lib/users';
import Link from 'next/link';
import { getAppSettings } from '@/lib/products';

interface CartSheetProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ children, open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, clearCart, applyCoupon, discountValue, appliedCoupon, totalPrice } = useCart();
  const { user, userProfile } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const appSettings = getAppSettings();

  const subtotal = items.reduce((total, item) => total + item.appliedPrice * item.quantity, 0);
  
  const handleWhatsAppOrder = () => {
    let message = `¡Hola! 👋 Me gustaría ordenar los siguientes servicios:\n\n${items
      .map(item => `- ${item.name} (L${item.appliedPrice.toFixed(2)})`)
      .join('\n')}`;

    if (discountValue > 0) {
      message += `\n\nSubtotal: L${subtotal.toFixed(2)}`;
      message += `\nDescuento: -L${discountValue.toFixed(2)}`;
    }
    
    message += `\n\n*Total: L${totalPrice.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/${appSettings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponCode);
    if(result.success) {
       toast({
        title: '¡Cupón Aplicado!',
        description: result.message,
      });
    } else {
       toast({
        variant: 'destructive',
        title: 'Cupón Inválido',
        description: result.message,
      });
    }
  };

  const handlePurchaseWithBalance = async () => {
    if (!user) return;
    setIsProcessing(true);

    try {
      const result = await purchaseWithBalance(user.uid, items, appliedCoupon);
      if (result.success) {
        toast({
          title: '¡Compra Exitosa!',
          description: 'Tus nuevos productos están disponibles en tu panel.',
        });
        clearCart();
        onOpenChange(false); // Close the sheet
      } else {
        toast({
          variant: 'destructive',
          title: 'Compra Fallida',
          description: result.message,
        });
      }
    } catch (error: any) {
       toast({
          variant: 'destructive',
          title: 'Ocurrió un Error',
          description: error.message || 'Algo salió mal.',
        });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPurchaseButton = () => {
    if(!user || !userProfile) {
      return (
         <Button variant="accent" size="lg" className="w-full text-lg" onClick={handleWhatsAppOrder}>
            <MessageCircle className="mr-2 h-6 w-6"/> Ordenar por WhatsApp
          </Button>
      );
    }

    const userBalance = userProfile.balance;
    if(totalPrice > userBalance) {
      return (
        <div className='w-full'>
          <Button size="lg" className="w-full text-lg" disabled>
              <AlertTriangle className='mr-2'/> Saldo Insuficiente
          </Button>
          <p className="text-center text-sm mt-2 text-muted-foreground">
            Necesitas L{totalPrice.toFixed(2)} pero tienes L{userBalance.toFixed(2)}. <Link href="/dashboard" className='underline' onClick={() => onOpenChange(false)}>¿Recargar?</Link>
          </p>
        </div>
      )
    }

    return (
      <Button size="lg" className="w-full text-lg" onClick={handlePurchaseWithBalance} disabled={isProcessing}>
        {isProcessing ? 'Procesando...' : <><CreditCard className="mr-2 h-6 w-6"/> Pagar con Saldo</>}
      </Button>
    )

  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children}
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="font-headline text-2xl">Tu Carrito</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4 p-6 pr-6">
              {items.length > 0 ? (
                items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md border"
                      data-ai-hint={item.imageHint}
                    />
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">L{item.appliedPrice.toFixed(2)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <p className="text-xl font-semibold">Tu carrito está vacío</p>
                  <p className="text-muted-foreground">¡Añade algunos servicios para empezar!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        {items.length > 0 && (
          <>
            <div className="px-6 pb-4">
               <SmartSuggestions />
            </div>
            <div className="px-6 pb-4 border-t pt-4">
              <h4 className="font-semibold mb-2 flex items-center"><Tag className="mr-2 h-5 w-5"/> Código de Cupón</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="Ingresar cupón"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="uppercase"
                />
                <Button onClick={handleApplyCoupon}>Aplicar</Button>
              </div>
            </div>
            <SheetFooter className="bg-secondary/50 p-6">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-md">
                  <span>Subtotal</span>
                  <span>L{subtotal.toFixed(2)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-md text-accent">
                    <span>Descuento</span>
                    <span>-L{discountValue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>L{totalPrice.toFixed(2)}</span>
                </div>
                {renderPurchaseButton()}
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Limpiar Carrito
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
