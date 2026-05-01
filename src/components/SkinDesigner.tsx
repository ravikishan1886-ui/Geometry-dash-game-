/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Save, Palette } from 'lucide-react';
import { Skin } from '../types';

interface SkinDesignerProps {
  onSave: (skin: Skin) => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  '#ffffff', '#00f2ff', '#ff007a', '#bcff00', '#ffd700', 
  '#ff4d00', '#8a2be2', '#00ff00', '#ff1493', '#1e90ff'
];

export const SkinDesigner: React.FC<SkinDesignerProps> = ({ onSave, onBack }) => {
  const [name, setName] = useState('My Custom Skin');
  const [color, setColor] = useState('#ffffff');

  const handleSave = () => {
    const newSkin: Skin = {
      id: 'custom-skin-' + Date.now(),
      name,
      color,
      price: 0,
      unlocked: true
    };
    onSave(newSkin);
  };

  return (
    <div className="w-full h-full bg-[#05050a] game-bg flex flex-col items-center justify-center p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-vibrant-card border border-white/10 rounded-[32px] p-12 shadow-2xl relative"
      >
        <div className="flex items-center gap-4 mb-12">
          <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={32} />
          </button>
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Skin Designer</h2>
        </div>

        <div className="space-y-10">
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase text-white/30 tracking-[0.4em] font-black">Identity</span>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-vibrant-inner border border-white/10 rounded-2xl px-6 py-4 text-white text-xl font-bold italic outline-none focus:border-neon-cyan transition-all"
              placeholder="Enter Skin Name"
            />
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase text-white/30 tracking-[0.4em] font-black">Chroma Select</span>
            <div className="grid grid-cols-5 gap-4">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`aspect-square rounded-2xl border-4 transition-all scale-100 hover:scale-105 ${
                    color === c ? 'border-white' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-black/40 rounded-3xl border border-white/5">
             <div className="flex items-center gap-6">
                <div 
                   className="w-24 h-24 rounded-2xl shadow-2xl flex items-center justify-center"
                   style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}66` }}
                >
                    <div className="w-14 h-14 border-4 border-black/20" />
                </div>
                <div>
                   <span className="text-[10px] uppercase text-white/20 tracking-widest block mb-1">Preview</span>
                   <h3 className="text-2xl font-black text-white italic">{name}</h3>
                </div>
             </div>
             
             <button 
               onClick={handleSave}
               className="px-10 py-5 bg-neon-cyan text-black font-black uppercase italic rounded-2xl flex items-center gap-3 hover:neon-glow-cyan transition-all"
             >
               <Save size={24} /> Forge Skin
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
