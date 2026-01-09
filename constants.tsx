import React from 'react';
import { Card, CardType, Covenant, CovenantType } from './types';

// Fix: Updated card effects to correctly target currentEnemy.hp within the GameState
export const STARTER_BURDEN: Card[] = [
  {
    id: 'strike-1',
    name: 'Strike',
    type: CardType.PRESSURE,
    description: 'Deal 6 damage.',
    costInGrip: 1,
    icon: '⚔️',
    effect: (s) => ({ 
      ...s, 
      currentEnemy: s.currentEnemy ? { ...s.currentEnemy, hp: Math.max(0, s.currentEnemy.hp - 6) } : s.currentEnemy 
    })
  },
  {
    id: 'strike-2',
    name: 'Strike',
    type: CardType.PRESSURE,
    description: 'Deal 6 damage.',
    costInGrip: 1,
    icon: '⚔️',
    effect: (s) => ({ 
      ...s, 
      currentEnemy: s.currentEnemy ? { ...s.currentEnemy, hp: Math.max(0, s.currentEnemy.hp - 6) } : s.currentEnemy 
    })
  },
  {
    id: 'guard-1',
    name: 'Guard',
    type: CardType.STABILITY,
    description: 'Gain 5 Block.',
    costInGrip: 1,
    icon: '🛡️',
    effect: (s) => ({ ...s, playerBlock: s.playerBlock + 5 })
  },
  {
    id: 'guard-2',
    name: 'Guard',
    type: CardType.STABILITY,
    description: 'Gain 5 Block.',
    costInGrip: 1,
    icon: '🛡️',
    effect: (s) => ({ ...s, playerBlock: s.playerBlock + 5 })
  },
  {
    id: 'focus-1',
    name: 'Focus',
    type: CardType.CONTROL,
    description: 'Discard 1 card. Draw 1 card.',
    costInGrip: 1,
    icon: '👁️',
    effect: (s) => s // Handled specifically in App.tsx
  }
];

export const COVENANTS: Covenant[] = [
  {
    type: CovenantType.BALANCE,
    name: 'Covenant of Balance',
    rule: 'Play 1 or 2 cards per turn.',
    tension: 'Anti-spam & Anti-turtle',
    violation: 'Playing 0 or 3+ cards.',
    punishmentScar: 'Bleed Memory'
  },
  {
    type: CovenantType.BLOOD,
    name: 'Covenant of Blood',
    rule: 'Playing >= 2 cards buffs damage.',
    tension: 'Aggression comes with risk.',
    violation: 'Playing 3+ cards.',
    punishmentScar: 'Backlash'
  },
  {
    type: CovenantType.RESTRAINT,
    name: 'Covenant of Restraint',
    rule: 'Max 2 cards per turn.',
    tension: 'Limited action economy.',
    violation: 'Trying to play 3rd card.',
    punishmentScar: 'Constrict'
  }
];

export const ALL_CARDS: Card[] = [
  ...STARTER_BURDEN,
  {
    id: 'overreach',
    name: 'Overreach',
    type: CardType.PRESSURE,
    description: 'Deal 12 damage. If Grip full, gain 1 Scar.',
    costInGrip: 1,
    icon: '⚡',
    effect: (s) => ({ 
      ...s, 
      currentEnemy: s.currentEnemy ? { ...s.currentEnemy, hp: Math.max(0, s.currentEnemy.hp - 12) } : s.currentEnemy 
    })
  },
  {
    id: 'brace',
    name: 'Brace',
    type: CardType.STABILITY,
    description: 'Gain 8 Block. Next turn, draw -1.',
    costInGrip: 1,
    icon: '🩹',
    effect: (s) => ({ ...s, playerBlock: s.playerBlock + 8 })
  },
  {
    id: 'ritual-strike',
    name: 'Ritual Strike',
    type: CardType.BINDABLE,
    description: 'Deal 5 damage. Bindable.',
    costInGrip: 1,
    icon: '⛓️',
    isBindable: true,
    effect: (s) => ({ 
      ...s, 
      currentEnemy: s.currentEnemy ? { ...s.currentEnemy, hp: Math.max(0, s.currentEnemy.hp - 5) } : s.currentEnemy 
    })
  }
];

export const SCAR_CARDS: Record<string, Card> = {
  'Constrict': {
    id: 'scar-constrict',
    name: 'Constrict',
    type: CardType.SCAR,
    description: 'Occupies 1 Grip Space. No effect.',
    costInGrip: 1,
    icon: '🐍',
    effect: (s) => s
  },
  'Bleed Memory': {
    id: 'scar-bleed',
    name: 'Bleed Memory',
    type: CardType.SCAR,
    description: 'End Turn: Lose 2 HP if in Grip.',
    costInGrip: 1,
    icon: '🩸',
    effect: (s) => s
  },
  'Backlash': {
    id: 'scar-backlash',
    name: 'Backlash',
    type: CardType.SCAR,
    description: 'Play or Discard: Lose 3 HP.',
    costInGrip: 1,
    icon: '💥',
    effect: (s) => s
  }
};

export const BOUND_CARDS: Record<string, Card> = {
  'Bound Strike': {
    id: 'bound-strike',
    name: 'Bound Strike',
    type: CardType.BOUND,
    description: 'Deal 25 damage. Occupies 2 Grip Space.',
    costInGrip: 2,
    icon: '🔥',
    effect: (s) => ({ 
      ...s, 
      currentEnemy: s.currentEnemy ? { ...s.currentEnemy, hp: Math.max(0, s.currentEnemy.hp - 25) } : s.currentEnemy 
    })
  }
};
