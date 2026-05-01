/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/Engine';
import { LevelData, GAME_WIDTH, GAME_HEIGHT, Skin } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Pause, Play, RotateCcw, Home } from 'lucide-react';

interface GameViewProps {
  level: LevelData;
  activeSkin: Skin;
  onExit: () => void;
  onWin: () => void;
  onContinue: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ level, activeSkin, onExit, onWin, onContinue }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      level,
      activeSkin,
      () => {
        // Game Over
        setAttempts(prev => prev + 1);
        restart();
      },
      () => {
        // Win
        setIsWin(true);
        onWin();
      }
    );

    engineRef.current = engine;
    let animationId: number;

    const loop = (time: number) => {
      engine.update(time);
      setProgress(engine.state.progress);
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [level]);

  const restart = () => {
    if (engineRef.current) {
      engineRef.current.state.player.pos = { x: 100, y: GAME_HEIGHT - 40 - 50 };
      engineRef.current.state.player.vel = { x: level.speed, y: 0 };
      engineRef.current.state.player.isDead = false;
      engineRef.current.state.player.mode = level.objects[0]?.portalData?.value as any || 'cube'; // or default
      engineRef.current.state.player.gravity = 1;
      engineRef.current.state.player.rotation = 0;
      engineRef.current.state.cameraX = 0;
      setIsWin(false);
    }
  };

  const togglePause = () => {
    if (engineRef.current) {
      engineRef.current.state.isPaused = !isPaused;
      setIsPaused(!isPaused);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#05050a] game-bg overflow-hidden font-sans">
      <div className="relative border-4 border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="bg-[#05050a] cursor-pointer touch-none"
        />

        {/* HUD Top */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 pointer-events-none">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan opacity-70 mb-1">Level {level.id}</span>
                <h1 className="text-3xl font-black italic tracking-tighter text-white drop-shadow-[0_0_10px_#00f2ff]">{level.name.toUpperCase()}</h1>
            </div>
            
            <div className="flex items-center gap-8 pointer-events-auto">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Attempts</span>
                    <span className="text-2xl font-mono font-bold text-white italic">{attempts}</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="w-48 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 mb-1 shadow-inner">
                        <motion.div
                            className="h-full bg-neon-cyan neon-glow-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, progress * 100)}%` }}
                        />
                    </div>
                </div>
                
                <span className="text-2xl font-mono font-bold text-neon-cyan italic w-16 text-right">
                    {Math.min(100, Math.floor(progress * 100))}%
                </span>

                <button 
                    onClick={togglePause}
                    className="ml-4 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-neon-cyan hover:text-black transition-all group"
                >
                    {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>
            </div>
        </div>
      </div>

      {/* Pause Menu Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#05050a]/90 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <h2 className="text-8xl font-black text-white italic mb-12 tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">Paused</h2>
            <div className="flex gap-10">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={togglePause} 
                className="p-8 bg-neon-cyan rounded-[32px] text-black shadow-[0_0_40px_#00f2ff] hover:neon-glow-cyan transition-all"
              >
                 <Play size={56} fill="black" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={() => { restart(); togglePause(); }} 
                className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-white hover:bg-white/10 transition-all"
              >
                 <RotateCcw size={56} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                onClick={onExit} 
                className="p-8 bg-white/5 border border-white/10 rounded-[32px] text-white hover:bg-white/10 transition-all"
              >
                 <Home size={56} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win Menu Overlay */}
      <AnimatePresence>
        {isWin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-50 bg-neon-cyan/10 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-vibrant-card border border-white/10 rounded-[40px] p-16 flex flex-col items-center shadow-[0_0_100px_rgba(0,242,255,0.2)]"
            >
                <div className="mb-6 px-4 py-1 bg-neon-cyan/10 border border-neon-cyan rounded-full">
                    <span className="text-[10px] uppercase font-black text-neon-cyan tracking-widest">Level Mastery</span>
                </div>
                <h2 className="text-6xl font-black text-white mb-2 uppercase italic tracking-tighter">Mission Success</h2>
                <p className="text-white/40 mb-12 font-mono text-sm tracking-widest uppercase truncate max-w-xs">{level.name}</p>
                
                <div className="flex gap-12 mb-12">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-white/30 tracking-widest mb-1">Attempts</span>
                        <span className="text-3xl font-black text-white italic">{attempts}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase text-white/30 tracking-widest mb-1">Status</span>
                        <span className="text-3xl font-black text-neon-lime italic">100%</span>
                    </div>
                </div>

                <button
                    onClick={onContinue}
                    className="px-16 py-5 bg-neon-cyan text-black rounded-2xl font-black text-xl hover:neon-glow-cyan transition-all shadow-[0_0_30px_#00f2ff] uppercase italic tracking-widest"
                >
                    Continue
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
