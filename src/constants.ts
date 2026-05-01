/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Skin, Mission } from './types';

export const SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Neon', color: '#ffffff', price: 0, unlocked: true },
  { id: 'cyan', name: 'Cyan Pulse', color: '#00f2ff', price: 100, unlocked: false },
  { id: 'magenta', name: 'Magenta Echo', color: '#ff007a', price: 250, unlocked: false },
  { id: 'lime', name: 'Lime Void', color: '#bcff00', price: 500, unlocked: false },
  { id: 'gold', name: 'Golden Dash', color: '#ffd700', price: 1000, unlocked: false },
];

export const MISSIONS: Mission[] = [
  { id: 'm1', description: 'Complete a level', reward: 50, completed: false },
  { id: 'm2', description: 'Reach 50% in any level', reward: 20, completed: false },
  { id: 'm3', description: 'Fail 10 times', reward: 30, completed: false },
];
