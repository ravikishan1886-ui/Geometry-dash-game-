/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { LevelData } from '../types';
import { LEVELS } from '../levels';

interface LevelSelectorProps {
  onSelect: (level: LevelData) => void;
  onBack: () => void;
  progress: Record<string, number>;
  customLevels?: LevelData[];
  onOpenEditor?: () => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ 
    onSelect, onBack, progress, customLevels = [], onOpenEditor 
}) => {
  const [tab, setTab] = React.useState<'official' | 'custom'>('official');

  const levelsToDisplay = tab === 'official' ? LEVELS : customLevels;

  const getLevelColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return '#00f2ff';
      case 'Medium': return '#ff007a';
      case 'Hard': return '#bcff00';
      default: return '#00f2ff';
    }
  };

  const getLevelGlow = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'neon-glow-cyan';
      case 'Medium': return 'neon-glow-magenta';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full bg-[#05050a] game-bg flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl bg-vibrant-card border border-white/10 rounded-[32px] p-12 shadow-2xl flex flex-col overflow-hidden relative"
      >
        <div className="flex justify-between items-start mb-12">
            <div>
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-4 mb-2"
                >
                    <button onClick={onBack} className="p-2 text-white/40 hover:text-white transition-colors">
                        <ChevronLeft size={32} />
                    </button>
                    <h2 className="text-6xl font-black italic text-white uppercase tracking-tighter">Select Reality</h2>
                </motion.div>
                <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-xs ml-16">Sync your rhythm, survive the run</p>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={onOpenEditor}
                    className="px-6 py-3 bg-neon-cyan text-black font-black uppercase italic rounded-xl flex items-center gap-2 hover:neon-glow-cyan transition-all"
                >
                   Create Level
                </button>
            </div>
        </div>

        <div className="flex gap-12 mb-10 border-b border-white/5 pb-2">
            <button 
                onClick={() => setTab('official')}
                className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                    tab === 'official' ? 'text-white' : 'text-white/20 hover:text-white/40'
                }`}
            >
                Official Content
                {tab === 'official' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-neon-cyan" />}
            </button>
            <button 
                onClick={() => setTab('custom')}
                className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                    tab === 'custom' ? 'text-white' : 'text-white/20 hover:text-white/40'
                }`}
            >
                Your Builds ({customLevels.length})
                {tab === 'custom' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 w-full h-1 bg-neon-magenta" />}
            </button>
        </div>

        <div className="grid grid-cols-3 gap-8">
            {levelsToDisplay.length > 0 ? (
                levelsToDisplay.map((level, idx) => {
                const color = getLevelColor(level.difficulty);
                const glow = getLevelGlow(level.difficulty);
                
                return (
                    <motion.div
                        key={level.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-vibrant-inner rounded-3xl p-8 border-b-4 hover:bg-[#20203a] transition-all group cursor-pointer relative overflow-hidden"
                        style={{ borderBottomColor: color }}
                        onClick={() => onSelect(level)}
                    >
                        <div className="w-full h-36 bg-white/5 rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
                            <motion.div 
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-16 h-16 border-4 flex items-center justify-center"
                                style={{ borderColor: color, boxShadow: `0 0 20px ${color}44` }}
                            >
                                <Play size={32} style={{ color: color }} fill={color} />
                            </motion.div>
                        </div>
                        
                        <h3 className="text-2xl font-black mb-1 group-hover:text-white transition-colors text-white/90 italic">{level.name}</h3>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-white/40 mb-6 tracking-widest">
                            <span>{level.difficulty}</span>
                            <span style={{ color: color }}>★ {level.speed / 2}</span>
                        </div>
                        
                        <button 
                            className={`w-full py-4 text-black font-black uppercase italic rounded-xl tracking-widest text-sm transition-all ${glow}`}
                            style={{ backgroundColor: color }}
                        >
                            Launch {progress[level.id] || 0}%
                        </button>
                    </motion.div>
                );
            })
            ) : (
                <div className="col-span-3 py-32 flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 rounded-[40px]">
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] mb-8">No custom levels created yet</p>
                    <button 
                        onClick={onOpenEditor}
                        className="px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all font-bold"
                    >
                        Start Your First Build
                    </button>
                </div>
            )}
        </div>

        <div className="mt-12 flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/30 tracking-[0.2em] mb-1">Rank</span>
                    <span className="font-bold text-white text-lg font-mono">#1,240</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/30 tracking-[0.2em] mb-1">Total Points</span>
                    <span className="font-bold text-neon-lime text-lg font-mono">24,500</span>
                </div>
            </div>
            <div className="flex items-center gap-8">
                {['Skins', 'Editor', 'Achievements'].map(label => (
                    <span key={label} className="text-xs font-black text-white/40 uppercase tracking-widest cursor-pointer hover:text-neon-cyan hover:drop-shadow-[0_0_10px_#00f2ff] transition-all">
                        {label}
                    </span>
                ))}
            </div>
        </div>
      </motion.div>
    </div>
  );
};
