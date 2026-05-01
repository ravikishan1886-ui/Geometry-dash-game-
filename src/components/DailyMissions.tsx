/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, CheckCircle2 } from 'lucide-react';
import { Mission } from '../types';
import { MISSIONS } from '../constants';

interface DailyMissionsProps {
  completedMissions: string[];
  onBack: () => void;
}

export const DailyMissions: React.FC<DailyMissionsProps> = ({ completedMissions, onBack }) => {
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
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">Missions</h2>
        </div>

        <div className="space-y-6">
          {MISSIONS.map((mission) => {
            const isCompleted = completedMissions.includes(mission.id);
            return (
              <div 
                key={mission.id}
                className={`p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${
                  isCompleted ? 'bg-white/5 border-neon-lime/20' : 'bg-vibrant-inner border-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl ${isCompleted ? 'bg-neon-lime/10 text-neon-lime' : 'bg-white/5 text-white/40'}`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : <Trophy size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/90">{mission.description}</h3>
                    <p className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-neon-lime' : 'text-white/40'}`}>
                      Reward: {mission.reward} Orbs
                    </p>
                  </div>
                </div>
                {isCompleted && (
                  <span className="text-[10px] font-black uppercase italic text-neon-lime bg-neon-lime/10 px-3 py-1 rounded">Claimed</span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
