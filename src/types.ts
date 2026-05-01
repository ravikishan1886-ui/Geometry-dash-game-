/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameMode {
  CUBE = 'cube',
  SHIP = 'ship',
  BALL = 'ball',
  WAVE = 'wave'
}

export enum PortalType {
  GRAVITY_SWITCH = 'gravity_switch',
  MODE_CHANGE = 'mode_change',
  SPEED_CHANGE = 'speed_change'
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  type: 'block' | 'spike' | 'portal' | 'collectible' | 'pad';
  pos: Vector2D;
  size: Vector2D;
  color?: string;
  portalData?: {
    type: PortalType;
    value: string | number;
  };
}

export interface Player {
  pos: Vector2D;
  vel: Vector2D;
  size: Vector2D;
  mode: GameMode;
  isGrounded: boolean;
  isDead: boolean;
  gravity: number;
  rotation: number;
  attempts: number;
}

export interface LevelData {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bpm: number;
  speed: number;
  objects: GameObject[];
  length: number; // Total length in x units
}

export interface GameState {
  player: Player;
  level: LevelData;
  progress: number; // 0 to 1
  cameraX: number;
  isPaused: boolean;
  lastCheckpoint?: Vector2D;
}

export interface Skin {
  id: string;
  name: string;
  color: string;
  price: number;
  unlocked: boolean;
}

export interface Mission {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
}

export interface UserProfile {
  orbs: number;
  unlockedSkins: string[];
  activeSkinId: string;
  completedMissions: string[];
  customLevels: LevelData[];
  customSkins: Skin[];
}

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const BLOCK_SIZE = 40;
export const GRAVITY = 0.8;
export const JUMP_FORCE = -12;
export const SHIP_FORCE = -0.5;
