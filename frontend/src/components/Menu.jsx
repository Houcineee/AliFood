import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const Menu = ({ categories, cartItems, onUpdateQuantity }) => {
  const getQuantity = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="menu" className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 md:mb-20">
        <h2 className="text-3xl md:text-5xl font-serif text-olive mb-4">Notre Menu</h2>
        <div className="w-16 md:w-20 h-[1px] bg-terracotta mx-auto mb-6" />
        <p className="text-olive/60 font-light tracking-widest uppercase text-[10px] md:text-xs">Savoir-faire & Saveurs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 gap-y-16 md:gap-y-24">
        {categories.map((category, idx) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="flex flex-col"
          >
            <h3 className="text-xl md:text-2xl font-serif text-terracotta mb-6 md:mb-8 border-b border-olive/10 pb-2 italic">
              {category.name}
            </h3>
            
            <ul className="space-y-6 md:space-y-8">
              {category.items.map((item, itemIdx) => {
                const quantity = getQuantity(item.id);
                const isOutOfStock = item.quantity <= 0;
                
                return (
                  <li key={itemIdx} className={`group flex flex-col ${isOutOfStock ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm md:text-base text-olive font-medium group-hover:text-terracotta transition-colors duration-300 pr-2">
                        {item.name}
                      </span>
                      <div className="flex-grow border-b border-dotted border-olive/20 group-hover:border-terracotta/20 transition-colors duration-300" />
                      <span className="text-sm md:text-base text-olive/80 font-serif italic whitespace-nowrap pl-2">{item.price} DH</span>
                    </div>
                    
                    <div className="flex justify-end items-center gap-4">
                      {isOutOfStock ? (
                        <span className="text-[10px] uppercase tracking-widest text-white bg-terracotta px-3 py-1 rounded-full font-bold shadow-sm">
                          Épuisé
                        </span>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-olive/5 rounded-lg border border-olive/10">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.quantity < 10 ? 'bg-terracotta animate-pulse' : 'bg-gold'}`} />
                            <span className="text-[10px] font-bold text-olive/80 tracking-tight uppercase">
                              Stock: <span className="font-mono text-xs">{item.quantity}</span>
                            </span>
                          </div>
                          
                          {quantity === 0 ? (
                            <button 
                              onClick={() => onUpdateQuantity({ ...item, categoryId: category.id, categoryName: category.name }, 1)}
                              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-olive/60 hover:text-terracotta transition-all font-bold group/btn ml-2"
                            >
                              <span className="opacity-0 group-hover/btn:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">Ajouter</span>
                              <div className="p-2 border-2 border-olive/10 rounded-full group-hover/btn:border-terracotta group-hover/btn:bg-terracotta group-hover/btn:text-white transition-all shadow-sm">
                                <Plus size={12} />
                              </div>
                            </button>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center gap-2 md:gap-3 bg-white shadow-md border-2 border-olive/10 rounded-full px-2 py-1 ml-2"
                            >
                              <button 
                                onClick={() => onUpdateQuantity({ ...item, categoryId: category.id, categoryName: category.name }, -1)}
                                className="p-1.5 text-olive/60 hover:text-terracotta transition-colors hover:bg-olive/5 rounded-full"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-sm font-bold text-olive w-4 text-center">{quantity}</span>
                              <button 
                                onClick={() => onUpdateQuantity({ ...item, categoryId: category.id, categoryName: category.name }, 1)}
                                className="p-1.5 text-olive/60 hover:text-terracotta transition-colors hover:bg-olive/5 rounded-full"
                              >
                                <Plus size={14} />
                              </button>
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 md:mt-32 text-center p-8 md:p-12 border border-olive/5 bg-white/30 backdrop-blur-sm rounded-2xl">
        <p className="text-olive/70 italic font-serif text-lg md:text-xl mb-4">
          "La qualité avant tout, pour le plaisir de vos papilles."
        </p>
        <p className="text-terracotta text-[10px] md:text-sm uppercase tracking-widest">— Ali Food —</p>
      </div>
    </section>
  );
};

export default Menu;
