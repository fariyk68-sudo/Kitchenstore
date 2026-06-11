export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  wishlist?: string[];
  addresses?: string[];
  createdAt: string;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  stockQuantity: number;
  sku: string;
  ratings?: number;
  reviewsCount?: number;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  orderId: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  customerPhone?: string;
  city?: string;
  orderedProducts?: OrderItem[];
  quantity?: number;
  orderDate?: string;
  orderStatus?: string;
  cancelledBy?: 'Customer' | 'Admin';
}

export interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface SalesStat {
  date: string;
  sales: number;
  orders: number;
}
