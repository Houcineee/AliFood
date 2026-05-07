import React from 'react';

const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-olive/5 bg-olive text-cream">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-serif mb-2">Ali Food</h2>
          <p className="text-cream/60 font-light text-sm italic">Saveurs du Maroc, Passionnément.</p>
        </div>
        
        <div className="flex space-x-12 text-sm uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-terracotta transition-colors">Accueil</a>
          <a href="#menu" className="hover:text-terracotta transition-colors">Menu</a>
          <a href="#" className="hover:text-terracotta transition-colors">Contact</a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-sm text-cream/40">&copy; 2026 Ali Food. Tous droits réservés.</p>
          <p className="text-[10px] text-cream/20 mt-1 uppercase tracking-tighter">Élégance & Tradition</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
