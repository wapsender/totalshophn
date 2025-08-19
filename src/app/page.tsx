'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { products, faqs, categories, getAppSettings } from '@/lib/products';
import ProductCard from '@/components/product-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import type { Product } from '@/types';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAuth } from '@/contexts/auth-context';


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const appSettings = getAppSettings();


  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;
    
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleAddToCartFromModal = (product: Product) => {
    if (!product || isProductSoldOut(product)) return;
    addItem(product);
    toast({
      title: '¡Añadido al carrito!',
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
    setSelectedProduct(null); // Close modal after adding
  };
  
  const bestSellers = products.slice(0, 4);

  const getDisplayPrice = (product: Product | null) => {
    if (!product) return 0;
    if (product.offerPrice) {
      return product.offerPrice;
    }
    return userProfile?.role === 'reseller' && product.resellerPrice 
      ? product.resellerPrice 
      : product.price;
  };

  const getOriginalPrice = (product: Product | null) => {
    if (!product) return null;
    if (product.offerPrice || (userProfile?.role === 'reseller' && product.resellerPrice)) {
      return product.price;
    }
    return null;
  }
  
  const isProductSoldOut = (product: Product | null): boolean => {
    if (!product) return true;
    return product.stock ? product.stock.filter(s => !s.isSold).length === 0 : false;
  }


  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <section className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 font-headline">
          <span className="text-blue-500 [text-shadow:0_0_12px_theme(colors.blue.500)]">Total</span>
          <span className="text-yellow-400 [text-shadow:0_0_12px_theme(colors.yellow.400)]">Shop</span>
          <span className="text-red-500 [text-shadow:0_0_12px_theme(colors.red.500)]">.</span>
          <span className="text-yellow-400 [text-shadow:0_0_12px_theme(colors.yellow.400)]">.HN</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Tu tienda única para servicios digitales. Entrega instantánea, precios imbatibles.
        </p>
      </section>

      <section id="products" className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 font-headline">Nuestros Servicios</h2>
        
        <div className="flex justify-center flex-wrap gap-2 mb-10">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onCardClick={handleProductClick} />
          ))}
        </div>
         {filteredProducts.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No hay productos en esta categoría.
          </p>
        )}
      </section>
      
       <section id="best-sellers" className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-headline">Los Más Vendidos</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {bestSellers.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                   <ProductCard product={product} onCardClick={handleProductClick} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </section>

      <section id="faq" className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 font-headline">Preguntas Frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      
      {selectedProduct && (
        <Dialog open={selectedProduct !== null} onOpenChange={() => setSelectedProduct(null)}>
            <DialogContent className="sm:max-w-md md:max-w-2xl flex flex-col max-h-[90vh]">
                <DialogHeader className="p-0 flex-shrink-0">
                     <Image 
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        width={800}
                        height={600}
                        className={`w-full h-auto max-h-64 object-cover rounded-t-lg ${isProductSoldOut(selectedProduct) ? 'grayscale': ''}`}
                        data-ai-hint={selectedProduct.imageHint}
                    />
                </DialogHeader>
                <div className="p-6 pt-4 flex-grow overflow-y-auto">
                  <DialogTitle className="text-3xl font-bold">{selectedProduct.name}</DialogTitle>
                   <ScrollArea className="h-32 pr-4 mt-2">
                        <DialogDescription className="text-base whitespace-pre-wrap">
                            {selectedProduct.description}
                        </DialogDescription>
                   </ScrollArea>
                </div>
                <DialogFooter className="p-6 pt-0 flex-col md:flex-row md:items-center justify-between w-full flex-shrink-0">
                    <div className='flex flex-col'>
                      {getOriginalPrice(selectedProduct) && (
                          <p className="text-lg font-light text-muted-foreground line-through">
                              L{getOriginalPrice(selectedProduct)?.toFixed(2)}
                          </p>
                      )}
                      <p className="text-3xl font-extrabold text-primary">L{getDisplayPrice(selectedProduct).toFixed(2)}</p>
                    </div>
                    <Button onClick={() => handleAddToCartFromModal(selectedProduct)} size="lg" disabled={isProductSoldOut(selectedProduct)}>
                        <PlusCircle className="mr-2 h-5 w-5" />
                         {isProductSoldOut(selectedProduct) ? 'Agotado' : 'Añadir al Carrito'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
