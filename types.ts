
export enum CardType {
  PRESSURE = 'PRESSURE',
  STABILITY = 'STABILITY',
  CONTROL = 'CONTROL',
  COMMITMENT = 'COMMITMENT',
  BINDABLE = 'BINDABLE',
  BOUND = 'BOUND',
  SCAR = 'SCAR',
  SPECIAL = 'SPECIAL'
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  description: string;
  costInGrip: number; // 1 or 2
  effect: (state: any) => any;
  icon: string;
  isBindable?: boolean;
  onEndTurn?: (state: any) => any;
  onDiscard?: (state: any) => any;
  onPlay?: (state: any) => any;
}

export enum CovenantType {
  BALANCE = 'BALANCE',
  BLOOD = 'BLOOD',
  RESTRAINT = 'RESTRAINT',
  DELAY = 'DELAY',
  BURDEN = 'BURDEN',
  COMMITMENT = 'COMMITMENT'
}

export interface Covenant {
  type: CovenantType;
  name: string;
  rule: string;
  tension: string;
  violation: string;
  punishmentScar: string;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE' | 'CURSED';
  icon: string;
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  intent: {
    type: 'ATTACK' | 'DEBUFF' | 'SCAR';
    value: number;
    description: string;
  };
}

export interface GameState {
  playerHp: number;
  maxPlayerHp: number;
  playerBlock: number;
  burden: Card[]; // Deck
  grip: Card[]; // Hand
  discard: Card[];
  covenant: Covenant | null;
  artifacts: Artifact[];
  currentEnemy: Enemy | null;
  turn: number;
  cardsPlayedThisTurn: number;
  isGameOver: boolean;
  logs: string[];
  trialPhase: 'DISPOSITION' | 'COMBAT' | 'REWARD' | 'COVENANT' | 'EVENT';
  nextStartTime?: number;
}
