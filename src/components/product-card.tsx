'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types';
import { PlusCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onCardClick: (product: Product) => void;
}

export default function ProductCard({ product, onCardClick }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  const isSoldOut = product.stock ? product.stock.filter(s => !s.isSold).length === 0 : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents the modal from opening
    if (isSoldOut) return;

    addItem(product);
    toast({
      title: '¡Añadido al carrito!',
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  // Determine the price to display based on user role and offers
  const getDisplayPrice = () => {
    if (product.offerPrice) {
      return product.offerPrice;
    }
    if (userProfile?.role === 'reseller' && product.resellerPrice) {
      return product.resellerPrice;
    }
    return product.price;
  };
  const displayPrice = getDisplayPrice();
  
  const getOriginalPrice = () => {
    if(product.offerPrice || (userProfile?.role === 'reseller' && product.resellerPrice)) {
      return product.price;
    }
    return null;
  }
  const originalPrice = getOriginalPrice();


  return (
    <Card 
      className="flex flex-col overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl cursor-pointer"
      onClick={() => onCardClick(product)}
    >
      <CardHeader className="p-0 relative">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className={`object-cover w-full h-48 ${isSoldOut ? 'grayscale' : ''}`}
          data-ai-hint={product.imageHint}
        />
        {product.offerPrice && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white hover:bg-red-600 flex items-center gap-1">
                <Star className='w-3 h-3' /> OFERTA
            </Badge>
        )}
        {userProfile?.role === 'reseller' && product.resellerPrice && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black hover:bg-yellow-500">
                RESELLER
            </Badge>
        )}
         {isSoldOut && (
            <Badge variant="destructive" className="absolute top-2 right-2">
                AGOTADO
            </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-xl font-bold">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 bg-secondary/30">
        <div className='flex flex-col'>
            {originalPrice && (
                <p className="text-sm font-light text-muted-foreground line-through">
                    L{originalPrice.toFixed(2)}
                </p>
            )}
            <p className="text-2xl font-extrabold text-accent">L{displayPrice.toFixed(2)}</p>
        </div>
        <Button onClick={handleAddToCart} disabled={isSoldOut}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Añadir
        </Button>
      </CardFooter>
    </Card>
  );
}
