import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getOrders, updateOrderStatus } from '../api';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif text-olive">AliFood <span className="text-terracotta italic text-2xl ml-2">Admin Chef</span></h1>
          <div className="text-olive/50 text-sm">Actualisation automatique toutes les 3s</div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-olive">Chargement des commandes...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} onUpdateStatus={updateStatus} />
            ))}
            {orders.length === 0 && (
                <div className="col-span-full text-center py-20 text-olive/40 border-2 border-dashed border-olive/10 rounded-2xl">
                    Aucune commande pour le moment
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onUpdateStatus }) {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'accepted': 'bg-blue-100 text-blue-800',
    'refused': 'bg-red-100 text-red-800',
    'ready': 'bg-green-100 text-green-800',
    'picked-up': 'bg-gray-100 text-gray-800',
    'not-picked-up': 'bg-black text-white'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-olive/5 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-mono text-olive/40 block mb-1">ID: #{order.id.slice(-4)}</span>
          <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>
        <div className="text-right">
            <span className="text-xs text-olive/40 block">{new Date(order.createdAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="flex-grow mb-6">
        <h3 className="text-sm font-bold text-olive mb-2 uppercase tracking-tight">Articles</h3>
        <ul className="space-y-2">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm text-olive/80">
              <span>{item.quantity}x {item.name}</span>
              <span className="font-mono text-xs">{item.price} DH</span>
            </li>
          ))}
        </ul>
      </div>

      {order.status === 'ready' && <AdminChrono readyAt={order.readyAt} />}

      <div className="grid grid-cols-2 gap-2 mt-4">
        {order.status === 'pending' && (
          <>
            <button 
              onClick={() => onUpdateStatus(order.id, 'accepted')}
              className="bg-olive text-cream py-2 rounded-lg text-sm font-medium hover:bg-olive/90 transition-colors"
            >
              Accepter
            </button>
            <button 
              onClick={() => onUpdateStatus(order.id, 'refused')}
              className="bg-terracotta/10 text-terracotta py-2 rounded-lg text-sm font-medium hover:bg-terracotta/20 transition-colors"
            >
              Refuser
            </button>
          </>
        )}
        
        {order.status === 'accepted' && (
          <button 
            onClick={() => onUpdateStatus(order.id, 'ready')}
            className="col-span-2 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Marquer comme Prêt
          </button>
        )}

        {order.status === 'ready' && (
          <>
            <button 
              onClick={() => onUpdateStatus(order.id, 'picked-up')}
              className="bg-olive text-cream py-2 rounded-lg text-sm font-medium hover:bg-olive/90 transition-colors"
            >
              Récupéré
            </button>
            <button 
              onClick={() => onUpdateStatus(order.id, 'not-picked-up')}
              className="bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Non récupéré
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function AdminChrono({ readyAt }) {
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
        <div className="mb-4 p-3 bg-terracotta/5 rounded-xl border border-terracotta/10 text-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta block mb-1">Délai de récupération</span>
            <span className="text-2xl font-mono font-bold text-terracotta">
                {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
        </div>
    );
}

export default Admin;
