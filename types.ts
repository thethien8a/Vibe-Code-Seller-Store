export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'box' | 'bouquet' | 'custom' | 'set';
  image: string;
  description: string;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  note?: string; // For customization details
}

export type ViewState =
  | 'home'
  | 'shop'
  | 'about'
  | 'blog'
  | 'contact'
  | 'checkout'
  | 'product-detail'
  | 'shipping-policy'
  | 'returns'
  | 'faq';

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}
