import { Product, Review, BlogPost } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Set 1 - Hộp quà 60k',
    price: 60000,
    category: 'box',
    image: '/images/60k.jpg',
    description: 'Set quà 60k nhỏ gọn, có đủ thiệp và đồ xinh để tặng nhanh.',
    isBestSeller: true,
    tags: ['set', 'budget', '60k']
  },
  {
    id: '2',
    name: 'Set 2 - Hộp quà 80k',
    price: 80000,
    category: 'box',
    image: '/images/80k.jpg',
    description: 'Set 80k với phụ kiện và snack xinh xắn, phù hợp tặng bạn bè.',
    isBestSeller: true,
    tags: ['set', 'budget', '80k']
  },
  {
    id: '3',
    name: 'Set 3 - Hộp quà 100k',
    price: 100000,
    category: 'box',
    image: '/images/100k.jpg',
    description: 'Set 100k cân bằng đồ trang trí và bánh kẹo, tặng sinh nhật.',
    isBestSeller: false,
    tags: ['set', '100k', 'snack']
  },
  {
    id: '4',
    name: 'Set 4 - Hộp quà 120k',
    price: 120000,
    category: 'box',
    image: '/images/120k.jpg',
    description: 'Set 120k đủ đầy hơn, thích hợp dịp đặc biệt mà vẫn tiết kiệm.',
    isBestSeller: false,
    tags: ['set', '120k', 'giftbox']
  },
  {
    id: '5',
    name: 'Hoa gấu bông',
    price: 15000,
    category: 'bouquet',
    image: '/images/gaubong.jpg',
    description: 'Hoa hình gấu bông đáng yêu, phù hợp tặng người thương.',
    isBestSeller: true,
    tags: ['gấu bông', 'hoa', 'cute']
  }
];

export const REVIEWS: Review[] = [
  { id: '1', user: 'Lan Anh', rating: 5, comment: 'Quá đáng yêu! Đóng gói rất dễ thương.', date: '2023-10-01' },
  { id: '2', user: 'Minh Tuan', rating: 4, comment: 'Chất lượng tốt, giao hàng nhanh đến Bách Khoa.', date: '2023-10-05' },
  { id: '3', user: 'Thu Ha', rating: 5, comment: 'Bạn trai mình thích lắm hộp đồ ăn vặt!', date: '2023-10-12' },
];

export const BLOG_POSTS: BlogPost[] = [
  { id: '1', title: 'Top 5 Quà Tặng Cho Crush', excerpt: 'Đang đau đầu tìm món quà hoàn hảo? Đây là những lựa chọn hàng đầu của chúng tôi...', image: 'https://picsum.photos/seed/blog1/600/300', date: 'Oct 15' },
  { id: '2', title: 'Hướng Dẫn Gói Quà DIY', excerpt: 'Cách gói quà của bạn để trông như đến từ chuyên gia.', image: 'https://picsum.photos/seed/blog2/600/300', date: 'Oct 10' },
];
