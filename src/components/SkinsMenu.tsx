/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingBag, Check, Palette } from 'lucide-react';
import { Skin } from '../types';
import { SKINS } from '../constants';

interface SkinsMenuProps {
  orbs: number;
  unlockedSkins: string[];
  activeSkinId: string;
  customSkins?: Skin[];
  onSelect: (id: string) => void;
  onBuy: (id: string, price: number) => void;
  onBack: () => void;
  onOpenDesigner: () => void;
}

export const SkinsMenu: React.FC<SkinsMenuProps> = ({ 
  orbs, unlockedSkins, activeSkinId, customSkins = [], onSelect, onBuy, onBack, onOpenDesigner 
}) => {
  const allSkins = [...SKINS, ...customSkins];

  return (
    <div className="w-full h-full bg-[#05050a] game-bg flex flex-col items-center justify-center p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-vibrant-card border border-white/10 rounded-[32px] p-12 shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-colors">
              <ChevronLeft size={32} />
            </button>
            <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Icon Shop</h2>
          </div>
          <div className="flex items-center gap-6">
            <button 
                onClick={onOpenDesigner}
                className="px-6 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-black uppercase italic rounded-xl flex items-center gap-2 hover:bg-neon-cyan hover:text-black transition-all"
            >
                <Palette size={20} /> Create Skin
            </button>
            <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <span className="text-[10px] uppercase text-white/30 tracking-widest">Your Orbs</span>
                <span className="text-xl font-black text-neon-lime italic">{orbs}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {allSkins.map((skin) => {
            const isUnlocked = unlockedSkins.includes(skin.id);
            const isActive = activeSkinId === skin.id;
            
            return (
              <motion.div
                key={skin.id}
                whileHover={{ y: -5 }}
                className={`bg-vibrant-inner rounded-3xl p-6 border-2 flex flex-col items-center transition-all cursor-pointer ${
                  isActive ? 'border-neon-cyan neon-glow-cyan' : isUnlocked ? 'border-white/10' : 'border-white/5 opacity-80'
                }`}
                onClick={() => isUnlocked ? onSelect(skin.id) : null}
              >
                <div 
                  className="w-20 h-20 rounded-2xl mb-6 shadow-xl flex items-center justify-center"
                  style={{ backgroundColor: skin.color }}
                >
                   <div className="w-12 h-12 border-4 border-black/20" />
                </div>
                
                <h3 className="text-sm font-black text-white/90 uppercase tracking-widest mb-4">{skin.name}</h3>
                
                {isActive ? (
                  <div className="flex items-center gap-2 text-neon-cyan font-black text-[10px] uppercase italic tracking-widest">
                    <Check size={14} /> Active
                  </div>
                ) : isUnlocked ? (
                  <button 
                    onClick={() => onSelect(skin.id)}
                    className="w-full py-2 bg-white/10 text-white font-black text-[10px] uppercase italic rounded-lg tracking-widest hover:bg-white/20 transition-all"
                  >
                    Select
                  </button>
                ) : (
                  <button 
                    onClick={() => onBuy(skin.id, skin.price)}
                    disabled={orbs < skin.price}
                    className={`w-full py-2 flex items-center justify-center gap-2 bg-neon-magenta text-white font-black text-[10px] uppercase italic rounded-lg tracking-widest hover:neon-glow-magenta transition-all disabled:opacity-50 disabled:grayscale`}
                  >
                    <ShoppingBag size={14} /> {skin.price}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
