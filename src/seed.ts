import { Product, Category } from './types';

export const SEED_CATEGORIES: Category[] = [
  {
    categoryId: 'cat_appliances',
    name: 'Smart Appliances',
    slug: 'smart-appliances',
    description: 'Intelligent high-efficiency kitchen electronics designed to save time and raise cooking precision.',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80'
  },
  {
    categoryId: 'cat_cookware',
    name: 'Chef Cookware',
    slug: 'chef-cookware',
    description: 'Professional grade pots, pans, and skillets providing even heat distribution and durability.',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
  },
  {
    categoryId: 'cat_tools',
    name: 'Precision Tools',
    slug: 'precision-tools',
    description: 'Laser-focused thermometers, professional-grade cutlery, and timers for the meticulous cook.',
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80'
  },
  {
    categoryId: 'cat_storage',
    name: 'Storage Systems',
    slug: 'storage-systems',
    description: 'Eco-friendly, modular airtight preservation solutions that keep ingredients freshly optimized.',
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80'
  }
];

export const SEED_PRODUCTS: Omit<Product, 'createdAt' | 'updatedAt'>[] = [
  {
    productId: 'prod_smart_kettle',
    name: 'Aero Temp Digital Smart Kettle',
    description: 'Precision temperature-controlled kettle with active temperature presets for Oolong, Pour-Over Coffee, Matcha, and English Breakfast. Keeps water hot for up to an hour with silent vacuum double-wall insulation.',
    price: 2400,
    salePrice: 1950,
    category: 'Smart Appliances',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1594911774802-8822a707cff3?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 18,
    sku: 'KIT-SMR-KET-01',
    ratings: 4.8,
    reviewsCount: 15,
    status: 'active'
  },
  {
    productId: 'prod_dutch_oven',
    name: 'Epicure Cast Iron Dutch Oven, 5.5 Qt',
    description: 'Heavy duty premium enameled cast iron. Features self-basting condensation spikes in the lid, continuous thermal circulation, and an ultra-durable easy-clean interior. Compatible with induction, gas, and electric ovens.',
    price: 2800,
    category: 'Chef Cookware',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 24,
    sku: 'KIT-COK-DTC-05',
    ratings: 4.9,
    reviewsCount: 32,
    status: 'active'
  },
  {
    productId: 'prod_chef_knife',
    name: 'Precision Cryo-Tempered Damascus Chef Knife',
    description: '67-layer Damascus steel blade with razor-sharp 12-degree hand-polished edge. Cryo-tempered for maximum hardness and edge retention, fitted with a custom ergonomic handle.',
    price: 2100,
    salePrice: 1750,
    category: 'Precision Tools',
    images: [
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 12,
    sku: 'KIT-TLS-DKN-08',
    ratings: 4.7,
    reviewsCount: 8,
    status: 'active'
  },
  {
    productId: 'prod_vacuum_sealer',
    name: 'PreserveMax Modular Vacuum Sealer',
    description: 'Airtight dynamic preservation unit with pulse-controlled seal pressure. Features wet and dry food modes, an integrated bag roll cutter, and a lightweight sleek profile that fits perfectly on workspace counters.',
    price: 1850,
    category: 'Storage Systems',
    images: [
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 42,
    sku: 'KIT-STR-VAC-02',
    ratings: 4.5,
    reviewsCount: 20,
    status: 'active'
  },
  {
    productId: 'prod_smart_scale',
    name: 'ScaleSync Pro Wireless Food Scale',
    description: 'Intelligent kitchen scale displaying accurate nutritional content, calories, and macro-elements synchronously on its OLED panel. Fully rechargeable with a beautiful tempered glass touch-sensitive surface.',
    price: 1300,
    category: 'Smart Appliances',
    images: [
      'https://images.unsplash.com/photo-1594911774802-8822a707cff3?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 30,
    sku: 'KIT-SMR-SCL-04',
    ratings: 4.6,
    reviewsCount: 12,
    status: 'active'
  },
  {
    productId: 'prod_pan_set',
    name: 'Searing Copper Core Tri-Ply Skillet',
    description: 'Heavy gauge copper core bonded between pristine aluminum and 18/10 restaurant stainless steel. Ideal for perfect high-temperature searing, pan-frying, and baking. Induction compatible design.',
    price: 3000,
    salePrice: 2600,
    category: 'Chef Cookware',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80'
    ],
    stockQuantity: 15,
    sku: 'KIT-COK-SKL-10',
    ratings: 4.7,
    reviewsCount: 14,
    status: 'active'
  }
];
