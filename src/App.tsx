import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Store,
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  FileCode,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  User,
  Search,
  DollarSign,
  TrendingUp,
  Tag,
  Copy,
  QrCode,
  Edit2,
  Sparkles,
  ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Types
export interface MenuItem {
  id: string;
  name: string;
  category: 'Makanan' | 'Minuman' | 'Paket' | 'Camilan';
  price: number;
  image: string;
  icon: string;
  isAvailable: boolean;
  soldCount: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  note?: string;
}

export interface Transaction {
  id: string;
  date: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Transfer';
  amountPaid: number;
  change: number;
  cashierName: string;
  customerName: string;
  orderType: 'Dine-in' | 'Takeaway';
}

const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Nasi Ayam Goreng Lalapan',
    category: 'Makanan',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    icon: '🍗',
    isAvailable: true,
    soldCount: 42
  },
  {
    id: 'm2',
    name: 'Nasi Soto Ayam Lamongan',
    category: 'Makanan',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
    icon: '🍲',
    isAvailable: true,
    soldCount: 35
  },
  {
    id: 'm3',
    name: 'Nasi Pecel Madiun + Telur',
    category: 'Makanan',
    price: 14000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    icon: '🥗',
    isAvailable: true,
    soldCount: 29
  },
  {
    id: 'm4',
    name: 'Nasi Goreng Spesial Telur',
    category: 'Makanan',
    price: 16000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    icon: '🍳',
    isAvailable: true,
    soldCount: 38
  },
  {
    id: 'm5',
    name: 'Mie Goreng / Kuah Nyemek',
    category: 'Makanan',
    price: 13000,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    icon: '🍜',
    isAvailable: true,
    soldCount: 22
  },
  {
    id: 'm6',
    name: 'Paket Kenyang (Ayam + Es Teh)',
    category: 'Paket',
    price: 21000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    icon: '🍱',
    isAvailable: true,
    soldCount: 56
  },
  {
    id: 'm7',
    name: 'Paket Hemat (Lele + Es Jeruk)',
    category: 'Paket',
    price: 19000,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
    icon: '🐟',
    isAvailable: true,
    soldCount: 31
  },
  {
    id: 'm8',
    name: 'Tempe Mendoan (Isi 4)',
    category: 'Camilan',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    icon: '🥢',
    isAvailable: true,
    soldCount: 45
  },
  {
    id: 'm9',
    name: 'Tahu Goreng Sambal Kecap',
    category: 'Camilan',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1546069901-d576a87754b2?auto=format&fit=crop&w=600&q=80',
    icon: '🧈',
    isAvailable: true,
    soldCount: 19
  },
  {
    id: 'm10',
    name: 'Bakwan Sayur Hangat (3 pcs)',
    category: 'Camilan',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    icon: '🥟',
    isAvailable: true,
    soldCount: 27
  },
  {
    id: 'm11',
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    icon: '🧊',
    isAvailable: true,
    soldCount: 88
  },
  {
    id: 'm12',
    name: 'Es Jeruk Peras Segar',
    category: 'Minuman',
    price: 6000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    icon: '🍊',
    isAvailable: true,
    soldCount: 54
  },
  {
    id: 'm13',
    name: 'Kopi Tubruk / Kopi Hitam',
    category: 'Minuman',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    icon: '☕',
    isAvailable: true,
    soldCount: 33
  },
  {
    id: 'm14',
    name: 'Kopi Susu Gula Aren',
    category: 'Minuman',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    icon: '🥤',
    isAvailable: true,
    soldCount: 40
  },
  {
    id: 'm15',
    name: 'Air Mineral Botol 600ml',
    category: 'Minuman',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    icon: '💧',
    isAvailable: true,
    soldCount: 25
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-20261022-001',
    date: '2026-10-22',
    time: '12:15',
    items: [
      { menuItem: INITIAL_MENU[5], quantity: 2, note: 'Sambal dipisah' },
      { menuItem: INITIAL_MENU[7], quantity: 1, note: 'Mendoan garing' }
    ],
    subtotal: 50000,
    discount: 0,
    total: 50000,
    paymentMethod: 'Tunai',
    amountPaid: 50000,
    change: 0,
    cashierName: 'Mbak Sri',
    customerName: 'Meja 2 (Mas Budi)',
    orderType: 'Dine-in'
  },
  {
    id: 'TRX-20261022-002',
    date: '2026-10-22',
    time: '12:45',
    items: [
      { menuItem: INITIAL_MENU[0], quantity: 1 },
      { menuItem: INITIAL_MENU[10], quantity: 1 }
    ],
    subtotal: 22000,
    discount: 2000,
    total: 20000,
    paymentMethod: 'QRIS',
    amountPaid: 20000,
    change: 0,
    cashierName: 'Mbak Sri',
    customerName: 'Bungkus - Mbak Nina',
    orderType: 'Takeaway'
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'pos' | 'dashboard' | 'menu' | 'history' | 'guide'>('pos');
  
  // Data States
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('warung_menu_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('warung_trx_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Current Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('Meja 1');
  const [orderType, setOrderType] = useState<'Dine-in' | 'Takeaway'>('Dine-in');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // User / Auth State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'Pemilik' | 'Kasir'; email: string }>({
    name: 'Mbak Sri Handayani',
    role: 'Kasir',
    email: 'kasir@warungsederhana.id'
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('owner@warungsederhana.id');
  const [loginPassword, setLoginPassword] = useState('123456');

  // Checkout & Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Transfer'>('Tunai');
  const [cashGiven, setCashGiven] = useState<number>(0);

  // Receipt Modal
  const [receiptTrx, setReceiptTrx] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Edit / Add Menu Modal
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isNewMenu, setIsNewMenu] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('warung_menu_data_v2', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('warung_trx_data_v2', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return Math.round((subtotal * discountPercent) / 100);
  }, [subtotal, discountPercent]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, discountAmount]);

  const changeAmount = useMemo(() => {
    if (paymentMethod !== 'Tunai') return 0;
    return Math.max(0, cashGiven - grandTotal);
  }, [cashGiven, grandTotal, paymentMethod]);

  // Filtered Menu
  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menu, selectedCategory, searchQuery]);

  // Dashboard Metrics
  const metrics = useMemo(() => {
    const totalOmset = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTrxCount = transactions.length;
    const avgOrderValue = totalTrxCount > 0 ? Math.round(totalOmset / totalTrxCount) : 0;
    const sortedMenu = [...menu].sort((a, b) => b.soldCount - a.soldCount);
    const topItem = sortedMenu[0] || menu[0];

    return {
      totalOmset,
      totalTrxCount,
      avgOrderValue,
      topItem
    };
  }, [transactions, menu]);

  // Cart Handlers
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) {
      showToast(`Maaf, ${item.name} sedang habis!`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { menuItem: item, quantity: 1 }];
      }
    });
    showToast(`Ditambahkan: ${item.name}`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.menuItem.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const updateItemNote = (itemId: string, note: string) => {
    setCart(prev =>
      prev.map(item => (item.menuItem.id === itemId ? { ...item, note } : item))
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    if (confirm('Kosongkan semua pesanan di keranjang?')) {
      setCart([]);
      setDiscountPercent(0);
      showToast('Keranjang telah dikosongkan.');
    }
  };

  const handleOpenPayment = () => {
    if (cart.length === 0) {
      showToast('Keranjang masih kosong, silakan pilih menu.');
      return;
    }
    setCashGiven(grandTotal);
    setIsPaymentModalOpen(true);
  };

  const handleProcessTransaction = () => {
    if (paymentMethod === 'Tunai' && cashGiven < grandTotal) {
      showToast('Uang tunai yang dibayar kurang dari total belanja!');
      return;
    }

    const now = new Date();
    const trxId = `TRX-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${String(transactions.length + 1).padStart(3, '0')}`;

    const newTransaction: Transaction = {
      id: trxId,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod,
      amountPaid: paymentMethod === 'Tunai' ? cashGiven : grandTotal,
      change: paymentMethod === 'Tunai' ? Math.max(0, cashGiven - grandTotal) : 0,
      cashierName: currentUser.name,
      customerName: customerName || 'Pelanggan Umum',
      orderType
    };

    setMenu(prev =>
      prev.map(m => {
        const cartMatch = cart.find(ci => ci.menuItem.id === m.id);
        if (cartMatch) {
          return { ...m, soldCount: m.soldCount + cartMatch.quantity };
        }
        return m;
      })
    );

    setTransactions(prev => [newTransaction, ...prev]);
    setCart([]);
    setIsPaymentModalOpen(false);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    setReceiptTrx(newTransaction);
    setIsReceiptModalOpen(true);
    showToast('Transaksi berhasil disimpan! Struk siap dicetak.');
  };

  const handleSaveMenu = (item: MenuItem) => {
    if (isNewMenu) {
      setMenu(prev => [...prev, item]);
      showToast(`Menu "${item.name}" berhasil ditambahkan.`);
    } else {
      setMenu(prev => prev.map(m => (m.id === item.id ? item : m)));
      showToast(`Menu "${item.name}" berhasil diperbarui.`);
    }
    setIsMenuModalOpen(false);
  };

  const handleDeleteMenu = (id: string, name: string) => {
    if (confirm(`Hapus menu "${name}"?`)) {
      setMenu(prev => prev.filter(m => m.id !== id));
      showToast(`Menu "${name}" dihapus.`);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.includes('owner') || loginEmail.includes('admin')) {
      setCurrentUser({
        name: 'Pak Joko (Pemilik Warung)',
        role: 'Pemilik',
        email: loginEmail
      });
      showToast('Login berhasil sebagai Pemilik Warung');
    } else {
      setCurrentUser({
        name: 'Mbak Sri Handayani',
        role: 'Kasir',
        email: loginEmail
      });
      showToast('Login berhasil sebagai Kasir Operasional');
    }
    setIsLoginModalOpen(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    showToast(`Kode ${sectionName} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  // Preset foto makanan untuk kemudahan pemilik warung
  const samplePhotoPresets = [
    { label: 'Ayam Goreng', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80' },
    { label: 'Soto Ayam', url: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80' },
    { label: 'Nasi Pecel', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80' },
    { label: 'Mie Goreng', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80' },
    { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
    { label: 'Es Jeruk', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
    { label: 'Kopi Hitam', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col selection:bg-emerald-200">
      {/* Top Navbar */}
      <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-700/60 flex items-center justify-center text-xl shadow-inner">
              <Store className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-tight tracking-tight">Kasir Warung Sederhana</h1>
                <span className="hidden sm:inline-block text-[11px] bg-emerald-700 text-emerald-200 px-2 py-0.5 rounded-full font-medium border border-emerald-600/50">
                  Foto Menu Aktif 📸
                </span>
              </div>
              <p className="text-xs text-emerald-300 flex items-center gap-1.5">
                <span>Warung Makan Tradisional Modern</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2 md:space-x-3">
            <nav className="hidden md:flex bg-emerald-900/70 p-1 rounded-xl text-xs font-medium border border-emerald-700/50">
              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'pos'
                    ? 'bg-white text-emerald-900 font-bold shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Kasir POS</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-emerald-900 font-bold shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('menu')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'menu'
                    ? 'bg-white text-emerald-900 font-bold shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Kelola Menu</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'history'
                    ? 'bg-white text-emerald-900 font-bold shadow-sm'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Riwayat</span>
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'guide'
                    ? 'bg-amber-400 text-amber-950 font-bold shadow-sm'
                    : 'text-amber-200 hover:text-amber-100'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Panduan & Export</span>
              </button>
            </nav>

            {/* User Profile Pill */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs transition"
              title="Ganti akun"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-100 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="font-semibold text-white leading-tight">{currentUser.name.split(' ')[0]}</p>
                <span className="text-[10px] text-emerald-300">{currentUser.role}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex border-t border-emerald-700/80 bg-emerald-900 text-xs">
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex-1 py-2.5 text-center font-medium ${
              activeTab === 'pos' ? 'text-white font-bold bg-emerald-800' : 'text-emerald-300'
            }`}
          >
            Kasir
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-2.5 text-center font-medium ${
              activeTab === 'dashboard' ? 'text-white font-bold bg-emerald-800' : 'text-emerald-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 py-2.5 text-center font-medium ${
              activeTab === 'menu' ? 'text-white font-bold bg-emerald-800' : 'text-emerald-300'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 text-center font-medium ${
              activeTab === 'history' ? 'text-white font-bold bg-emerald-800' : 'text-emerald-300'
            }`}
          >
            Riwayat
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2.5 text-center font-medium ${
              activeTab === 'guide' ? 'text-amber-300 font-bold bg-emerald-800' : 'text-amber-200'
            }`}
          >
            Panduan
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* ================= TAB 1: KASIR POS (DENGAN FOTO MENU) ================= */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Product Selector with Photos */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Category Filter & Search */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari menu (Ayam, Soto, Teh)..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto w-full sm:w-auto space-x-1.5 pb-1 sm:pb-0 scrollbar-none">
                  {['Semua', 'Makanan', 'Minuman', 'Paket', 'Camilan'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Grid - FOTO MAKANAN & MINUMAN REALISTIS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className={`bg-white rounded-2xl border transition duration-200 flex flex-col overflow-hidden group select-none shadow-xs ${
                      item.isAvailable
                        ? 'border-slate-200 hover:border-emerald-600 hover:shadow-lg cursor-pointer active:scale-98'
                        : 'border-slate-200 opacity-60 cursor-not-allowed bg-slate-50'
                    }`}
                  >
                    {/* Wadah Foto Menu */}
                    <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback jika internet lambat
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />

                      {/* Gradient Overlay bawah gambar */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                      {/* Badge Kategori & Stok di atas foto */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute top-2 right-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                            item.isAvailable
                              ? 'bg-emerald-600/90 text-white shadow-xs'
                              : 'bg-rose-600/90 text-white shadow-xs'
                          }`}
                        >
                          {item.isAvailable ? 'Ready' : 'Habis'}
                        </span>
                      </div>

                      {/* Floating Price Pill di pojok bawah gambar */}
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                        <span className="font-extrabold text-white text-sm drop-shadow-md">
                          {formatRupiah(item.price)}
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white group-hover:bg-emerald-500 transition flex items-center justify-center text-xs shadow-md">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Deskripsi Menu Bawah */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-emerald-700 transition">
                          {item.name}
                        </h3>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>{item.icon} Warung Rasa</span>
                        <span className="text-emerald-700 font-semibold">{item.soldCount} terjual</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenu.length === 0 && (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
                  <UtensilsCrossed className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">Tidak ada menu yang sesuai dengan kata kunci.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                    }}
                    className="mt-2 text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>

            {/* Right: Cart & Billing Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-140px)] sticky top-20">
                {/* Cart Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h2 className="font-bold text-slate-800 text-sm">Pesanan Sekarang</h2>
                      <span className="text-[11px] text-slate-400">{cart.length} item di keranjang</span>
                    </div>
                  </div>
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
                    >
                      Kosongkan
                    </button>
                  )}
                </div>

                {/* Order Details */}
                <div className="p-3 bg-slate-50 border-b border-slate-100 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Pelanggan / Meja</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Meja 1"
                      className="w-full mt-0.5 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Tipe Layanan</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value as 'Dine-in' | 'Takeaway')}
                      className="w-full mt-0.5 px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Dine-in">Makan di Tempat (Dine-in)</option>
                      <option value="Takeaway">Bungkus (Takeaway)</option>
                    </select>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <UtensilsCrossed className="w-7 h-7 text-slate-300" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-600">Keranjang Masih Kosong</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
                        Klik foto menu makanan atau minuman di samping untuk menambahkan ke pesanan.
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 flex items-center gap-2.5"
                      >
                        {/* Foto kecil di keranjang */}
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-xs truncate">
                            {item.menuItem.name}
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            {formatRupiah(item.menuItem.price)}
                          </span>

                          <input
                            type="text"
                            placeholder="Catatan..."
                            value={item.note || ''}
                            onChange={(e) => updateItemNote(item.menuItem.id, e.target.value)}
                            className="text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded w-full mt-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {/* Counter Qty */}
                        <div className="flex flex-col items-end justify-between self-stretch">
                          <span className="font-bold text-slate-800 text-xs">
                            {formatRupiah(item.menuItem.price * item.quantity)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, -1)}
                              className="w-5 h-5 rounded bg-white text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.menuItem.id, 1)}
                              className="w-5 h-5 rounded bg-white text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-100 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtotal & Checkout */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" /> Diskon
                    </span>
                    <div className="flex items-center space-x-1">
                      {[0, 5, 10].map((pct) => (
                        <button
                          key={pct}
                          onClick={() => setDiscountPercent(pct)}
                          className={`text-[10px] px-2 py-0.5 rounded font-semibold transition ${
                            discountPercent === pct
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                      {discountAmount > 0 && (
                        <span className="font-semibold text-emerald-700 text-xs ml-1">
                          -{formatRupiah(discountAmount)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Akhir</span>
                    <span className="text-lg font-extrabold text-emerald-800">{formatRupiah(grandTotal)}</span>
                  </div>

                  <button
                    onClick={handleOpenPayment}
                    disabled={cart.length === 0}
                    className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 ${
                      cart.length > 0
                        ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-[0.98]'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bayar & Cetak Struk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Omset Hari Ini</p>
                  <h3 className="text-xl font-bold text-slate-800">{formatRupiah(metrics.totalOmset)}</h3>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Transaksi Normal
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Total Transaksi</p>
                  <h3 className="text-xl font-bold text-slate-800">{metrics.totalTrxCount} Pesanan</h3>
                  <span className="text-[11px] text-slate-400 mt-0.5">Tersimpan di sistem POS</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Menu Terlaris</p>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-1">{metrics.topItem.name}</h3>
                  <span className="text-[11px] text-amber-700 font-semibold mt-0.5">
                    {metrics.topItem.soldCount} porsi terjual
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Rata-rata Order</p>
                  <h3 className="text-xl font-bold text-slate-800">{formatRupiah(metrics.avgOrderValue)}</h3>
                  <span className="text-[11px] text-slate-400 mt-0.5">Per pelanggan warung</span>
                </div>
              </div>
            </div>

            {/* Top Selling Menu Cards dengan Foto */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Galeri Peringkat Menu Terlaris</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...menu]
                  .sort((a, b) => b.soldCount - a.soldCount)
                  .slice(0, 6)
                  .map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-0 left-0 bg-emerald-700 text-white text-[10px] font-bold px-1.5 rounded-br">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                        <p className="text-[11px] text-emerald-800 font-semibold">{formatRupiah(item.price)}</p>
                        <span className="text-[10px] text-slate-500">{item.soldCount} porsi terjual</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: KELOLA MENU (DENGAN PREVIEW FOTO) ================= */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="font-bold text-slate-800 text-base">Manajemen Foto & Menu Warung</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah foto makanan, update harga, sesuaikan status stok ketersediaan di dapur.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingItem({
                    id: `m-${Date.now()}`,
                    name: '',
                    category: 'Makanan',
                    price: 15000,
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
                    icon: '🍲',
                    isAvailable: true,
                    soldCount: 0
                  });
                  setIsNewMenu(true);
                  setIsMenuModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4">Foto & Nama Menu</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga Jual</th>
                      <th className="p-4">Status Stok</th>
                      <th className="p-4">Total Terjual</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {menu.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-800 flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div>
                            <span className="block text-xs sm:text-sm">{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{item.icon} Warung</span>
                          </div>
                        </td>
                        <td className="p-4 text-xs">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-800">{formatRupiah(item.price)}</td>
                        <td className="p-4">
                          <span
                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                              item.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {item.isAvailable ? 'Tersedia' : 'Habis'}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600 font-medium">{item.soldCount} porsi</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem({ ...item });
                              setIsNewMenu(false);
                              setIsMenuModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-xs font-semibold transition"
                          >
                            <Edit2 className="w-3.5 h-3.5 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenu(item.id, item.name)}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: RIWAYAT TRANSAKSI ================= */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-slate-800 text-base">Riwayat Transaksi</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Struk transaksi lama dapat dibuka dan dicetak ulang kapan saja.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4">No. Nota</th>
                      <th className="p-4">Waktu</th>
                      <th className="p-4">Pelanggan</th>
                      <th className="p-4">Tipe</th>
                      <th className="p-4">Metode Bayar</th>
                      <th className="p-4">Kasir</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Struk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-mono text-xs font-bold text-slate-800">{trx.id}</td>
                        <td className="p-4 text-xs text-slate-500">
                          {trx.date} {trx.time}
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-800">{trx.customerName}</td>
                        <td className="p-4 text-xs">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              trx.orderType === 'Dine-in'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {trx.orderType}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-semibold text-slate-700">{trx.paymentMethod}</td>
                        <td className="p-4 text-xs text-slate-500">{trx.cashierName}</td>
                        <td className="p-4 font-bold text-emerald-800">{formatRupiah(trx.total)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setReceiptTrx(trx);
                              setIsReceiptModalOpen(true);
                            }}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Buka Struk</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: PANDUAN MENTORING & EXPORT ================= */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🎓
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Panduan & Kode Standalone dengan Foto Menu
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tampilan katalog kini menggunakan foto asli beresolusi tajam dari Unsplash khusus masakan Indonesia!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1: Standalone index.html */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-slate-800 text-sm">
                    Kode index.html Baru (Foto Menu)
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard('Lihat kode lengkap di respons obrolan mentor', 'kode')}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Info</span>
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Setiap item makanan kini memiliki properti <code>image</code> dengan URL foto resolusi tinggi, penyesuaian rasio aspek <code>h-36 object-cover</code>, efek zoom saat mouse melayang (hover), serta overlay gelap untuk keterbacaan teks dan harga.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL 1: CHECKOUT & PAYMENT ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-800 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">Pembayaran Kasir</h3>
                <p className="text-xs text-emerald-200">{customerName} &bull; {orderType}</p>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-emerald-900/60 hover:bg-emerald-900 flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-xs text-emerald-800 font-semibold uppercase tracking-wider block">
                    Total Yang Harus Dibayar
                  </span>
                  <span className="text-2xl font-extrabold text-emerald-900">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-emerald-700">
                  {cart.length} item pesanan
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Tunai', 'QRIS', 'Transfer'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method);
                        if (method === 'Tunai') setCashGiven(grandTotal);
                      }}
                      className={`p-3 rounded-2xl text-xs font-bold border transition flex flex-col items-center justify-center space-y-1 ${
                        paymentMethod === method
                          ? 'border-2 border-emerald-700 bg-emerald-50 text-emerald-900 shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method === 'Tunai' && <DollarSign className="w-5 h-5 text-emerald-700" />}
                      {method === 'QRIS' && <QrCode className="w-5 h-5 text-blue-700" />}
                      {method === 'Transfer' && <Store className="w-5 h-5 text-purple-700" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'Tunai' && (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block">
                    Uang Tunai Diterima (Rp)
                  </label>
                  <input
                    type="number"
                    value={cashGiven || ''}
                    onChange={(e) => setCashGiven(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0"
                  />

                  <div className="flex gap-1.5 flex-wrap pt-1">
                    <button
                      type="button"
                      onClick={() => setCashGiven(grandTotal)}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg"
                    >
                      Uang Pas
                    </button>
                    {[20000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCashGiven(amt)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        {formatRupiah(amt)}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-sm">
                    <span className="text-xs font-semibold text-slate-500">Kembalian:</span>
                    <span
                      className={`font-extrabold text-base ${
                        cashGiven < grandTotal ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {cashGiven < grandTotal
                        ? `Kurang ${formatRupiah(grandTotal - cashGiven)}`
                        : formatRupiah(changeAmount)}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'QRIS' && (
                <div className="text-center p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="w-36 h-36 mx-auto bg-white border-2 border-slate-300 p-2 rounded-2xl flex items-center justify-center shadow-xs">
                    <QrCode className="w-28 h-28 text-slate-800" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">QRIS WARUNG MAKAN SEDERHANA</p>
                  <p className="text-[11px] text-slate-500">Scan via BCA, GoPay, OVO, ShopeePay, Dana</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleProcessTransaction}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Konfirmasi Bayar & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: AUTOMATIC THERMAL RECEIPT ================= */}
      {isReceiptModalOpen && receiptTrx && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold tracking-wide">STRUK PEMBELIAN OTOMATIS</h4>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-100 flex justify-center">
              <div
                id="thermal-receipt"
                className="w-full bg-white p-5 shadow-sm border border-dashed border-slate-300 rounded-lg font-mono text-xs text-slate-900 space-y-3"
              >
                <div className="text-center space-y-0.5">
                  <h2 className="font-bold text-sm tracking-wider">WARUNG MAKAN SEDERHANA</h2>
                  <p className="text-[10px] text-slate-600">Jl. Kaliurang KM 5, Sleman, Yogyakarta</p>
                  <p className="text-[10px] text-slate-600">Telp/WA: 0812-3456-7890</p>
                </div>

                <div className="border-b border-dashed border-slate-400 py-1.5 text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span>No. Nota:</span>
                    <span className="font-bold">{receiptTrx.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Waktu:</span>
                    <span>{receiptTrx.date} {receiptTrx.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kasir:</span>
                    <span>{receiptTrx.cashierName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>{receiptTrx.customerName} ({receiptTrx.orderType})</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] py-1 border-b border-dashed border-slate-400">
                  {receiptTrx.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span>{formatRupiah(item.menuItem.price * item.quantity)}</span>
                      </div>
                      {item.note && (
                        <span className="text-[9px] text-slate-500 italic block pl-4">
                          * {item.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-[11px] pt-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(receiptTrx.subtotal)}</span>
                  </div>
                  {receiptTrx.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Diskon:</span>
                      <span>-{formatRupiah(receiptTrx.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                    <span>TOTAL:</span>
                    <span>{formatRupiah(receiptTrx.total)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                    <span>Bayar ({receiptTrx.paymentMethod}):</span>
                    <span>{formatRupiah(receiptTrx.amountPaid)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>Kembali:</span>
                    <span>{formatRupiah(receiptTrx.change)}</span>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-dashed border-slate-400 space-y-1">
                  <p className="font-bold text-[11px]">MATUR NUWUN / TERIMA KASIH</p>
                  <p className="text-[9px] text-slate-500">Masakan Enak, Harga Sahabat</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak (Thermal / PDF)</span>
              </button>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: TAMBAH & EDIT MENU DENGAN FOTO ================= */}
      {isMenuModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-emerald-800 text-white p-5 flex justify-between items-center">
              <h3 className="font-bold text-sm">
                {isNewMenu ? 'Tambah Menu Baru' : 'Edit Menu Warung'}
              </h3>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveMenu(editingItem);
              }}
              className="p-5 space-y-3.5 overflow-y-auto"
            >
              {/* Preview Foto */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <img
                  src={editingItem.image}
                  alt="Preview"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Preview Foto Menu</span>
                  <p className="text-[11px] text-slate-500">
                    Foto akan ditampilkan langsung di kartu menu POS kasir.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">URL Foto Gambar Menu</label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    required
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                {/* Pilihan cepat preset foto */}
                <div className="mt-1.5">
                  <span className="text-[10px] text-slate-500 block mb-1 font-semibold">Pilih Cepat Foto Contoh:</span>
                  <div className="flex gap-1 flex-wrap">
                    {samplePhotoPresets.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, image: p.url })}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nama Menu</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="Contoh: Bebek Goreng Kremes"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Kategori</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as MenuItem['category']
                      })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Paket">Paket Hemat</option>
                    <option value="Camilan">Camilan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    min={500}
                    step={500}
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="stock-available"
                  checked={editingItem.isAvailable}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, isAvailable: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="stock-available" className="text-xs font-medium text-slate-700">
                  Stok Tersedia untuk Dijual (Ready di Dapur)
                </label>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Simpan Menu
                </button>
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: LOGIN ================= */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-emerald-800 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">Masuk Sistem Kasir</h3>
                <p className="text-[11px] text-emerald-200">Autentikasi Akun Warung</p>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Akun Demo Siap Pakai:
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('kasir@warungsederhana.id');
                      setLoginPassword('1234');
                    }}
                    className="p-2.5 border border-slate-200 rounded-xl text-left hover:border-emerald-600 bg-slate-50 transition"
                  >
                    <p className="font-bold text-xs text-slate-800">🧑‍🍳 Kasir</p>
                    <p className="text-[10px] text-slate-500">Mbak Sri</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('owner@warungsederhana.id');
                      setLoginPassword('admin');
                    }}
                    className="p-2.5 border border-slate-200 rounded-xl text-left hover:border-emerald-600 bg-slate-50 transition"
                  >
                    <p className="font-bold text-xs text-slate-800">👑 Pemilik</p>
                    <p className="text-[10px] text-slate-500">Pak Joko</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Email / ID Kasir</label>
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">PIN / Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                Masuk ke Aplikasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900/95 text-white px-4 py-3 rounded-2xl text-xs shadow-2xl z-50 flex items-center space-x-2 border border-slate-700 backdrop-blur-sm animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
