/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu } from './components/Menu';
import { LevelSelector } from './components/LevelSelector';
import { GameView } from './components/GameView';
import { SkinsMenu } from './components/SkinsMenu';
import { DailyMissions } from './components/DailyMissions';
import { SettingsMenu } from './components/SettingsMenu';
import { LevelEditor } from './components/LevelEditor';
import { SkinDesigner } from './components/SkinDesigner';
import { LevelData, UserProfile } from './types';
import { SKINS } from './constants';
import { LEVELS } from './levels';

type Screen = 'menu' | 'selector' | 'game' | 'shop' | 'missions' | 'settings' | 'editor' | 'designer';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('neon-dash-profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        customLevels: parsed.customLevels || [],
        customSkins: parsed.customSkins || []
      };
    }
    return {
      orbs: 0,
      unlockedSkins: ['classic'],
      activeSkinId: 'classic',
      completedMissions: [],
      customLevels: [],
      customSkins: []
    };
  });

  const [bestProgress, setBestProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('neon-dash-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('neon-dash-profile', JSON.stringify(profile));
  }, [profile]);

  const onSelectLevel = (level: LevelData) => {
    startGame(level);
  };

  const handleWin = (levelId: string) => {
    const newProgress = { ...bestProgress, [levelId]: 100 };
    setBestProgress(newProgress);
    localStorage.setItem('neon-dash-progress', JSON.stringify(newProgress));
    
    // Reward player with orbs on first win or even every win
    const reward = 50; 
    setProfile(prev => ({ ...prev, orbs: prev.orbs + reward }));
  };

  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);

  const goToSelector = () => setScreen('selector');
  const goToMenu = () => setScreen('menu');
  const goToShop = () => setScreen('shop');
  const goToMissions = () => setScreen('missions');
  const goToSettings = () => setScreen('settings');
  const goToEditor = () => setScreen('editor');
  const goToDesigner = () => setScreen('designer');

  const startGame = (level: LevelData) => {
    setSelectedLevel(level);
    setScreen('game');
  };

  const buySkin = (id: string, price: number) => {
    if (profile.orbs >= price) {
      setProfile(prev => ({
        ...prev,
        orbs: prev.orbs - price,
        unlockedSkins: [...prev.unlockedSkins, id]
      }));
    }
  };

  const selectSkin = (id: string) => {
    setProfile(prev => ({ ...prev, activeSkinId: id }));
  };

  const saveCustomLevel = (level: LevelData) => {
    setProfile(prev => ({
      ...prev,
      customLevels: [...(prev.customLevels || []), level]
    }));
    setScreen('selector');
  };

  const saveCustomSkin = (skin: any) => {
    setProfile(prev => ({
      ...prev,
      customSkins: [...(prev.customSkins || []), skin],
      unlockedSkins: [...prev.unlockedSkins, skin.id],
      activeSkinId: skin.id
    }));
    setScreen('shop');
  };

  const activeSkin = SKINS.find(s => s.id === profile.activeSkinId) || 
                     (profile.customSkins || []).find(s => s.id === profile.activeSkinId) || 
                     SKINS[0];

  const allLevels = [...LEVELS, ...(profile.customLevels || [])];

  const startNextLevel = () => {
    if (!selectedLevel) return;
    const currentIndex = allLevels.findIndex(l => l.id === selectedLevel.id);
    const nextLevel = allLevels[currentIndex + 1];
    if (nextLevel) {
      startGame(nextLevel);
    } else {
      setScreen('selector');
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden select-none touch-none">
      {screen === 'menu' && (
        <Menu 
          onStart={goToSelector} 
          onShop={goToShop} 
          onMissions={goToMissions} 
          onSettings={goToSettings} 
          orbs={profile.orbs}
        />
      )}
      {screen === 'selector' && (
        <LevelSelector 
          onSelect={onSelectLevel} 
          onBack={goToMenu}
          progress={bestProgress}
          customLevels={profile.customLevels || []}
          onOpenEditor={goToEditor}
        />
      )}
      {screen === 'game' && selectedLevel && (
        <GameView 
          level={selectedLevel} 
          activeSkin={activeSkin}
          onExit={goToSelector}
          onWin={() => handleWin(selectedLevel.id)}
          onContinue={startNextLevel}
        />
      )}
      {screen === 'shop' && (
        <SkinsMenu 
          orbs={profile.orbs}
          unlockedSkins={profile.unlockedSkins}
          activeSkinId={profile.activeSkinId}
          customSkins={profile.customSkins || []}
          onSelect={selectSkin}
          onBuy={buySkin}
          onBack={goToMenu}
          onOpenDesigner={goToDesigner}
        />
      )}
      {screen === 'missions' && (
        <DailyMissions 
          completedMissions={profile.completedMissions} 
          onBack={goToMenu} 
        />
      )}
      {screen === 'settings' && (
        <SettingsMenu onBack={goToMenu} />
      )}
      {screen === 'editor' && (
        <LevelEditor onSave={saveCustomLevel} onBack={goToSelector} />
      )}
      {screen === 'designer' && (
        <SkinDesigner onSave={saveCustomSkin} onBack={goToShop} />
      )}
    </div>
  );
}
