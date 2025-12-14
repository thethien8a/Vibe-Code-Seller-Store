import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Menu, X, Heart, Star, MapPin, Phone, Mail, Facebook, ArrowRight, Truck, CheckCircle, Clock, ChevronDown, ExternalLink } from 'lucide-react';
import { Product, CartItem, ViewState } from './types';
import { PRODUCTS, BLOG_POSTS, REVIEWS } from './constants';
import { ProductCard } from './components/ProductCard';
import { Button } from './components/Button';
import { FloatingFeatures } from './components/FloatingFeatures';

// Custom Threads Icon Component
const ThreadsIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="currentColor"
    className={className}
  >
    <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
  </svg>
);

const PARTNERS = [
  {
    name: 'Sunny Bunny',
    href: 'https://sunnybunny.store/',
    imageSrc: '/images/doi-tac-1.jpg',
    domain: 'sunnybunny.store',
  },
  {
    name: 'Moimoifruit – Mix vị ưng – Fresh quá chừng',
    href: 'https://moimoifruit.store/',
    imageSrc: '/images/doi-tac-2.jpg',
    domain: 'moimoifruit.store',
  },
  {
    name: 'socketzone.store – Home Decor',
    href: 'https://socketzone.store/',
    imageSrc: '/images/doi-tac-3.jpg',
    domain: 'socketzone.store',
  },
] as const;

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPartnersOpen, setIsPartnersOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | null>(null);
  const [checkoutStep, setCheckoutStep] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, filterCategory, filterMaxPrice]);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Navigation Components
  const NavLink = ({ to, children }: { to: ViewState, children: React.ReactNode }) => (
    <button 
      onClick={() => { setView(to); setIsMobileMenuOpen(false); setIsPartnersOpen(false); }}
      className={`font-semibold hover:text-primary-500 transition-colors ${view === to ? 'text-primary-600' : 'text-gray-600'}`}
    >
      {children}
    </button>
  );

  // VIEWS
  const HomeView = () => {
    const heroRef = useRef<HTMLElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const latestPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
      return () => {
        if (rafRef.current !== null) {
          window.cancelAnimationFrame(rafRef.current);
        }
      };
    }, []);

    const applyHeroFx = () => {
      rafRef.current = null;
      const el = heroRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = latestPointerRef.current.x - rect.left;
      const y = latestPointerRef.current.y - rect.top;

      const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
      const xPercent = clamp((x / rect.width) * 100, 0, 100);
      const yPercent = clamp((y / rect.height) * 100, 0, 100);

      el.style.setProperty('--spot-x', `${xPercent}%`);
      el.style.setProperty('--spot-y', `${yPercent}%`);
      el.style.setProperty('--spot-opacity', '1');

      const parallaxX = ((x / rect.width) - 0.5) * 18;
      const parallaxY = ((y / rect.height) - 0.5) * 18;

      el.style.setProperty('--parallax-x', `${parallaxX.toFixed(2)}px`);
      el.style.setProperty('--parallax-y', `${parallaxY.toFixed(2)}px`);
    };

    const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;

      latestPointerRef.current = { x: e.clientX, y: e.clientY };

      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(applyHeroFx);
    };

    const handleHeroPointerLeave = () => {
      const el = heroRef.current;
      if (!el) return;

      el.style.setProperty('--spot-opacity', '0');
      el.style.setProperty('--spot-x', '50%');
      el.style.setProperty('--spot-y', '50%');
      el.style.setProperty('--parallax-x', '0px');
      el.style.setProperty('--parallax-y', '0px');
    };

    return (
      <div className="space-y-16 pb-20">
        {/* Hero */}
        <section
          ref={heroRef}
          onPointerEnter={handleHeroPointerMove}
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
          className="relative h-[600px] flex items-center bg-[#fce7f3] overflow-hidden hero-interactive"
        >
          <div className="absolute inset-0 hero-photo bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/90 to-transparent pointer-events-none"></div>

          {/* Background effects (see index.css) */}
          <div className="absolute inset-0 hero-mesh pointer-events-none"></div>
          <div className="absolute inset-0 hero-shine pointer-events-none"></div>
          <div className="hero-blob hero-blob--a"></div>
          <div className="hero-blob hero-blob--b"></div>
          <div className="hero-blob hero-blob--c"></div>
          <div className="absolute inset-0 hero-spotlight pointer-events-none"></div>
          
          <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-primary-600 font-bold text-sm tracking-widest uppercase shadow-sm">
                boxie gift
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Quà xinh <span className="text-primary-600">tâm tình</span> hết ý
              </h1>
              <p className="text-lg text-gray-700 max-w-lg">
                Mang lại cho bạn những hộp quà ý nghĩa nhất
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setView('shop')} size="lg">Mua ngay</Button>
                <Button onClick={() => setView('about')} variant="secondary" size="lg">Về chúng tôi</Button>
              </div>
            </div>
            <div className="hidden md:block">
              {/* Decorative images could go here */}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bán chạy nhất </h2>
            <p className="text-gray-500">Mọi người đều yêu thích!</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.filter(p => p.isBestSeller).map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* Shop by Price */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mua theo ngân sách 💰</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div 
                onClick={() => { setFilterCategory('all'); setFilterMaxPrice(79000); setView('shop'); }}
                className="group cursor-pointer rounded-3xl overflow-hidden relative h-64 shadow-md"
              >
                <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Bình dân" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <h3 className="text-white text-2xl font-bold">Bình dân</h3>
                </div>
              </div>
              <div 
                onClick={() => { setFilterCategory('all'); setFilterMaxPrice(99000); setView('shop'); }}
                className="group cursor-pointer rounded-3xl overflow-hidden relative h-64 shadow-md"
              >
                <img src="https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Trung cấp" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <h3 className="text-white text-2xl font-bold">Trung cấp</h3>
                </div>
              </div>
              <div 
                onClick={() => { setFilterCategory('all'); setFilterMaxPrice(120000); setView('shop'); }}
                className="group cursor-pointer rounded-3xl overflow-hidden relative h-64 shadow-md"
              >
                <img src="https://images.unsplash.com/photo-1759563874745-47e35c0a9572?auto=format&fit=crop&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Cao cấp" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <h3 className="text-white text-2xl font-bold">Cao cấp</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Snippet */}
        <section className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800" alt="About Boxie" className="rounded-3xl shadow-xl rotate-2 hover:rotate-0 transition-transform duration-500" />
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Hộp quà nhỏ, nụ cười lớn 😊</h2>
            <p className="text-gray-600 leading-relaxed">
              Boxie Gift bắt đầu từ một phòng ký túc xá nhỏ với sứ mệnh: làm cho việc tặng quà trở nên dễ dàng, tiết kiệm và cực kỳ đáng yêu cho sinh viên.
              Dù là tặng crush, bestie, hay ngày "thưởng cho bản thân", chúng tôi gói ghém mỗi hộp bằng tình yêu.
            </p>
            <div className="flex gap-4 text-sm font-semibold text-primary-700">
               <span className="flex items-center gap-1"><CheckCircle size={16}/> Sản phẩm được chọn lọc kỹ</span>
               <span className="flex items-center gap-1"><CheckCircle size={16}/> Thư tay viết tay</span>
            </div>
            <Button onClick={() => setView('about')} variant="outline">Đọc thêm</Button>
          </div>
        </section>
      </div>
    );
  };

  const ShopView = () => (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Tất cả sản phẩm</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {['all', 'box', 'bouquet', 'custom', 'set'].map(cat => (
          <button
            key={cat}
            onClick={() => { setFilterCategory(cat); setFilterMaxPrice(null); }}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
              filterCategory === cat 
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {PRODUCTS.filter(p => {
          const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
          const matchesMaxPrice = filterMaxPrice === null || p.price <= filterMaxPrice;

          return matchesCategory && matchesMaxPrice;
        }).map(p => (
          <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
        ))}
      </div>
      
      {PRODUCTS.filter(p => {
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        const matchesMaxPrice = filterMaxPrice === null || p.price <= filterMaxPrice;

        return matchesCategory && matchesMaxPrice;
      }).length === 0 && (
        <div className="text-center text-gray-400 py-20">
          <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );

  const AboutView = () => (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-12 min-h-screen">
       <div className="text-center space-y-4">
         <h1 className="text-4xl font-bold text-gray-900">Câu chuyện của chúng tôi 🌸</h1>
         <p className="text-xl text-primary-600 font-medium">Từ phòng ký túc xá đến tận cửa nhà bạn.</p>
       </div>
       <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50 space-y-6 text-gray-700 leading-relaxed">
         <p>
           Chào bạn! Chúng tôi là <strong>Boxie Gift</strong>. Chúng tôi biết cuộc sống sinh viên rất bận rộn, và đôi khi bạn chỉ muốn thể hiện tình cảm với ai đó mà không tốn kém quá nhiều hoặc mất hàng giờ tìm kiếm món quà phù hợp.
         </p>
         <p>
           Đó là lý do chúng tôi tạo ra Boxie. Chúng tôi tuyển chọn những món đồ đáng yêu nhất - từ văn phòng phẩm đến đồ ăn vặt và thú nhồi bông - và đóng gói đẹp đẽ để sẵn sàng tặng ngay khi chúng đến tay bạn.
         </p>
         <h3 className="text-2xl font-bold text-gray-900 mt-8">Cam kết của chúng tôi</h3>
         <ul className="list-disc list-inside space-y-2 pl-4">
           <li><strong>Tiết kiệm:</strong> Giá cả phù hợp với sinh viên.</li>
           <li><strong>Nhanh chóng:</strong> Miễn phí giao hàng trong vòng 1km quanh Đại học Bách Khoa.</li>
           <li><strong>Cá nhân hóa:</strong> Mỗi hộp đều có tùy chọn thư viết tay.</li>
         </ul>
       </div>
    </div>
  );

  const BlogView = () => (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">Ý tưởng quà tặng & Sáng tạo 💡</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {BLOG_POSTS.map(post => (
          <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
            <div className="p-8">
              <span className="text-primary-500 font-bold text-sm mb-2 block">{post.date}</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-6">{post.excerpt}</p>
              <Button variant="outline" size="sm">Đọc bài viết</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ContactView = () => (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Liên hệ với chúng tôi</h1>
          <p className="text-gray-600">Có câu hỏi về đơn hàng tùy chỉnh? Muốn hợp tác? Gửi tin nhắn cho chúng tôi!</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <MapPin />
              </div>
              <div>
                <p className="font-bold">Địa chỉ</p>
                <p>Gần Đại học Bách Khoa, Hà Nội</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <Mail />
              </div>
              <div>
                <p className="font-bold">Email</p>
                <p>boxiegiftbox@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <Phone />
              </div>
              <div>
                <p className="font-bold">Điện thoại</p>
                <p>0869891708</p>
              </div>
            </div>
          </div>
        </div>

        <form className="bg-white p-8 rounded-3xl shadow-lg border border-primary-50 space-y-4">
          <h3 className="text-xl font-bold mb-4">Gửi tin nhắn</h3>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tên</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" placeholder="Tên của bạn" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500" placeholder="email@cua.ban" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tin nhắn</label>
            <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 h-32" placeholder="Chúng tôi có thể giúp gì cho bạn?"></textarea>
          </div>
          <Button className="w-full">Gửi tin nhắn</Button>
        </form>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">Khách hàng của chúng tôi nói gì ❤️</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex text-yellow-400 mb-2">
                 {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-gray-300"} />)}
               </div>
               <p className="text-gray-600 mb-4 italic">"{r.comment}"</p>
               <p className="text-sm font-bold text-gray-900">- {r.user}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ShippingPolicyView = () => (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-10 min-h-screen">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Chính sách giao hàng</h1>
        <p className="text-gray-600">
          Bọn mình cố gắng giao nhanh và rõ ràng phí ship ngay từ đầu để bạn yên tâm đặt quà.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50 space-y-6 text-gray-700 leading-relaxed">
        <h3 className="text-2xl font-bold text-gray-900">Khu vực & phí giao</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong>Miễn phí giao hàng</strong> khu vực Đại học Bách Khoa (Hà Nội).
          </li>
          <li>
            Các khu vực khác: phí ship sẽ được <strong>báo trước</strong> khi xác nhận đơn (tùy khoảng cách).
          </li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8">Thời gian giao</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Đơn có sẵn: thường giao trong ngày (tùy khung giờ).</li>
          <li>Đơn tùy chỉnh: có thể cần thêm thời gian chuẩn bị (bọn mình sẽ báo trước).</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8">Lưu ý khi nhận hàng</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Vui lòng kiểm tra số lượng/mẫu trước khi nhận.</li>
          <li>Nếu có vấn đề (móp, thiếu đồ…), hãy chụp ảnh/video mở hộp để bọn mình hỗ trợ nhanh nhất.</li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => setView('shop')}>Xem sản phẩm</Button>
        <Button onClick={() => setView('contact')}>Liên hệ</Button>
      </div>
    </div>
  );

  const ReturnsView = () => (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-10 min-h-screen">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Đổi trả</h1>
        <p className="text-gray-600">
          Nếu đơn hàng có vấn đề, bọn mình sẽ xử lý nhanh và ưu tiên quyền lợi của bạn.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-primary-50 space-y-6 text-gray-700 leading-relaxed">
        <h3 className="text-2xl font-bold text-gray-900">Hỗ trợ đổi/trả khi</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Sai sản phẩm / thiếu sản phẩm so với đơn.</li>
          <li>Sản phẩm lỗi do nhà cung cấp (hỏng, rách, bể…)</li>
          <li>Hộp quà bị móp nặng do quá trình vận chuyển.</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8">Không hỗ trợ đổi/trả khi</h3>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Sản phẩm đã sử dụng hoặc bị hư hại do người dùng.</li>
          <li>Yêu cầu sau khi đã nhận hàng quá lâu (khuyến nghị báo trong <strong>24 giờ</strong>).</li>
        </ul>

        <h3 className="text-2xl font-bold text-gray-900 mt-8">Cách yêu cầu hỗ trợ</h3>
        <ol className="list-decimal list-inside space-y-2 pl-4">
          <li>Gửi giúp bọn mình ảnh/video mở hộp + mã đơn hàng.</li>
          <li>Bọn mình xác nhận và đề xuất phương án: đổi hàng / bù thiếu / hoàn tiền.</li>
        </ol>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => setView('shop')}>Xem sản phẩm</Button>
        <Button onClick={() => setView('contact')}>Liên hệ</Button>
      </div>
    </div>
  );

  const FAQView = () => (
    <div className="container mx-auto px-6 py-12 max-w-4xl space-y-10 min-h-screen">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-gray-900">Câu hỏi thường gặp</h1>
        <p className="text-gray-600">Một vài câu hỏi hay gặp để bạn đặt quà nhanh hơn.</p>
      </div>

      <div className="space-y-4">
        <details className="bg-white p-6 rounded-3xl shadow-sm border border-primary-50">
          <summary className="font-bold text-gray-900 cursor-pointer">Mình có thể ghi thiệp/nhắn gửi không?</summary>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Có. Bạn ghi nội dung ở phần ghi chú (hoặc nhắn cho bọn mình), Boxie sẽ viết thiệp giúp bạn.
          </p>
        </details>

        <details className="bg-white p-6 rounded-3xl shadow-sm border border-primary-50">
          <summary className="font-bold text-gray-900 cursor-pointer">Mình muốn tùy chỉnh set theo yêu cầu thì sao?</summary>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Bạn có thể nhắn cho bọn mình ở trang Liên hệ để chọn tone màu, chủ đề, ngân sách và món đồ muốn thêm.
          </p>
        </details>

        <details className="bg-white p-6 rounded-3xl shadow-sm border border-primary-50">
          <summary className="font-bold text-gray-900 cursor-pointer">Bao lâu thì nhận được hàng?</summary>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Thường giao trong ngày ở khu vực nội thành (tùy khung giờ). Đơn tùy chỉnh có thể cần thêm thời gian chuẩn bị.
          </p>
        </details>

        <details className="bg-white p-6 rounded-3xl shadow-sm border border-primary-50">
          <summary className="font-bold text-gray-900 cursor-pointer">Thanh toán như thế nào?</summary>
          <p className="text-gray-700 mt-3 leading-relaxed">
            Hiện tại bọn mình hỗ trợ thanh toán linh hoạt (chuyển khoản hoặc theo thỏa thuận khi xác nhận đơn).
          </p>
        </details>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={() => setView('shop')}>Xem sản phẩm</Button>
        <Button onClick={() => setView('contact')}>Liên hệ</Button>
      </div>
    </div>
  );

  const CheckoutView = () => {
    return (
      <div className="container mx-auto px-6 py-12 min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-10">Thanh toán</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
             {/* Shipping */}
             <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="text-primary-500"/> Thông tin giao hàng
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="w-full rounded-xl px-4 py-3 bg-gray-900 text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Họ và tên"
                  />
                  <input
                    className="w-full rounded-xl px-4 py-3 bg-gray-900 text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    placeholder="Số điện thoại"
                  />
                  <input
                    className="w-full rounded-xl px-4 py-3 bg-gray-900 text-white placeholder:text-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-200 md:col-span-2"
                    placeholder="Địa chỉ (Miễn phí ship < 1km Bách Khoa!)"
                  />
                </div>
             </div>
             
             {/* Message */}
             <div className="bg-white p-6 rounded-3xl shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Heart className="text-primary-500"/> Thư viết tay
                </h2>
                <textarea
                  className="w-full rounded-xl px-4 py-3 h-32 bg-gray-900 text-white placeholder:text-gray-400 border border-gray-700 focus:ring-2 focus:ring-primary-200 focus:outline-none"
                  placeholder="Viết lời nhắn ngọt ngào của bạn ở đây. Chúng tôi sẽ viết tay lên một tấm thiệp đáng yêu! (Tối đa 100 từ)"
                />
             </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                <div className="space-y-4 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                       <span className="text-gray-600">{item.quantity}x {item.name}</span>
                       <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính</span>
                    <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-gray-500">Phí giao hàng</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-primary-600 mt-2">
                    <span>Tổng cộng</span>
                    <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
             </div>
          </div>

          {/* Confirm */}
          <div className="lg:col-span-2">
            <Button
              size="lg"
              className="w-full"
              onClick={() => alert("Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.")}
            >
              Xác nhận đơn hàng
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // CART DRAWER
  const CartDrawer = () => (
    <div className={`fixed inset-0 z-50 flex justify-end transition-all ${isCartOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)} />
      <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-primary-50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><ShoppingBag size={20}/> Giỏ hàng của bạn</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={64} className="text-gray-200" />
              <p>Giỏ hàng của bạn đang trống.</p>
              <Button variant="outline" size="sm" onClick={() => { setIsCartOpen(false); setView('shop'); }}>Đi mua sắm</Button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-primary-600 font-semibold">{item.price.toLocaleString('vi-VN')}₫</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">-</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-400 underline">Xóa</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600 font-medium">Tạm tính</span>
              <span className="text-2xl font-bold text-primary-600">{cartTotal.toLocaleString('vi-VN')}₫</span>
            </div>
            <Button className="w-full" onClick={() => { setIsCartOpen(false); setView('checkout'); }}>
              Thanh toán <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-primary-50/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-primary-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
             <div className="bg-primary-500 text-white p-2 rounded-xl">
               <Heart size={20} fill="currentColor" />
             </div>
             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400" style={{ fontFamily: 'Quicksand, sans-serif' }}>
               Boxie Gift
             </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm lg:text-base">
            <NavLink to="home">Trang chủ</NavLink>
            <NavLink to="shop">Cửa hàng</NavLink>
            <NavLink to="about">Về chúng tôi</NavLink>
            <NavLink to="blog">Blog</NavLink>
            <div className="relative group">
              <button
                type="button"
                className="font-semibold text-gray-600 hover:text-primary-500 transition-colors inline-flex items-center gap-1.5 group-hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70 rounded-lg px-1"
              >
                Đối tác khác
                <ChevronDown
                  size={16}
                  className="mt-[1px] opacity-70 transition-all duration-200 group-hover:opacity-100 group-hover:-rotate-180 group-focus-within:-rotate-180"
                />
              </button>

              <div className="absolute right-0 top-full pt-4 z-50 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                <div className="w-[360px] rounded-2xl border border-primary-100 bg-white shadow-xl p-3">
                  <div className="px-2 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Đối tác khác
                  </div>
                  <div className="space-y-1">
                    {PARTNERS.map((partner) => (
                      <a
                        key={partner.href}
                        href={partner.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary-50 transition-colors group/partner"
                      >
                        <img
                          src={partner.imageSrc}
                          alt={`Đối tác: ${partner.name}`}
                          className="w-12 h-12 rounded-xl object-cover border border-primary-100 bg-primary-50 shrink-0"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-800 leading-tight line-clamp-1 group-hover/partner:text-primary-700">
                            {partner.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{partner.domain}</div>
                        </div>
                        <ExternalLink size={16} className="ml-auto text-gray-400 shrink-0 group-hover/partner:text-primary-500" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <NavLink to="contact">Liên hệ</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-gray-600" onClick={() => { setIsMobileMenuOpen(v => !v); setIsPartnersOpen(false); }}>
              {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-primary-100 p-4 flex flex-col gap-4 shadow-xl">
            <NavLink to="home">Trang chủ</NavLink>
            <NavLink to="shop">Cửa hàng</NavLink>
            <NavLink to="about">Về chúng tôi</NavLink>
            <NavLink to="blog">Blog</NavLink>
            <div>
              <button
                type="button"
                className="w-full flex items-center justify-between font-semibold text-gray-600 hover:text-primary-500 transition-colors"
                onClick={() => setIsPartnersOpen(v => !v)}
              >
                <span>Đối tác khác</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isPartnersOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPartnersOpen && (
                <div className="mt-3 ml-1 pl-3 border-l border-primary-100/80 flex flex-col gap-2">
                  {PARTNERS.map((partner) => (
                    <a
                      key={partner.href}
                      href={partner.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary-50 transition-colors"
                      onClick={() => { setIsMobileMenuOpen(false); setIsPartnersOpen(false); }}
                    >
                      <img
                        src={partner.imageSrc}
                        alt={`Đối tác: ${partner.name}`}
                        className="w-10 h-10 rounded-xl object-cover border border-primary-100 bg-primary-50 shrink-0"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 leading-tight line-clamp-1">
                          {partner.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{partner.domain}</div>
                      </div>
                      <ExternalLink size={16} className="ml-auto text-gray-400 shrink-0" />
                    </a>
                  ))}
                </div>
              )}
            </div>
            <NavLink to="contact">Liên hệ</NavLink>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {view === 'home' && <HomeView />}
        {view === 'shop' && <ShopView />}
        {view === 'about' && <AboutView />}
        {view === 'blog' && <BlogView />}
        {view === 'contact' && <ContactView />}
        {view === 'shipping-policy' && <ShippingPolicyView />}
        {view === 'returns' && <ReturnsView />}
        {view === 'faq' && <FAQView />}
        {view === 'checkout' && <CheckoutView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-primary-100 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary-600">Boxie Gift</h3>
              <p className="text-gray-500 text-sm">Lan tỏa niềm vui, từng hộp quà đáng yêu.</p>
              <div className="flex gap-4 text-gray-400">
                <a
                  href="https://www.threads.com/@th.thn08"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ThreadsIcon className="hover:text-primary-500 cursor-pointer" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61581779467527"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Facebook className="hover:text-primary-500 cursor-pointer" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Cửa hàng</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li onClick={() => { setFilterMaxPrice(null); setFilterCategory('all'); setView('shop'); }} className="cursor-pointer hover:text-primary-500">Tất cả sản phẩm</li>
                <li onClick={() => { setFilterMaxPrice(null); setFilterCategory('box'); setView('shop'); }} className="cursor-pointer hover:text-primary-500">Hộp quà</li>
                <li onClick={() => { setFilterMaxPrice(null); setFilterCategory('bouquet'); setView('shop'); }} className="cursor-pointer hover:text-primary-500">Bó hoa</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li onClick={() => setView('shipping-policy')} className="cursor-pointer hover:text-primary-500">Chính sách giao hàng</li>
                <li onClick={() => setView('returns')} className="cursor-pointer hover:text-primary-500">Đổi trả</li>
                <li onClick={() => setView('faq')} className="cursor-pointer hover:text-primary-500">Câu hỏi thường gặp</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Thông tin giao hàng</h4>
              <p className="text-sm text-gray-500 flex items-start gap-2">
                 <Truck size={16} className="mt-1 shrink-0" />
                 Miễn phí giao hàng khu vực Đại học Bách Khoa!
              </p>
              <p className="text-sm text-gray-500 flex items-start gap-2 mt-2">
                 <Clock size={16} className="mt-1 shrink-0" />
                 Giao ngay trong ngày
              </p>
            </div>
          </div>
          <div className="flex justify-center mb-8">
            <a
              href="https://moit.gov.vn/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/bo-cong-thuong.png"
                alt="Đã thông báo Bộ Công Thương"
                className="h-20 w-auto object-contain"
              />
            </a>
          </div>
          <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
            © 2025 Boxie Gift. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>

      {/* Components */}
      <CartDrawer />
      <FloatingFeatures />
    </div>
  );
};

export default App;