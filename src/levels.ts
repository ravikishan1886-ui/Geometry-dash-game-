/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LevelData, BLOCK_SIZE, PortalType, GameMode } from './types';

export const LEVEL_1: LevelData = {
  id: '1',
  name: 'Neon Start',
  difficulty: 'Easy',
  bpm: 120,
  speed: 6,
  length: 5000,
  objects: [
    // Blocks
    { id: 'b1', type: 'block', pos: { x: 400, y: 350 }, size: { x: BLOCK_SIZE * 3, y: BLOCK_SIZE }, color: '#00f2ff' },
    { id: 'b2', type: 'block', pos: { x: 800, y: 300 }, size: { x: BLOCK_SIZE * 5, y: BLOCK_SIZE }, color: '#00f2ff' },
    { id: 'b3', type: 'block', pos: { x: 1200, y: 350 }, size: { x: BLOCK_SIZE, y: BLOCK_SIZE }, color: '#00f2ff' },
    
    // Spikes
    { id: 's1', type: 'spike', pos: { x: 600, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's2', type: 'spike', pos: { x: 900, y: 260 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's3', type: 'spike', pos: { x: 1400, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's4', type: 'spike', pos: { x: 1440, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },

    // Portal to Ship
    { 
      id: 'p1', 
      type: 'portal', 
      pos: { x: 2000, y: 200 }, 
      size: { x: 50, y: 150 }, 
      color: '#ffaa00',
      portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP }
    },
    
    // More Ship obstacles
    { id: 'sb1', type: 'block', pos: { x: 2200, y: 0 }, size: { x: 1000, y: 100 }, color: '#00f2ff' },
    { id: 'sb2', type: 'block', pos: { x: 2200, y: 350 }, size: { x: 1000, y: 100 }, color: '#00f2ff' },
    { id: 'ss1', type: 'spike', pos: { x: 2400, y: 100 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    
    // Gravity switch portal
    { 
      id: 'p2', 
      type: 'portal', 
      pos: { x: 3500, y: 200 }, 
      size: { x: 50, y: 150 }, 
      color: '#aa00ff',
      portalData: { type: PortalType.GRAVITY_SWITCH, value: -1 }
    },
  ]
};

export const LEVEL_2: LevelData = {
  id: '2',
  name: 'Gravity Rush',
  difficulty: 'Medium',
  bpm: 140,
  speed: 8,
  length: 8000,
  objects: [
    { id: 'b1', type: 'block', pos: { x: 400, y: 350 }, size: { x: 400, y: 40 }, color: '#00f2ff' },
    { id: 's1', type: 'spike', pos: { x: 600, y: 310 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'p1', type: 'portal', pos: { x: 1000, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: -1 } },
    // Objects for inverted gravity
    { id: 'b2', type: 'block', pos: { x: 1200, y: 50 }, size: { x: 400, y: 40 }, color: '#00f2ff' },
    { id: 's2', type: 'spike', pos: { x: 1400, y: 90 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'p2', type: 'portal', pos: { x: 2000, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: 1 } },
    // Ship segment
    { id: 'p3', type: 'portal', pos: { x: 2500, y: 150 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
    { id: 'sb1', type: 'block', pos: { x: 2700, y: 0 }, size: { x: 2000, y: 50 }, color: '#00f2ff' },
    { id: 'sb2', type: 'block', pos: { x: 2700, y: 400 }, size: { x: 2000, y: 50 }, color: '#00f2ff' },
    { id: 'ss1', type: 'spike', pos: { x: 3000, y: 50 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'ss2', type: 'spike', pos: { x: 3500, y: 370 }, size: { x: 30, y: 30 }, color: '#ff0055' },
  ]
};

export const LEVEL_3: LevelData = {
  id: '3',
  name: 'Final Pulse',
  difficulty: 'Hard',
  bpm: 170,
  speed: 10,
  length: 12000,
  objects: [
    // Tight jumps
    { id: 'b1', type: 'block', pos: { x: 400, y: 350 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 'b2', type: 'block', pos: { x: 550, y: 300 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 'b3', type: 'block', pos: { x: 700, y: 250 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 's1', type: 'spike', pos: { x: 800, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's2', type: 'spike', pos: { x: 840, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'p1', type: 'portal', pos: { x: 1200, y: 150 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
    // Tight ship tunnel
    { id: 'sb1', type: 'block', pos: { x: 1400, y: 100 }, size: { x: 3000, y: 40 }, color: '#00f2ff' },
    { id: 'sb2', type: 'block', pos: { x: 1400, y: 310 }, size: { x: 3000, y: 40 }, color: '#00f2ff' },
    { id: 'ss1', type: 'spike', pos: { x: 1800, y: 140 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'ss2', type: 'spike', pos: { x: 2200, y: 280 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'ss3', type: 'spike', pos: { x: 2600, y: 140 }, size: { x: 30, y: 30 }, color: '#ff0055' },
  ]
};

export const LEVEL_4: LevelData = {
  id: '4',
  name: 'Cyber Wave',
  difficulty: 'Medium',
  bpm: 150,
  speed: 9,
  length: 9000,
  objects: [
    { id: 'b1', type: 'block', pos: { x: 400, y: 350 }, size: { x: 400, y: 40 }, color: '#00f2ff' },
    { id: 'p1', type: 'portal', pos: { x: 1000, y: 200 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
    { id: 'sb1', type: 'block', pos: { x: 1200, y: 0 }, size: { x: 2000, y: 150 }, color: '#00f2ff' },
    { id: 'sb2', type: 'block', pos: { x: 1200, y: 300 }, size: { x: 2000, y: 150 }, color: '#00f2ff' },
    { id: 'ss1', type: 'spike', pos: { x: 1500, y: 150 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'ss2', type: 'spike', pos: { x: 2000, y: 250 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'ss3', type: 'spike', pos: { x: 2500, y: 150 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'p2', type: 'portal', pos: { x: 3500, y: 200 }, size: { x: 50, y: 150 }, color: '#00ff73', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.CUBE } },
    { id: 'b2', type: 'block', pos: { x: 4000, y: 350 }, size: { x: 400, y: 40 }, color: '#00f2ff' },
    { id: 's4', type: 'spike', pos: { x: 4200, y: 310 }, size: { x: 30, y: 30 }, color: '#ff0055' },
  ]
};

export const LEVEL_5: LevelData = {
  id: '5',
  name: 'Toxic Tunnels',
  difficulty: 'Hard',
  bpm: 160,
  speed: 11,
  length: 10000,
  objects: [
    { id: 'b1', type: 'block', pos: { x: 400, y: 350 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 'p1', type: 'portal', pos: { x: 800, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: -1 } },
    { id: 'b2', type: 'block', pos: { x: 1000, y: 40 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 'p2', type: 'portal', pos: { x: 1500, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: 1 } },
    { id: 'p3', type: 'portal', pos: { x: 2000, y: 200 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
    { id: 'sb1', type: 'block', pos: { x: 2200, y: 50 }, size: { x: 3000, y: 40 }, color: '#00f2ff' },
    { id: 'sb2', type: 'block', pos: { x: 2200, y: 360 }, size: { x: 3000, y: 40 }, color: '#00f2ff' },
    { id: 'p4', type: 'portal', pos: { x: 5500, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: -1 } },
    { id: 'p5', type: 'portal', pos: { x: 7500, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: 1 } },
  ]
};

export const LEVEL_6: LevelData = {
  id: '6',
  name: 'Neon Legend',
  difficulty: 'Hard',
  bpm: 180,
  speed: 12,
  length: 15000,
  objects: [
    { id: 's1', type: 'spike', pos: { x: 500, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's2', type: 'spike', pos: { x: 540, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 's3', type: 'spike', pos: { x: 580, y: 410 }, size: { x: 30, y: 30 }, color: '#ff0055' },
    { id: 'b1', type: 'block', pos: { x: 800, y: 350 }, size: { x: 40, y: 40 }, color: '#00f2ff' },
    { id: 'p1', type: 'portal', pos: { x: 1200, y: 200 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
    { id: 'p2', type: 'portal', pos: { x: 3000, y: 200 }, size: { x: 50, y: 150 }, color: '#00ff73', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.CUBE } },
    { id: 'p3', type: 'portal', pos: { x: 5000, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: -1 } },
    { id: 'p4', type: 'portal', pos: { x: 7000, y: 200 }, size: { x: 50, y: 150 }, color: '#aa00ff', portalData: { type: PortalType.GRAVITY_SWITCH, value: 1 } },
    { id: 'p5', type: 'portal', pos: { x: 9000, y: 200 }, size: { x: 50, y: 150 }, color: '#ffaa00', portalData: { type: PortalType.MODE_CHANGE, value: GameMode.SHIP } },
  ]
};

export const LEVELS: LevelData[] = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_6];
