import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onOrder }) => {
  const total = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace(' DH', '')) : item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-olive/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-6 border-b border-olive/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-terracotta" size={24} />
                <h2 className="text-2xl font-serif text-olive">Votre Panier</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-olive/5 rounded-full transition-colors text-olive">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p className="font-serif italic text-xl">Votre panier est vide</p>
                  <button 
                    onClick={onClose}
                    className="text-sm uppercase tracking-widest text-terracotta font-bold hover:underline"
                  >
                    Explorer le menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start group">
                    <div className="flex-grow">
                      <h4 className="text-olive font-medium group-hover:text-terracotta transition-colors">{item.name}</h4>
                      <p className="text-sm text-olive/50 italic">{item.categoryName}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center border border-olive/10 rounded-full px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item, -1)}
                            className="p-1 hover:text-terracotta transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item, 1)}
                            className="p-1 hover:text-terracotta transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item)}
                          className="text-olive/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-serif italic text-olive">
                        {((typeof item.price === 'string' ? parseFloat(item.price.replace(' DH', '')) : item.price) * item.quantity).toFixed(1)} DH
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-olive/10 bg-white/50 backdrop-blur-md">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-olive/60 uppercase tracking-widest text-xs font-bold">Total</span>
                  <span className="text-3xl font-serif text-olive">{total.toFixed(1)} DH</span>
                </div>
                <button 
                    onClick={onOrder}
                    className="w-full py-4 bg-olive text-cream rounded-full hover:bg-terracotta transition-all duration-300 font-medium tracking-widest uppercase text-sm shadow-lg shadow-olive/10 hover:shadow-terracotta/20"
                >
                  Commander Maintenant
                </button>
                <p className="text-center text-[10px] text-olive/30 mt-4 uppercase tracking-widest">
                  Paiement à la livraison ou sur place
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
