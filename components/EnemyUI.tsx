
import React from 'react';
import { Enemy } from '../types';

interface EnemyUIProps {
  enemy: Enemy;
}

const EnemyUI: React.FC<EnemyUIProps> = ({ enemy }) => {
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-sm space-y-8 animate-in fade-in duration-1000">
      <div className="relative vfx-float">
        <div className="text-8xl md:text-9xl filter drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">👺</div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900/90 border border-zinc-800 px-4 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-zinc-300 shadow-2xl whitespace-nowrap">
           <span className="text-red-500">Ý định:</span> {enemy.intent.description} ({enemy.intent.value})
        </div>
      </div>
      
      <div className="w-full space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          <span>{enemy.name}</span>
          <span className="text-red-500">{enemy.hp} / {enemy.maxHp} HP</span>
        </div>
        <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800 shadow-inner">
          <div 
            className="bg-gradient-to-r from-red-900 to-red-500 h-full transition-all duration-700 ease-out relative" 
            style={{ width: `${hpPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnemyUI;
