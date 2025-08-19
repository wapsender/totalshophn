import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/contexts/cart-context';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/footer';
import { AuthProvider } from '@/contexts/auth-context';
import FloatingWhatsAppButton from '@/components/floating-whatsapp-button';

export const metadata: Metadata = {
  title: 'TotalShop.HN - Tu Tienda de Servicios Digitales',
  description: 'El mejor lugar para comprar servicios digitales como cuentas de streaming, software y más.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <FloatingWhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
