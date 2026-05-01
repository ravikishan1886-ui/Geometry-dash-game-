/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Save, Trash2, Box, Triangle, Zap, Play, ChevronLeft, 
  RotateCcw, RotateCw, Settings, Search, ZoomIn, ZoomOut,
  Copy, Clipboard, Edit3, Trash, MousePointer2, Move, Grid
} from 'lucide-react';
import { LevelData, GameObject, GAME_HEIGHT, BLOCK_SIZE, PortalType, GameMode } from '../types';

interface LevelEditorProps {
  onSave: (level: LevelData) => void;
  onBack: () => void;
}

type EditorTab = 'build' | 'edit' | 'delete';

export const LevelEditor: React.FC<LevelEditorProps> = ({ onSave, onBack }) => {
  const [levelName, setLevelName] = useState('New Level');
  const [objects, setObjects] = useState<GameObject[]>([]);
  const [history, setHistory] = useState<GameObject[][]>([]);
  const [redoStack, setRedoStack] = useState<GameObject[][]>([]);
  const [clipboard, setClipboard] = useState<GameObject[]>([]);
  
  const [activeTab, setActiveTab] = useState<EditorTab>('build');
  const [selectedType, setSelectedType] = useState<GameObject['type']>('block');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [portalType, setPortalType] = useState<PortalType>(PortalType.MODE_CHANGE);
  
  const [scrollX, setScrollX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [snap, setSnap] = useState(true);
  const [swipe, setSwipe] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const saveHistory = (newObjects: GameObject[]) => {
    setHistory(prev => [...prev.slice(-19), objects]);
    setRedoStack([]);
    setObjects(newObjects);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack(prevRedo => [...prevRedo, objects]);
    setHistory(prevHist => prevHist.slice(0, -1));
    setObjects(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prevHist => [...prevHist, objects]);
    setRedoStack(prevRedo => prevRedo.slice(0, -1));
    setObjects(next);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    // Clear with GD Blue
    ctx.fillStyle = '#287dff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const scaledBlockSize = BLOCK_SIZE * zoom;

    // Grid
    ctx.strokeStyle = '#32a0ff';
    ctx.lineWidth = 1;
    for (let x = -scrollX % scaledBlockSize * zoom; x < canvas.width; x += scaledBlockSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += scaledBlockSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Ground Line
    ctx.strokeStyle = '#ffffff88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT * zoom);
    ctx.lineTo(canvas.width, GAME_HEIGHT * zoom);
    ctx.stroke();

    // Objects
    objects.forEach(obj => {
      const x = (obj.pos.x - scrollX) * zoom;
      const y = obj.pos.y * zoom;
      const w = obj.size.x * zoom;
      const h = obj.size.y * zoom;

      if (x + w < 0 || x > canvas.width) return;

      const isSelected = selectedIds.includes(obj.id);

      ctx.save();
      if (isSelected) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
      }

      if (obj.type === 'block') {
        ctx.fillStyle = '#111';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#ffffffaa';
        ctx.lineWidth = 2 * zoom;
        ctx.strokeRect(x, y, w, h);
      } else if (obj.type === 'spike') {
        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w / 2, y);
        ctx.lineTo(x + w, y + h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffffaa';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
      } else if (obj.type === 'portal') {
        ctx.fillStyle = obj.color || '#ffaa00';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2 * zoom;
        ctx.stroke();
      }
      ctx.restore();
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
        canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 450;
        draw();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [objects, scrollX, zoom, selectedIds]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = (clickX / zoom) + scrollX;
    const worldY = clickY / zoom;

    if (activeTab === 'delete') {
      const filtered = objects.filter(obj => {
        const inX = worldX >= obj.pos.x && worldX <= obj.pos.x + obj.size.x;
        const inY = worldY >= obj.pos.y && worldY <= obj.pos.y + obj.size.y;
        return !(inX && inY);
      });
      if (filtered.length !== objects.length) saveHistory(filtered);
      return;
    }

    if (activeTab === 'edit') {
      const clickedObj = [...objects].reverse().find(obj => {
        const inX = worldX >= obj.pos.x && worldX <= obj.pos.x + obj.size.x;
        const inY = worldY >= obj.pos.y && worldY <= obj.pos.y + obj.size.y;
        return inX && inY;
      });

      if (clickedObj) {
        if (e.shiftKey || swipe) {
          setSelectedIds(prev => prev.includes(clickedObj.id) ? prev.filter(id => id !== clickedObj.id) : [...prev, clickedObj.id]);
        } else {
          setSelectedIds([clickedObj.id]);
        }
      } else if (!swipe) {
        setSelectedIds([]);
      }
      return;
    }

    // Build mode
    let x = worldX;
    let y = worldY;

    if (snap) {
      x = Math.floor(x / BLOCK_SIZE) * BLOCK_SIZE;
      y = Math.floor(y / BLOCK_SIZE) * BLOCK_SIZE;
    }

    const newObj: GameObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      pos: { x, y },
      size: { x: BLOCK_SIZE, y: selectedType === 'portal' ? BLOCK_SIZE * 3 : BLOCK_SIZE },
      color: selectedType === 'spike' ? '#ff0055' : selectedType === 'portal' ? '#ffaa00' : '#00f2ff'
    };

    if (selectedType === 'portal') {
      newObj.portalData = { type: portalType, value: portalType === PortalType.MODE_CHANGE ? GameMode.SHIP : -1 };
    }

    saveHistory([...objects, newObj]);
  };

  const copySelected = () => {
    const selected = objects.filter(o => selectedIds.includes(o.id));
    if (selected.length > 0) setClipboard(selected);
  };

  const pasteClipboard = () => {
    if (clipboard.length === 0) return;
    const newItems = clipboard.map(obj => ({
      ...obj,
      id: Math.random().toString(36).substr(2, 9),
      pos: { x: obj.pos.x + BLOCK_SIZE, y: obj.pos.y }
    }));
    saveHistory([...objects, ...newItems]);
    setSelectedIds(newItems.map(i => i.id));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    saveHistory(objects.filter(o => !selectedIds.includes(o.id)));
    setSelectedIds([]);
  };

  const clearLevel = () => {
    if (confirm('Clear all objects?')) saveHistory([]);
  };

  const handleSave = () => {
    const level: LevelData = {
      id: 'custom-' + Date.now(),
      name: levelName,
      difficulty: 'Medium',
      bpm: 120,
      speed: 8,
      length: objects.length > 0 ? Math.max(...objects.map(o => o.pos.x)) + 1000 : 5000,
      objects
    };
    onSave(level);
  };

  return (
    <div className="w-full h-full bg-[#1a1a1a] flex flex-col font-sans overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="h-14 bg-[#212121] flex justify-between items-center px-4 border-b border-black/40 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-[#333] border border-white/10 rounded-lg hover:bg-[#444] transition-colors">
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="h-8 w-px bg-white/5 mx-2" />
          <button 
            onClick={undo} 
            disabled={history.length === 0}
            className={`p-2 bg-[#333] border border-white/10 rounded-lg transition-colors ${history.length === 0 ? 'opacity-20' : 'hover:bg-[#444]'}`}
          >
             <RotateCcw size={20} className="text-white" />
          </button>
          <button 
            onClick={redo} 
            disabled={redoStack.length === 0}
            className={`p-2 bg-[#333] border border-white/10 rounded-lg transition-colors ${redoStack.length === 0 ? 'opacity-20' : 'hover:bg-[#444]'}`}
          >
             <RotateCw size={20} className="text-white" />
          </button>
          <button onClick={clearLevel} className="p-2 bg-[#333] border border-white/10 rounded-lg hover:bg-red-500/20 text-red-400">
             <Trash size={18} />
          </button>
        </div>

        {/* Level Progress Bar / Slider Placeholder */}
        <div className="flex-1 flex justify-center px-8">
           <div className="w-full max-w-lg h-5 bg-[#333] rounded-full border border-black/50 relative flex items-center px-1">
              <div className="w-8 h-full bg-white/20 rounded-full border border-white/10" style={{ left: `${(scrollX / (objects.length > 0 ? objects[objects.length-1].pos.x : 10000)) * 100}%` }} />
           </div>
        </div>

        <div className="flex items-center gap-3">
          <input 
            value={levelName}
            onChange={e => setLevelName(e.target.value)}
            className="bg-black/20 border border-white/10 rounded px-3 py-1 text-white text-xs font-bold uppercase tracking-widest outline-none focus:border-[#00ff4c] w-32"
          />
          <button className="p-2 bg-[#333] border border-white/10 rounded-lg hover:bg-[#444]"><Settings size={20} className="text-[#00ff4c]" /></button>
          <button onClick={handleSave} className="px-5 py-2.5 bg-[#00ff4c] text-black font-black uppercase text-xs rounded-lg hover:bg-[#00e644] flex items-center gap-2">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#212121] border-r border-black/40 flex flex-col items-center py-4 gap-4 z-20">
           <SidebarTool icon={<Zap size={22} />} active={false} color="#bcff00" />
           <SidebarTool icon={<Play size={22} />} active={false} color="#00ff4c" />
           <div className="w-8 h-px bg-white/10 my-2" />
           <SidebarTool icon={<ZoomIn size={22} />} active={false} onClick={() => setZoom(Math.min(2, zoom + 0.1))} />
           <SidebarTool icon={<ZoomOut size={22} />} active={false} onClick={() => setZoom(Math.max(0.3, zoom - 0.1))} />
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 relative cursor-crosshair">
          <canvas 
            ref={canvasRef} 
            onClick={handleCanvasClick}
            className="w-full h-full block"
          />
          
          {/* Scroll Overlay */}
          <div className="absolute inset-x-0 bottom-6 flex justify-between px-10 pointer-events-none">
             <button 
                onClick={() => setScrollX(Math.max(0, scrollX - 500))}
                className="pointer-events-auto p-4 bg-black/40 rounded-full text-white/40 hover:text-white transition-colors"
             >
                <ChevronLeft size={32} />
             </button>
             <button 
                onClick={() => setScrollX(scrollX + 500)}
                className="pointer-events-auto p-4 bg-black/40 rounded-full text-white/40 hover:text-white transition-colors"
             >
                <motion.div animate={{ rotate: 180 }}><ChevronLeft size={32} /></motion.div>
             </button>
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="w-[180px] bg-[#212121] border-l border-black/40 grid grid-cols-2 gap-2 p-2 z-20 content-start">
           <ActionTile label="COPY" color="#ff70ff" onClick={copySelected} icon={<Copy size={14} />} />
           <ActionTile label="PASTE" color="#70e5ff" onClick={pasteClipboard} icon={<Clipboard size={14} />} />
           <ActionTile label="DELETE" color="#ff4040" onClick={deleteSelected} icon={<Trash2 size={14} />} />
           <ActionTile label="DESELECT" color="#ffd700" onClick={() => setSelectedIds([])} icon={<MousePointer2 size={14} />} />
           <ActionTile label="LAYER" color="#70ff70" icon={<Grid size={14} />} />
           <ActionTile label="EDIT OBJ" color="#ffaa00" icon={<Settings size={14} />} />
        </div>
      </div>

      {/* Bottom Panel (Tabs & Object Selection) */}
      <div className="h-[200px] bg-[#1a1a1a] flex border-t-2 border-black/80 z-20">
         {/* Main Tabs */}
         <div className="w-[140px] flex flex-col gap-1 p-2 bg-[#212121] border-r border-black/40 shrink-0">
            <MainTab active={activeTab === 'build'} label="BUILD" onClick={() => setActiveTab('build')} color="#00e1ff" />
            <MainTab active={activeTab === 'edit'} label="EDIT" onClick={() => setActiveTab('edit')} color="#ffcf00" />
            <MainTab active={activeTab === 'delete'} label="DELETE" onClick={() => setActiveTab('delete')} color="#ff4040" />
         </div>

         {/* Object Palette */}
         <div className="flex-1 p-4 bg-[#2a2a2a] overflow-hidden flex flex-col">
            <div className="flex-1 grid grid-cols-12 gap-2 overflow-y-auto pr-2 custom-scrollbar">
               {activeTab === 'build' && (
                 <>
                   <ObjectTile active={selectedType === 'block'} onClick={() => setSelectedType('block')} icon={<div className="w-8 h-8 border-2 border-white/60 bg-black/40" />} />
                   <ObjectTile active={selectedType === 'spike'} onClick={() => setSelectedType('spike')} icon={<div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-white/60" />} />
                   <ObjectTile active={selectedType === 'portal'} onClick={() => setSelectedType('portal')} icon={<div className="w-6 h-10 rounded-full border-2 border-[#ffaa00] bg-[#ffaa00]/20" />} />
                   <div className="w-px h-full bg-white/5 mx-2" />
                   <button 
                    onClick={() => setPortalType(PortalType.MODE_CHANGE)}
                    className={`p-2 rounded border ${portalType === PortalType.MODE_CHANGE ? 'border-[#00e1ff] bg-[#333]' : 'border-white/5'}`}
                   >
                     <span className="text-[10px] text-white font-bold">SHIP</span>
                   </button>
                   <button 
                    onClick={() => setPortalType(PortalType.GRAVITY_SWITCH)}
                    className={`p-2 rounded border ${portalType === PortalType.GRAVITY_SWITCH ? 'border-[#00e1ff] bg-[#333]' : 'border-white/5'}`}
                   >
                     <span className="text-[10px] text-white font-bold">GRAV</span>
                   </button>
                   {/* Dummy tiles to match GD grid feel */}
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="aspect-square bg-black/20 border border-white/5 rounded" />
                   ))}
                 </>
               )}
               {activeTab === 'edit' && (
                  <div className="col-span-12 grid grid-cols-12 gap-2">
                     <ActionTile label="MOVE UP" color="#fff" onClick={() => {}} icon={<Move size={14} className="rotate-0" />} />
                     <ActionTile label="MOVE DN" color="#fff" onClick={() => {}} icon={<Move size={14} className="rotate-180" />} />
                     <ActionTile label="MOVE LF" color="#fff" onClick={() => {}} icon={<Move size={14} className="-rotate-90" />} />
                     <ActionTile label="MOVE RT" color="#fff" onClick={() => {}} icon={<Move size={14} className="rotate-90" />} />
                  </div>
               )}
               {activeTab === 'delete' && (
                  <div className="col-span-12 flex flex-col items-center justify-center p-8 bg-black/20 rounded-xl border border-white/5">
                     <Trash2 size={48} className="text-red-500/20 mb-4" />
                     <p className="text-white/20 font-black uppercase tracking-[0.2em] text-center">Tap items on canvas to erase</p>
                  </div>
               )}
            </div>

            {/* Sub-tabs for construction types */}
            <div className="mt-4 flex gap-1 h-8">
               <div className="flex-1 flex gap-1">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className={`h-full flex-1 rounded-t border-t border-x border-black/40 ${i === 0 ? 'bg-[#00e1ff]' : 'bg-[#333]'}`} />
                  ))}
               </div>
            </div>
         </div>

         {/* Toggle Controls (Swipe/Rotate etc) */}
         <div className="w-[120px] bg-[#212121] border-l border-black/40 p-2 grid grid-cols-1 gap-2 shrink-0">
             <ToggleControl label="SWIPE" active={swipe} onClick={() => setSwipe(!swipe)} color="#bcff00" />
             <ToggleControl label="ROTATE" active={false} color="#ffaa00" />
             <ToggleControl label="SNAP" active={snap} onClick={() => setSnap(!snap)} color="#00e1ff" />
         </div>
      </div>
    </div>
  );
};

const SidebarTool = ({ icon, active, color, onClick }: { icon: React.ReactNode, active: boolean, color?: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl border-2 transition-all ${
      active ? 'bg-white shadow-[0_0_15px_white]' : 'bg-[#333] border-black/40 hover:bg-[#444]'
    }`}
    style={{ color: active ? 'black' : (color || 'white') }}
  >
    {icon}
  </button>
);

const ActionTile = ({ label, color, icon, onClick }: { label: string, color: string, icon: React.ReactNode, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center aspect-square bg-[#333] border border-black/40 rounded-lg hover:bg-[#444] group"
  >
     <div className="transition-transform group-hover:scale-110 mb-1" style={{ color }}>{icon}</div>
     <span className="text-[10px] font-black text-white/40 tracking-tighter">{label}</span>
  </button>
);

const MainTab = ({ active, label, onClick, color }: { active: boolean, label: string, onClick: () => void, color: string }) => (
  <button 
    onClick={onClick}
    className={`w-full py-4 text-[13px] font-black italic tracking-tighter border-2 rounded-xl transition-all ${
      active ? 'bg-white text-black border-white' : 'bg-[#333] text-white/30 border-black/40 hover:bg-[#3a3a3a]'
    }`}
    style={{ borderColor: active ? color : undefined, boxShadow: active ? `0 0 20px ${color}66` : undefined }}
  >
    {label}
  </button>
);

const ObjectTile = ({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`aspect-square flex items-center justify-center bg-[#212121] border-2 rounded-lg transition-all ${
      active ? 'border-[#00e1ff] bg-[#333] shadow-[0_0_15px_#00e1ff44]' : 'border-black/40 hover:bg-[#333]'
    }`}
  >
    <div className="transform scale-75">{icon}</div>
  </button>
);

const ToggleControl = ({ label, active, color, onClick }: { label: string, active: boolean, color: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full h-full flex items-center justify-center border-2 rounded-lg transition-all ${
      active ? 'bg-white text-black' : 'bg-[#333] text-white/30 border-black/40'
    }`}
    style={{ borderColor: active ? color : undefined }}
  >
    <span className="text-[10px] font-black italic tracking-tighter">{label}</span>
  </button>
);

