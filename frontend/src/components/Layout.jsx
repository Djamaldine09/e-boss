import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import SnowLayer from './snow-layer';
import { useTheme } from '../context/theme-context';
import { useChristmas } from '../context/christmas-context';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { isChristmasMode } = useChristmas();

  return (
    <div className="min-h-screen glass">
      <Navbar />
      
      {/* Background avec Blobs et Neige intégrée */}
      <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none">
        {isChristmasMode ? (
          <>
            <div className={`absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 blur-[100px] opacity-40 ${
              theme === 'dark' ? 'bg-[#B91C1C]' : 'bg-[#DC2626]'
            }`} />
            <div className={`absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 blur-[100px] opacity-40 ${
              theme === 'dark' ? 'bg-[#15803D]' : 'bg-[#16A34A]'
            }`} />
            <div className={`absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 blur-[100px] opacity-40 ${
              theme === 'dark' ? 'bg-[#FBBF24]' : 'bg-[#F59E0B]'
            }`} />
          </>
        ) : (
          <>
            <div className={`absolute rounded-full top-80 left-2/5 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#4C1D95]' : 'bg-[#E91E63]'
            }`} />
            <div className={`absolute rounded-full top-80 right-0 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#1E3A8A]' : 'bg-[#2E08CF]'
            }`} />
            <div className={`absolute rounded-full top-0 left-1/2 -translate-x-1/2 size-130 blur-[100px] opacity-50 ${
              theme === 'dark' ? 'bg-[#7C3AED]' : 'bg-[#F26A06]'
            }`} />
          </>
        )}
        
        {/* La couche de neige par-dessus les blobs mais sous le texte */}
        <SnowLayer />
      </div>
      
      <main className="pt-16">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
