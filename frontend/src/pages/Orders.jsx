import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Package, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOrderById } from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
    const interval = setInterval(fetchMyOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyOrders = async () => {
    try {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      if (orderHistory.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Fetch each order using the API service
      const fetches = orderHistory.map(id => 
        getOrderById(id).catch(err => {
          console.error(`Failed to fetch order ${id}:`, err);
          return null;
        })
      );
      
      const results = await Promise.all(fetches);
      const validOrders = results.filter(o => o !== null).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(validOrders);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={20} />;
      case 'accepted': return <Package className="text-blue-500" size={20} />;
      case 'ready': return <Timer className="text-green-500" size={20} />;
      case 'picked-up': return <CheckCircle2 className="text-olive/40" size={20} />;
      case 'refused':
      case 'not-picked-up': return <XCircle className="text-terracotta" size={20} />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    const statuses = {
        'pending': 'En attente',
        'accepted': 'En préparation',
        'refused': 'Refusée',
        'ready': 'Prête pour récupération',
        'picked-up': 'Récupérée',
        'not-picked-up': 'Non récupérée'
    };
    return statuses[status] || status;
  };

  return (
    <div className="min-h-screen bg-cream p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-6 mb-12">
          <Link to="/" className="p-2 hover:bg-olive/5 rounded-full transition-colors text-olive">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif text-olive">Mes Commandes</h1>
        </header>

        {loading ? (
          <div className="text-center py-20 text-olive">Chargement de vos commandes...</div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {orders.map(order => (
                <motion.div 
                  key={order.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-olive/5"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <span className="text-xs font-mono text-olive/40 block">COMMANDE #{order.id.slice(-4)}</span>
                        <span className="font-medium text-olive">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end">
                      <span className="text-xs text-olive/40">{new Date(order.createdAt).toLocaleString()}</span>
                      {order.status === 'ready' && <Chrono readyAt={order.readyAt} />}
                    </div>
                  </div>

                  <div className="border-t border-olive/5 pt-4">
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm text-olive/70">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-mono">{item.price} DH</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-dashed border-olive/10">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-olive/40">Total</span>
                      <span className="text-xl font-serif text-olive">
                        {order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(1)} DH
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {orders.length === 0 && (
              <div className="text-center py-20 bg-white/30 rounded-3xl border-2 border-dashed border-olive/10">
                <Package size={48} className="mx-auto text-olive/20 mb-4" />
                <p className="text-olive/60 font-serif text-xl italic mb-6">Vous n'avez pas encore passé de commande</p>
                <Link 
                  to="/" 
                  className="inline-block py-3 px-8 bg-olive text-cream rounded-full hover:bg-terracotta transition-all uppercase tracking-widest text-xs font-bold"
                >
                  Découvrir le menu
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Chrono({ readyAt }) {
    const [timeLeft, setTimeLeft] = useState(300);

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
        <div className="text-sm font-mono font-bold text-terracotta mt-1">
            À récupérer sous: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
    );
}

export default Orders;
