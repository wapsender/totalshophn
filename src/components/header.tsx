'use client';

import Link from 'next/link';
import { ShoppingBag, Shield, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import CartIcon from './cart-icon';
import { useAuth } from '@/contexts/auth-context';
import { Button } from './ui/button';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShoppingBag className="h-7 w-7 text-primary" />
           <h1 className="text-xl font-bold tracking-tight font-headline">
            <span className="text-blue-500 [text-shadow:0_0_8px_theme(colors.blue.500)]">Total</span>
            <span className="text-yellow-400 [text-shadow:0_0_8px_theme(colors.yellow.400)]">Shop</span>
            <span className="text-red-500 [text-shadow:0_0_8px_theme(colors.red.500)]">.</span>
            <span className="text-yellow-400 [text-shadow:0_0_8px_theme(colors.yellow.400)]">HN</span>
          </h1>
        </Link>
        <nav className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/#products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Servicios
            </Link>
          </Button>
           <Button variant="ghost" asChild>
            <Link href="/admin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1">
              <Shield size={16} />
              <span className="hidden md:inline">Admin</span>
            </Link>
          </Button>

          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard" className="text-sm font-medium">
                  <LayoutDashboard size={16} />
                  <span className="hidden md:inline ml-1">Mi Panel</span>
                </Link>
              </Button>
              <Button variant="ghost" onClick={logout}>
                <LogOut size={16} />
                 <span className="hidden md:inline ml-1">Cerrar Sesión</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" asChild>
                <Link href="/login" className="text-sm font-medium">
                  <LogIn size={16} />
                   <span className="hidden md:inline ml-1">Entrar</span>
                </Link>
              </Button>
            </>
          )}

          <CartIcon />
        </nav>
      </div>
    </header>
  );
}
