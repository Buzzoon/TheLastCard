
import React from 'react';
import { Card, CardType } from '../types';

interface CardUIProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

const CardUI: React.FC<CardUIProps> = ({ card, onClick, disabled, selected }) => {
  const isScar = card.type === CardType.SCAR;
  const isBound = card.type === CardType.BOUND;
  
  const colors = {
    [CardType.PRESSURE]: 'border-red-500/40 text-red-400 bg-red-950/5',
    [CardType.STABILITY]: 'border-blue-500/40 text-blue-400 bg-blue-950/5',
    [CardType.CONTROL]: 'border-purple-500/40 text-purple-400 bg-purple-950/5',
    [CardType.SCAR]: 'border-zinc-800 bg-zinc-900/50 text-zinc-500',
    [CardType.BINDABLE]: 'border-orange-500/40 text-orange-400 bg-orange-950/5',
    [CardType.BOUND]: 'border-yellow-500 bg-yellow-950/20 text-yellow-400 vfx-glow-bound',
    [CardType.COMMITMENT]: 'border-white text-white',
    [CardType.SPECIAL]: 'border-green-500 text-green-400'
  };

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative w-28 h-40 md:w-32 md:h-48 rounded-xl border-2 flex flex-col items-center p-3 text-center transition-all cursor-pointer shrink-0 snap-center
        ${colors[card.type] || 'border-zinc-700'}
        ${disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-white/50 active:scale-90'}
        ${selected ? 'ring-4 ring-white -translate-y-4 scale-110 z-10 shadow-2xl' : ''}
        ${isScar ? 'grayscale contrast-50' : ''}
      `}
    >
      <div className="text-3xl mb-2 filter drop-shadow-md">{card.icon}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1 line-clamp-1 w-full">{card.name}</div>
      <div className="flex-1 text-[9px] leading-tight text-zinc-400 overflow-hidden italic">
        {card.description}
      </div>
      
      <div className="absolute top-2 right-2 flex gap-0.5">
        {Array.from({ length: card.costInGrip }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full ${isScar ? 'bg-zinc-600' : 'bg-current shadow-[0_0_5px_currentColor]'}`} />
        ))}
      </div>
      
      {card.isBindable && (
        <div className="absolute bottom-2 right-2 text-[10px] opacity-40">⛓️</div>
      )}
    </div>
  );
};

export default CardUI;
