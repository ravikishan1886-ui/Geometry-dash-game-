/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Settings, ShoppingBag, Trophy } from 'lucide-react';

interface MenuProps {
  onStart: () => void;
  onShop: () => void;
  onMissions: () => void;
  onSettings: () => void;
  orbs: number;
}

export const Menu: React.FC<MenuProps> = ({ onStart, onShop, onMissions, onSettings, orbs }) => {
  return (
    <div className="relative w-full h-full bg-[#05050a] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff15 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff15 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 50%, black, transparent 80%)'
        }}
      />

      {/* Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600 opacity-20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-fuchsia-600 opacity-20 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

      {/* Shooting Stars / Streaks */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{ 
            x: [null, 1200], 
            y: [null, 800],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random() * 3, 
            repeat: Infinity, 
            delay: Math.random() * 5,
            ease: "linear"
          }}
          className={`absolute w-32 h-0.5 bg-gradient-to-r from-transparent ${i % 2 === 0 ? 'via-blue-400' : 'via-fuchsia-400'} to-transparent rotate-[35deg] pointer-events-none`}
          style={{ 
            top: `${Math.random() * 60}%`, 
            left: `${Math.random() * -20}%` 
          }}
        />
      ))}

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center mb-16"
      >
        <motion.div
           animate={{ 
             y: [0, -8, 0],
           }}
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
           className="relative mb-16 flex flex-col items-center"
        >
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-black italic tracking-tighter text-white uppercase flex">
                <span className="drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">Neon</span>
                <span className="bg-gradient-to-b from-[#ff00e5] to-[#7000ff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,0,229,0.5)] ml-2">Dash</span>
            </h1>
            <div className="absolute -bottom-4 right-0 bg-[#bcff00] text-black text-[10px] font-black px-4 py-1 tracking-[0.2em] rounded-sm uppercase italic skew-x-[-15deg]">
                Rhythm Runner
            </div>
          </div>
        </motion.div>

        {/* Circular Play Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="relative flex items-center justify-center w-64 h-64 rounded-full group outline-none"
        >
          {/* Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-transparent bg-gradient-to-tr from-[#bcff00] via-[#ff00e5] to-[#7000ff] border-clip-path p-[6px]">
             <div className="w-full h-full rounded-full bg-[#05050a] border-[4px] border-[#05050a]" />
          </div>
           {/* Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#bcff00] via-[#ff00e5] to-[#7000ff] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
          
          <div className="z-10 w-32 h-32 bg-gradient-to-b from-[#ffd700] to-[#ffaa00] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.5)]">
             <Play size={48} fill="black" stroke="black" className="ml-2" />
          </div>
        </motion.button>
      </motion.div>

      {/* Footer Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex gap-20 mb-12"
      >
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mb-1">Current Orbs</span>
            <span className="text-3xl font-black text-[#bcff00] italic drop-shadow-[0_0_15px_rgba(188,255,0,0.5)]">{orbs.toLocaleString()}</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase text-white/40 tracking-[0.2em] font-bold mb-1">Rank</span>
            <span className="text-3xl font-black text-white italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">#1,240</span>
        </div>
      </motion.div>

      {/* Footer Navigation Icons */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-6 z-10"
      >
        <SidebarButton 
            onClick={onMissions} 
            icon={<Trophy size={32} />} 
            label="Daily" 
            borderColor="border-[#ffaa00]" 
            glowColor="shadow-[#ffaa00]/40"
            iconColor="text-[#ffaa00]"
        />
        <SidebarButton 
            onClick={onShop} 
            icon={<ShoppingBag size={32} />} 
            label="Skins" 
            borderColor="border-[#ff00e5]" 
            glowColor="shadow-[#ff00e5]/40"
            iconColor="text-[#ff00e5]"
        />
        <SidebarButton 
            onClick={onSettings} 
            icon={<Settings size={32} />} 
            label="Set" 
            borderColor="border-[#00f2ff]" 
            glowColor="shadow-[#00f2ff]/40"
            iconColor="text-[#00f2ff]"
        />
      </motion.div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white to-fuchsia-600 shadow-[0_0_20px_white]">
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 w-8 h-4 bg-[#05050a] clip-path-v" />
      </div>
    </div>
  );
};

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    borderColor: string;
    glowColor: string;
    iconColor: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, onClick, borderColor, glowColor, iconColor }) => (
  <button onClick={onClick} className="flex flex-col items-center group">
    <div className={`p-4 bg-black/40 border-2 ${borderColor} rounded-2xl transition-all shadow-lg ${glowColor} hover:scale-105 active:scale-95`}>
       <div className={`${iconColor} transition-colors`}>
         {icon}
       </div>
    </div>
    <span className="mt-2 text-[10px] font-black text-white italic uppercase tracking-widest">{label}</span>
  </button>
);

