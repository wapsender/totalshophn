import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {currentYear} TotalShop.HN. Todos los derechos reservados.</p>
        <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2 inline-block">
          Panel de Administrador
        </Link>
      </div>
    </footer>
  );
}
