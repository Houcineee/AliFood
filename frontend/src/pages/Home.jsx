import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Menu from '../components/Menu';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { ShoppingBag, Menu as MenuIcon, X, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getMenu, getOrderById, createOrder } from '../api';

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderCount, setActiveOrderCount] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchMenu();
    updateActiveOrderCount();
    const interval = setInterval(updateActiveOrderCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateActiveOrderCount = async () => {
    try {
      const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (history.length === 0) {
        setActiveOrderCount(0);
        return;
      }

      const recentIds = history.slice(-5);
      const fetches = recentIds.map(id => getOrderById(id).catch(() => null));
      const results = await Promise.all(fetches);
      
      const active = results.filter(order => 
        order && ['pending', 'accepted', 'ready'].includes(order.status)
      );
      
      setActiveOrderCount(active.length);
    } catch (err) {
      console.error("Error updating badge:", err);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMenu = async () => {
    try {
      const data = await getMenu();
      setMenuData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  const updateQuantity = (item, delta) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        
        const menuItem = findMenuItem(item.id);
        if (delta > 0 && menuItem && menuItem.quantity < newQuantity) {
            showNotification("Désolé, stock insuffisant !", "error");
            return prev;
        }

        if (newQuantity <= 0) {
          return prev.filter(i => i.id !== item.id);
        }
        return prev.map(i => 
          (i.id === item.id) 
          ? { ...i, quantity: newQuantity } 
          : i
        );
      }
      if (delta > 0) {
        const menuItem = findMenuItem(item.id);
        if (menuItem && menuItem.quantity < 1) {
            showNotification("Ce produit est épuisé !", "error");
            return prev;
        }
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const findMenuItem = (itemId) => {
    for (const cat of menuData) {
        const item = cat.items.find(i => i.id === itemId);
        if (item) return item;
    }
    return null;
  };

  const removeFromCart = (item) => {
    setCartItems(prev => prev.filter(i => i.id !== item.id));
  };

  const handleOrder = async () => {
    try {
        const leanCartItems = cartItems.map(({ id, quantity }) => ({ id, quantity }));
        const data = await createOrder(leanCartItems);
        
        const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        localStorage.setItem('orderHistory', JSON.stringify([...history, data.id]));

        setCartItems([]);
        setIsCartOpen(false);
        fetchMenu(); 
        updateActiveOrderCount();
        showNotification("Chef ! Votre commande est en cuisine.");
    } catch (err) {
        console.error("Order error:", err);
        showNotification(err.message, "error");
    }
  };

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-cream selection:bg-gold selection:text-olive font-sans">
      {/* High-Contrast Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-24 right-6 z-[100]"
          >
            <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 ${
              notification.type === 'error' 
                ? 'bg-terracotta text-cream' 
                : 'bg-olive text-cream'
            }`}>
              <div className="bg-white/20 p-2 rounded-full">
                {notification.type === 'error' ? <X size={18} /> : <ClipboardList size={18} />}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block">
                    {notification.type === 'error' ? 'Erreur' : 'Notification'}
                </span>
                <p className="font-serif italic text-lg leading-tight">
                  {notification.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${
        isScrolled ? 'bg-cream/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-serif text-olive tracking-tight cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Ali<span className="text-terracotta">Food</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12 items-center">
            {['Accueil', 'Menu', 'Contact'].map((item, i) => (
              <motion.a
                key={item}
                href={item === 'Menu' ? '#menu' : '#'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm uppercase tracking-widest font-medium text-olive/70 hover:text-terracotta transition-colors"
              >
                {item}
              </motion.a>
            ))}
            
            <Link to="/orders" className="text-olive hover:text-gold transition-all relative group p-2 rounded-full hover:bg-olive/5">
                <ClipboardList size={22} />
                {activeOrderCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gold text-olive text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-gold/30 border-2 border-cream">
                    {activeOrderCount}
                  </span>
                )}
            </Link>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-olive hover:text-terracotta transition-colors relative"
            >
              <ShoppingBag size={22} />
              {totalItemsCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 bg-olive text-cream text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-cream"
                >
                  {totalItemsCount}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <Link to="/orders" className="p-2 text-olive relative">
              <ClipboardList size={20} />
              {activeOrderCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-olive text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm border border-cream">
                  {activeOrderCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-olive relative"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-olive text-cream text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-cream">
                  {totalItemsCount}
                </span>
              )}
            </button>
            <button 
              className="text-olive"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {['Accueil', 'Menu', 'Contact'].map((item) => (
              <a
                key={item}
                href={item === 'Menu' ? '#menu' : '#'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-serif text-olive hover:text-terracotta transition-colors"
              >
                {item}
              </a>
            ))}
            <Link 
                to="/orders" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl font-serif text-olive hover:text-terracotta transition-colors"
            >
                Mes Commandes
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero />
        
        {loading ? (
            <div className="flex justify-center py-20 text-olive">Chargement du menu...</div>
        ) : (
            <Menu 
                categories={menuData} 
                cartItems={cartItems} 
                onUpdateQuantity={updateQuantity} 
            />
        )}
      </main>

      <Footer />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onOrder={handleOrder}
      />
    </div>
  );
}

function Chrono({ readyAt }) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        const calculateTime = () => {
            const diff = Math.floor((new Date() - new Date(readyAt)) / 1000);
            const remaining = Math.max(0, 300 - diff);
            setTimeLeft(remaining);
        };
        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [readyAt]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="text-sm text-olive mt-1">
            Temps restant: <span className="font-mono font-bold text-terracotta">
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
}

export default Home;
