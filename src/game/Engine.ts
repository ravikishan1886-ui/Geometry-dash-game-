/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  GameState, Player, LevelData, GameMode, 
  GAME_WIDTH, GAME_HEIGHT, BLOCK_SIZE, 
  GRAVITY, JUMP_FORCE, SHIP_FORCE, Vector2D, GameObject, PortalType, Skin 
} from '../types';
import { soundPlayer } from './SoundPlayer';

export class GameEngine {
  public state: GameState;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isTouching: boolean = false;
  private particles: Particle[] = [];
  private onGameOver: () => void;
  private onWin: () => void;
  private lastTime: number = 0;
  private frameCount: number = 0;
  private activeSkin: Skin;

  constructor(canvas: HTMLCanvasElement, level: LevelData, activeSkin: Skin, onGameOver: () => void, onWin: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onGameOver = onGameOver;
    this.onWin = onWin;
    this.activeSkin = activeSkin;
    this.state = this.createInitialState(level);
    this.setupInput();
    soundPlayer.startMusic(level.bpm || 120);
  }

  private createInitialState(level: LevelData): GameState {
    return {
      player: {
        pos: { x: 100, y: GAME_HEIGHT - BLOCK_SIZE - 50 },
        vel: { x: level.speed, y: 0 },
        size: { x: BLOCK_SIZE, y: BLOCK_SIZE },
        mode: GameMode.CUBE,
        isGrounded: false,
        isDead: false,
        gravity: 1,
        rotation: 0,
        attempts: 1
      },
      level,
      progress: 0,
      cameraX: 0,
      isPaused: false
    };
  }

  private setupInput() {
    const startInput = (e: Event) => {
      e.preventDefault();
      this.isTouching = true;
    };
    const endInput = (e: Event) => {
      e.preventDefault();
      this.isTouching = false;
    };

    window.addEventListener('mousedown', startInput);
    window.addEventListener('mouseup', endInput);
    window.addEventListener('touchstart', startInput, { passive: false });
    window.addEventListener('touchend', endInput, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.isTouching = true;
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') this.isTouching = false;
    });
  }

  public update(time: number) {
    if (this.state.isPaused || this.state.player.isDead) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.frameCount++;

    const { player, level } = this.state;

    // Movement
    player.pos.x += player.vel.x;
    
    // Physics based on mode
    if (player.mode === GameMode.CUBE) {
      if (this.isTouching && player.isGrounded) {
        player.vel.y = JUMP_FORCE * player.gravity;
        player.isGrounded = false;
        soundPlayer.playJump();
      }
      player.vel.y += GRAVITY * player.gravity;
      
      // Auto-rotation in air
      if (!player.isGrounded) {
        player.rotation += 0.1 * player.gravity;
      } else {
        // Snap rotation to 90 deg hurdles
        player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
      }
    } else if (player.mode === GameMode.SHIP) {
      if (this.isTouching) {
        player.vel.y += SHIP_FORCE * player.gravity;
      } else {
        player.vel.y += (GRAVITY * 0.5) * player.gravity;
      }
      // Damping for ship
      player.vel.y *= 0.98;
      // Tilt ship based on velocity
      player.rotation = Math.atan2(player.vel.y, player.vel.x * 2);
    }

    player.pos.y += player.vel.y;

    // Collision with ground/ceiling
    if (player.pos.y + player.size.y > GAME_HEIGHT) {
      if (player.mode === GameMode.CUBE) {
        player.pos.y = GAME_HEIGHT - player.size.y;
        player.vel.y = 0;
        player.isGrounded = true;
      } else {
        this.die();
      }
    } else if (player.pos.y < 0) {
      this.die();
    } else {
      player.isGrounded = false;
    }

    // Object collisions
    for (const obj of level.objects) {
      // Simple AABB
      if (this.checkCollision(player, obj)) {
        if (obj.type === 'spike') {
          this.die();
        } else if (obj.type === 'block') {
          this.handleBlockCollision(player, obj);
        } else if (obj.type === 'portal') {
          this.handlePortalCollision(player, obj);
        }
      }
    }

    // Camera follow
    this.state.cameraX = player.pos.x - 150;

    // Progress
    this.state.progress = player.pos.x / level.length;
    if (this.state.progress >= 1) {
      this.onWin();
    }

    // Particles
    if (player.isGrounded && this.frameCount % 2 === 0) {
       this.particles.push(new Particle(player.pos.x, player.pos.y + player.size.y, this.activeSkin.color));
    }
    this.particles = this.particles.filter(p => p.isActive);
    this.particles.forEach(p => p.update());

    this.draw(time);
  }

  private checkCollision(p: Player, obj: GameObject): boolean {
    const margin = obj.type === 'spike' ? 8 : 0;
    return (
      p.pos.x < obj.pos.x + obj.size.x - margin &&
      p.pos.x + p.size.x > obj.pos.x + margin &&
      p.pos.y < obj.pos.y + obj.size.y - margin &&
      p.pos.y + p.size.y > obj.pos.y + margin
    );
  }

  private handleBlockCollision(p: Player, obj: GameObject) {
    // Determine collision side
    const pBottom = p.pos.y + p.size.y;
    const pTop = p.pos.y;
    const pRight = p.pos.x + p.size.x;
    const pLeft = p.pos.x;
    
    const objBottom = obj.pos.y + obj.size.y;
    const objTop = obj.pos.y;
    const objRight = obj.pos.x + obj.size.x;
    const objLeft = obj.pos.x;

    const overlapTop = pBottom - objTop;
    const overlapBottom = objBottom - pTop;
    const overlapLeft = pRight - objLeft;
    const overlapRight = objRight - pLeft;

    const minOverlap = Math.min(overlapTop, overlapBottom, overlapLeft, overlapRight);

    if (minOverlap === overlapLeft) {
      this.die(); // Hit the side
    } else if (minOverlap === overlapTop) {
      p.pos.y = objTop - p.size.y;
      p.vel.y = 0;
      p.isGrounded = true;
    } else if (minOverlap === overlapBottom) {
      p.pos.y = objBottom;
      p.vel.y = 0;
      this.die(); // Usually hit head on bottom in GD is death unless ship
    }
  }

  private handlePortalCollision(p: Player, obj: GameObject) {
    if (!obj.portalData) return;
    const { type, value } = obj.portalData;
    soundPlayer.playPortal();
    if (type === PortalType.MODE_CHANGE) {
      p.mode = value as GameMode;
    } else if (type === PortalType.GRAVITY_SWITCH) {
      p.gravity = value as number;
    }
  }

  private die() {
    if (this.state.player.isDead) return;
    this.state.player.isDead = true;
    soundPlayer.playDeath();
    for (let i = 0; i < 20; i++) {
      this.particles.push(new Particle(this.state.player.pos.x, this.state.player.pos.y, this.activeSkin.color, true));
    }
    setTimeout(() => this.onGameOver(), 500);
  }

  private draw(time: number) {
    const { ctx, canvas, state } = this;
    const { cameraX, player, level } = state;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background pattern (moving slower)
    const bpm = level.bpm || 120;
    const pulse = (Math.sin((time / 1000) * (bpm / 60) * Math.PI) + 1) / 2;
    ctx.strokeStyle = `rgba(0, 242, 255, ${0.05 + pulse * 0.1})`;
    ctx.lineWidth = 1 + pulse * 2;
    const bgX = -(cameraX * 0.2) % 100;
    for (let x = bgX; x < canvas.width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Ground
    ctx.fillStyle = '#111';
    ctx.fillRect(cameraX, GAME_HEIGHT, canvas.width, 100);
    ctx.strokeStyle = '#00f2ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cameraX, GAME_HEIGHT);
    ctx.lineTo(cameraX + canvas.width, GAME_HEIGHT);
    ctx.stroke();

    // Draw objects
    for (const obj of level.objects) {
      if (obj.pos.x + obj.size.x < cameraX || obj.pos.x > cameraX + canvas.width) continue;
      
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = obj.color || '#fff';
      ctx.fillStyle = obj.color || '#fff';
      
      if (obj.type === 'block') {
        ctx.fillRect(obj.pos.x, obj.pos.y, obj.size.x, obj.size.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.strokeRect(obj.pos.x, obj.pos.y, obj.size.x, obj.size.y);
      } else if (obj.type === 'spike') {
        ctx.beginPath();
        ctx.moveTo(obj.pos.x, obj.pos.y + obj.size.y);
        ctx.lineTo(obj.pos.x + obj.size.x / 2, obj.pos.y);
        ctx.lineTo(obj.pos.x + obj.size.x, obj.pos.y + obj.size.y);
        ctx.closePath();
        ctx.fill();
      } else if (obj.type === 'portal') {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = obj.color || '#fff';
        ctx.globalAlpha = 0.8;
        
        // Draw an elliptical portal
        ctx.beginPath();
        const centerX = obj.pos.x + obj.size.x / 2;
        const centerY = obj.pos.y + obj.size.y / 2;
        ctx.ellipse(centerX, centerY, obj.size.x / 2, obj.size.y / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner ring
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.restore();
      }
      ctx.restore();
    }

    // Draw particles
    this.particles.forEach(p => p.draw(ctx));

    // Draw player
    if (!player.isDead) {
      ctx.save();
      ctx.translate(player.pos.x + player.size.x / 2, player.pos.y + player.size.y / 2);
      ctx.rotate(player.rotation);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.activeSkin.color;
      ctx.fillStyle = this.activeSkin.color;
      
      if (player.mode === GameMode.CUBE) {
        ctx.fillRect(-player.size.x / 2, -player.size.y / 2, player.size.x, player.size.y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(-player.size.x / 2, -player.size.y / 2, player.size.x, player.size.y);
        // Face
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(5, -10, 5, 5);
        ctx.fillRect(5, 5, 5, 5);
      } else if (player.mode === GameMode.SHIP) {
        // Simple ship shape
        ctx.beginPath();
        ctx.moveTo(-15, -10);
        ctx.lineTo(20, 0);
        ctx.lineTo(-15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
      }
      
      ctx.restore();
    }

    ctx.restore();
  }
}

class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public size: number;
  public color: string;
  public life: number = 1;
  public decay: number;
  public isActive: boolean = true;
  private isExplosion: boolean;

  constructor(x: number, y: number, color: string, isExplosion = false) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isExplosion = isExplosion;
    this.size = Math.random() * 4 + 2;
    this.decay = Math.random() * 0.05 + 0.02;
    
    if (isExplosion) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    } else {
      this.vx = -Math.random() * 2 - 1;
      this.vy = -Math.random() * 2;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.isExplosion) this.vy += 0.2; // Gravity for explosion
    this.life -= this.decay;
    if (this.life <= 0) this.isActive = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}
