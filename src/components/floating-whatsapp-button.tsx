'use client';

import { Button } from '@/components/ui/button';
import { getAppSettings } from '@/lib/products';
import Link from 'next/link';

// Simple SVG for WhatsApp icon to avoid adding a new library
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);


export default function FloatingWhatsAppButton() {
    const appSettings = getAppSettings();
    const message = "Hola, necesito más información.";
    const whatsappUrl = `https://wa.me/${appSettings.whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Button
            asChild
            size="icon"
            className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600"
            aria-label="Contactar por WhatsApp"
        >
            <Link href={whatsappUrl} target="_blank">
                <WhatsAppIcon className="h-8 w-8" />
            </Link>
        </Button>
    )
}
