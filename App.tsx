
import React, { useState, useEffect } from 'react';
import { GameState, Card, CardType, Covenant } from './types';
import { createInitialState, drawCards, checkCovenant, createEnemy } from './services/gameLogic';
import { COVENANTS, ALL_CARDS, BOUND_CARDS } from './constants';
import CardUI from './components/CardUI';
import EnemyUI from './components/EnemyUI';

const App: React.FC = () => {
  const [state, setState] = useState<GameState | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [vfxShake, setVfxShake] = useState(false);
  const [vfxFlash, setVfxFlash] = useState(false);

  useEffect(() => {
    const startState = createInitialState();
    setState(drawCards(startState));
  }, []);

  const triggerVFX = (type: 'hit' | 'damage') => {
    if (type === 'hit') setVfxShake(true);
    if (type === 'damage') setVfxFlash(true);
    setTimeout(() => {
      setVfxShake(false);
      setVfxFlash(false);
    }, 400);
  };

  const playCard = (cardId: string) => {
    if (!state || state.trialPhase !== 'COMBAT') return;
    const card = state.grip.find(c => c.id === cardId);
    if (!card || card.type === CardType.SCAR) return;

    triggerVFX('hit');
    
    // Fix: Explicitly type newState as GameState
    let newState: GameState = card.effect({ ...state });
    
    newState.grip = newState.grip.filter(c => c.id !== cardId);
    newState.discard = [...newState.discard, card];
    newState.cardsPlayedThisTurn += 1;
    newState.logs = [`Sử dụng ${card.name}.`, ...newState.logs].slice(0, 5);

    if (newState.currentEnemy && newState.currentEnemy.hp <= 0) {
      newState.trialPhase = 'REWARD';
      newState.logs = ["Kẻ địch gục ngã. Chọn phần thưởng.", ...newState.logs];
    }

    setState(newState);
  };

  const endTurn = () => {
    if (!state || !state.currentEnemy) return;

    const { updatedState } = checkCovenant(state);
    // Fix: Explicitly type newState as GameState
    let newState: GameState = { ...updatedState };

    const damage = Math.max(0, newState.currentEnemy.intent.value - newState.playerBlock);
    if (damage > 0) triggerVFX('damage');

    newState.playerHp = Math.max(0, newState.playerHp - damage);
    newState.playerBlock = 0;
    newState.logs = [`Kẻ địch tấn công: -${damage} HP.`, ...newState.logs].slice(0, 5);

    const scars = newState.grip.filter(c => c.name === 'Bleed Memory');
    if (scars.length > 0) {
      newState.playerHp = Math.max(0, newState.playerHp - (scars.length * 2));
      newState.logs = [`Vết sẹo rỉ máu: -${scars.length * 2} HP`, ...newState.logs];
    }

    if (newState.playerHp <= 0) {
      newState.isGameOver = true;
    } else {
      newState.turn += 1;
      newState.cardsPlayedThisTurn = 0;
      newState = drawCards(newState);
    }

    setState(newState);
  };

  const handleBind = () => {
    if (!state || selectedCards.length !== 3) return;
    const cards = state.grip.filter(c => selectedCards.includes(c.id));
    const firstType = cards[0].name;
    
    if (cards.every(c => c.name === firstType && c.isBindable)) {
      const boundCard = { ...BOUND_CARDS['Bound Strike'], id: `bound-${Date.now()}` };
      // Fix: Explicitly type newState as GameState
      let newState: GameState = { ...state };
      newState.grip = state.grip.filter(c => !selectedCards.includes(c.id));
      newState.grip = [...newState.grip, boundCard];
      newState.logs = [`Hợp nhất 3 ${firstType} thành ${boundCard.name}!`, ...newState.logs];
      setState(newState);
      setSelectedCards([]);
      triggerVFX('hit');
    }
  };

  const selectReward = (card: Card) => {
    if (!state) return;
    // Fix: Explicitly type newState as GameState
    let newState: GameState = { ...state, burden: [...state.burden, { ...card, id: `rew-${Date.now()}` }] };
    if (newState.covenant === null) newState.trialPhase = 'COVENANT';
    else {
      newState.trialPhase = 'COMBAT';
      newState.currentEnemy = createEnemy(newState.turn / 2 + 1);
      newState = drawCards(newState);
    }
    setState(newState);
  };

  const selectCovenant = (cov: Covenant) => {
    if (!state) return;
    // Fix: Removed 'as const' and explicitly typed newState as GameState to avoid narrowing 'trialPhase' to just 'COMBAT'
    let newState: GameState = { ...state, covenant: cov, trialPhase: 'COMBAT' };
    newState.currentEnemy = createEnemy(2);
    newState = drawCards(newState);
    setState(newState);
  };

  if (!state) return null;

  if (state.isGameOver) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black p-8 text-center font-serif">
        <h1 className="text-7xl text-red-600 mb-4 animate-pulse uppercase tracking-tighter">Gục Ngã</h1>
        <p className="text-zinc-500 mb-8 italic">Grip đã tuột khỏi tay. Hư vô đang chờ đợi.</p>
        <button onClick={() => window.location.reload()} className="border border-zinc-700 px-8 py-3 text-zinc-300 hover:bg-zinc-900 uppercase tracking-widest transition-all">
          Thử Thách Lại
        </button>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen flex flex-col relative overflow-hidden ${vfxShake ? 'vfx-shake' : ''} ${vfxFlash ? 'vfx-flash-red' : ''}`}>
      {/* Header */}
      <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-black/50 backdrop-blur-lg z-30">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center text-red-500 font-bold text-xl shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              {state.playerHp}
            </div>
            {state.playerBlock > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 px-1.5 rounded text-[10px] font-bold border border-blue-400">+{state.playerBlock}</div>
            )}
          </div>
          <div>
            <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Khế Ước</div>
            <div className="text-sm font-serif italic text-zinc-300">{state.covenant?.name || "Chưa ký kết"}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-500 uppercase font-bold">Lượt Thử Thách</div>
          <div className="font-serif text-2xl">{state.turn}</div>
        </div>
      </div>

      {/* Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
        {state.trialPhase === 'COMBAT' && state.currentEnemy && <EnemyUI enemy={state.currentEnemy} />}
        
        {state.trialPhase === 'REWARD' && (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="font-serif text-3xl text-zinc-400 italic text-center">Chọn Thêm Gánh Nặng</h2>
            <div className="flex gap-4">
              {ALL_CARDS.slice(5, 8).map(c => <CardUI key={c.id} card={c} onClick={() => selectReward(c)} />)}
            </div>
          </div>
        )}

        {state.trialPhase === 'COVENANT' && (
          <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <h2 className="font-serif text-3xl text-zinc-400 italic">Ký Kết Khế Ước</h2>
            <div className="grid gap-4 w-full max-w-sm">
              {COVENANTS.map(c => (
                <button key={c.type} onClick={() => selectCovenant(c)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 text-left transition-all group">
                  <div className="font-bold text-zinc-400 group-hover:text-white uppercase text-xs tracking-widest">{c.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{c.rule}</div>
                  <div className="text-[10px] text-red-900 font-bold uppercase mt-1">{c.violation}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="absolute bottom-4 left-6 pointer-events-none opacity-40 text-[10px] font-mono flex flex-col-reverse gap-1">
          {state.logs.map((log, i) => <div key={i}>{`> ${log}`}</div>)}
        </div>
      </div>

      {/* Grip (Hand) */}
      <div className="p-6 bg-black/80 border-t border-zinc-900 space-y-6 z-40">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Grip Space</span>
            <div className="flex space-x-1.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const totalCost = state.grip.reduce((acc, c) => acc + c.costInGrip, 0);
                return <div key={i} className={`w-3 h-3 rounded-sm border border-zinc-800 transition-all ${i < totalCost ? 'bg-red-500/40 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]' : ''}`} />;
              })}
            </div>
          </div>
          <div className="text-[10px] text-zinc-600 font-bold">{state.burden.length} Deck / {state.discard.length} Discard</div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
          {state.grip.map(card => (
            <CardUI 
              key={card.id} 
              card={card} 
              selected={selectedCards.includes(card.id)} 
              disabled={state.trialPhase !== 'COMBAT'}
              onClick={() => {
                if (card.isBindable) {
                  setSelectedCards(prev => prev.includes(card.id) ? prev.filter(i => i !== card.id) : [...prev, card.id]);
                } else playCard(card.id);
              }} 
            />
          ))}
          {Array.from({ length: 5 - state.grip.length }).map((_, i) => (
            <div key={i} className="w-28 h-40 shrink-0 border-2 border-dashed border-zinc-900 rounded-xl flex items-center justify-center text-zinc-800 text-[10px] font-bold">VOID</div>
          ))}
        </div>

        <div className="flex gap-2">
          {selectedCards.length > 0 ? (
            <button onClick={handleBind} disabled={selectedCards.length !== 3} className={`flex-1 py-4 rounded-xl border-2 font-bold uppercase tracking-widest transition-all ${selectedCards.length === 3 ? 'border-orange-500 text-orange-400 bg-orange-950/20 shadow-lg shadow-orange-900/10' : 'border-zinc-800 text-zinc-700 cursor-not-allowed'}`}>
              Hợp Nhất ({selectedCards.length}/3)
            </button>
          ) : (
            <button onClick={endTurn} disabled={state.trialPhase !== 'COMBAT'} className="flex-1 bg-zinc-100 text-black py-4 rounded-xl font-bold uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-20 active:scale-95 shadow-xl">
              Kết Thúc Lượt
            </button>
          )}
          {selectedCards.length > 0 && <button onClick={() => setSelectedCards([])} className="px-6 border border-zinc-800 text-zinc-500 rounded-xl hover:text-white transition-all">✕</button>}
        </div>
      </div>
    </div>
  );
};

export default App;
