/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

interface SettingsMenuProps {
  onBack: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ onBack }) => {
  const [sound, setSound] = React.useState(true);
  const [particles, setParticles] = React.useState(true);

  return (
    <div className="w-full h-full bg-[#05050a] game-bg flex flex-col items-center justify-center p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-vibrant-card border border-white/10 rounded-[32px] p-12 shadow-2xl relative"
      >
        <div className="flex items-center gap-4 mb-12">
          <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={32} />
          </button>
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Settings</h2>
        </div>

        <div className="space-y-8">
          <SettingRow 
            label="Sound Effects" 
            icon={sound ? <Volume2 /> : <VolumeX />} 
            value={sound} 
            onToggle={() => setSound(!sound)} 
          />
          <SettingRow 
            label="Particle Effects" 
            icon={particles ? <Eye /> : <EyeOff />} 
            value={particles} 
            onToggle={() => setParticles(!particles)} 
          />
          
          <div className="pt-8 border-t border-white/5 space-y-4">
             <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Reset Progress</button>
             <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">Credits</button>
          </div>
        </div>

        <p className="mt-12 text-center text-white/10 text-[10px] font-mono tracking-[0.4em] uppercase">Neon Dash v1.0.4 - Build 2026.05</p>
      </motion.div>
    </div>
  );
};

const SettingRow = ({ label, icon, value, onToggle }: { label: string, icon: React.ReactNode, value: boolean, onToggle: () => void }) => (
  <div className="flex items-center justify-between p-6 bg-vibrant-inner rounded-2xl border border-white/5">
    <div className="flex items-center gap-4">
       <div className="text-white/40">{icon}</div>
       <span className="text-lg font-bold text-white/90 italic tracking-tight">{label}</span>
    </div>
    <button 
      onClick={onToggle}
      className={`w-16 h-8 rounded-full relative p-1 transition-all ${value ? 'bg-neon-cyan' : 'bg-white/10'}`}
    >
      <motion.div 
        animate={{ x: value ? 32 : 0 }}
        className="w-6 h-6 bg-white rounded-full shadow-lg" 
      />
    </button>
  </div>
);
