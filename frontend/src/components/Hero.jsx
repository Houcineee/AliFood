import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden px-6 pt-20 md:pt-0">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] md:w-[40%] h-[60%] rounded-full bg-terracotta blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] md:w-[40%] h-[60%] rounded-full bg-olive blur-[80px] md:blur-[120px]" />
      </div>

      <div className="max-w-4xl text-center z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-terracotta uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm font-semibold mb-4 md:mb-6 block"
        >
          Bienvenue chez Ali Food
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-8xl font-serif text-olive mb-6 md:mb-8 leading-[1.1]"
        >
          L'Art de la <br className="hidden sm:block" />
          <span className="italic text-terracotta">Cuisine Rapide</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-olive/70 max-w-2xl mx-auto mb-10 md:mb-12 font-light leading-relaxed px-4 md:px-0"
        >
          Découvrez une expérience culinaire où la tradition marocaine rencontre le confort moderne. 
          Des saveurs authentiques, préparées avec passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a 
            href="#menu" 
            className="inline-block px-8 md:px-10 py-3.5 md:py-4 bg-olive text-cream rounded-full hover:bg-terracotta transition-colors duration-300 font-medium tracking-wide uppercase text-xs md:text-sm shadow-lg shadow-olive/5"
          >
            Explorer le Menu
          </a>
        </motion.div>
      </div>

      {/* Elegant Scroll Indicator - Hidden on small mobile to avoid overlap */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-olive/50 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
