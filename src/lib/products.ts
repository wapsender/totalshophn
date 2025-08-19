import type { Product, Coupon, ProductStock, Category, AppSettings } from '@/types';

export let products: Product[] = [
  {
    id: '1',
    name: 'Servicio de Streaming - 1 Mes',
    description: 'Acceso a miles de películas y series. Plan premium.',
    price: 15.99,
    offerPrice: 13.99,
    resellerPrice: 12.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'television screen',
    category: 'Streaming',
    stock: [
        { type: 'credentials', value: 'user1@email.com:pass123', credentials: { email: 'user1@email.com', password: 'pass123'}, isSold: false },
        { type: 'credentials', value: 'user2@email.com:pass123', credentials: { email: 'user2@email.com', password: 'pass123'}, isSold: false },
    ]
  },
  {
    id: '2',
    name: 'Licencia de Windows Pro',
    description: 'Clave de licencia genuina para Windows 11 Professional.',
    price: 49.99,
    resellerPrice: 39.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'software interface',
    category: 'Software',
    stock: [
        { type: 'code', value: 'WINPRO-AAAA-BBBB-CCCC-DDDD', isSold: false },
        { type: 'code', value: 'WINPRO-EEEE-FFFF-GGGG-HHHH', isSold: false },
    ]
  },
  {
    id: '3',
    name: 'Software Antivirus - 1 Año',
    description: 'Protección completa para tu PC contra virus y malware.',
    price: 29.99,
    resellerPrice: 24.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'security shield',
    category: 'Seguridad',
    stock: []
  },
  {
    id: '4',
    name: 'Servicio VPN - 1 Año',
    description: 'Acceso a internet seguro y privado en todos tus dispositivos.',
    price: 39.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'network connection',
    category: 'Seguridad',
    stock: []
  },
  {
    id: '5',
    name: 'Streaming de Música - 3 Meses',
    description: 'Música sin anuncios con saltos ilimitados y escucha sin conexión.',
    price: 24.99,
    resellerPrice: 19.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'headphones audio',
    category: 'Streaming',
    stock: []
  },
  {
    id: '6',
    name: 'Suite de Oficina Pro',
    description: 'Suite completa de herramientas de productividad para documentos y hojas de cálculo.',
    price: 79.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'document icon',
    category: 'Software',
    stock: []
  },
  {
    id: '7',
    name: 'Almacenamiento en la Nube - Plan 1TB',
    description: '1TB de almacenamiento seguro en la nube para tus archivos y fotos.',
    price: 9.99,
    resellerPrice: 7.99,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'cloud data',
    category: 'Servicios',
    stock: []
  },
  {
    id: '8',
    name: 'Software de Diseño Gráfico',
    description: 'Herramienta profesional para edición de fotos y diseño gráfico.',
    price: 150.0,
    offerPrice: 135.0,
    resellerPrice: 125.0,
    image: 'https://placehold.co/400x300.png',
    imageHint: 'design tools',
    category: 'Software',
    stock: []
  },
];


export const faqs = [
  {
    question: '¿Cómo recibo mi producto digital?',
    answer: 'Una vez confirmado el pago, tu producto digital (p. ej., clave de licencia, detalles de la cuenta) se te entregará al instante. Si eres un usuario registrado, tus códigos y credenciales comprados aparecerán en tu panel de control. Si haces un pedido por WhatsApp, te lo enviaremos por ese medio.',
  },
  {
    question: '¿Son genuinas estas licencias?',
    answer: 'Sí, todas nuestras licencias de software y cuentas de servicio son 100% genuinas y provienen de distribuidores autorizados. Puedes usarlas con total confianza.',
  },
  {
    question: '¿Cuál es su política de reembolso?',
    answer: 'Debido a la naturaleza de los productos digitales, todas las ventas son finales. Sin embargo, si encuentras algún problema con tu producto, como una clave no válida, contacta a nuestro soporte y te proporcionaremos un reemplazo de inmediato.',
  },
  {
    question: '¿Cuánto tarda la entrega?',
    answer: 'La entrega es casi instantánea. Para usuarios registrados que pagan con saldo, el producto aparece en su panel de control inmediatamente. Para pedidos de WhatsApp, deberías recibir tu producto en 5-10 minutos después de procesar tu pedido.',
  },
];

export let coupons: Coupon[] = [
  { id: '1', code: 'SAVE10', discountType: 'percentage', value: 10, quantity: 20, uses: 5 },
  { id: '2', code: 'HNSPECIAL', discountType: 'fixed', value: 5, quantity: 10, uses: 2 },
];

export let categories: Category[] = [
    { id: '1', name: 'Streaming' },
    { id: '2', name: 'Software' },
    { id: '3', name: 'Seguridad' },
    { id: '4', name: 'Servicios' },
];

let appSettings: AppSettings = {
    whatsappNumber: '123456789',
};

// Getter to access the latest settings
export const getAppSettings = (): AppSettings => {
    return appSettings;
}

export const updateAppSettings = (newSettings: AppSettings): AppSettings => {
    appSettings = { ...newSettings };
    return appSettings;
}


export const addProduct = (product: Product): Product[] => {
  products = [{...product, id: String(Date.now())}, ...products];
  return products;
};

export const updateProduct = (updatedProduct: Product): Product[] => {
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    if(productIndex !== -1) {
        products[productIndex] = updatedProduct;
    }
    return products;
};

export const deleteProduct = (productId: string): Product[] => {
    products = products.filter(p => p.id !== productId);
    return products;
};

export const addCoupon = (coupon: Omit<Coupon, 'id' | 'uses'>): Coupon[] => {
  const newCoupon = { ...coupon, id: String(Date.now()), uses: 0 };
  coupons = [newCoupon, ...coupons];
  return coupons;
};

export const updateCoupon = (updatedCoupon: Coupon): Coupon[] => {
    const couponIndex = coupons.findIndex(c => c.id === updatedCoupon.id);
    if(couponIndex !== -1) {
        coupons[couponIndex] = updatedCoupon;
    }
    return coupons;
};

export const deleteCoupon = (couponId: string): Coupon[] => {
    coupons = coupons.filter(c => c.id !== couponId);
    return coupons;
};


export const addCategory = (category: Category): Category[] => {
    categories = [...categories, category];
    return categories;
};

export const deleteCategory = (categoryId: string): Category[] => {
    categories = categories.filter(c => c.id !== categoryId);
    return categories;
};

export const addStock = (productId: string, codes: string[]): Product | null => {
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) return null;

    const newStock: ProductStock[] = codes.map(code => {
        if (code.includes(':')) {
            const [email, password] = code.split(':');
            return { type: 'credentials', value: code, credentials: { email, password }, isSold: false };
        }
        return { type: 'code', value: code, isSold: false };
    });

    if (!products[productIndex].stock) {
        products[productIndex].stock = [];
    }

    products[productIndex].stock!.push(...newStock);
    return products[productIndex];
}
