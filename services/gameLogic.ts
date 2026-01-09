import { Card, CardType, GameState, Enemy, CovenantType } from '../types';
import { STARTER_BURDEN, SCAR_CARDS } from '../constants';

export const createInitialState = (): GameState => ({
  playerHp: 30,
  maxPlayerHp: 30,
  playerBlock: 0,
  burden: [...STARTER_BURDEN].sort(() => Math.random() - 0.5),
  grip: [],
  discard: [],
  covenant: null,
  artifacts: [],
  currentEnemy: createEnemy(1),
  turn: 1,
  cardsPlayedThisTurn: 0,
  isGameOver: false,
  logs: ["The Trial begins. Your Grip is empty."],
  trialPhase: 'COMBAT'
});

export function createEnemy(level: number): Enemy {
  return {
    name: level === 5 ? "The Arbiter" : "Disciple of Scars",
    hp: 40 + (level * 10),
    maxHp: 40 + (level * 10),
    intent: {
      type: 'ATTACK',
      value: 6 + level,
      description: "Preparing to strike"
    }
  };
}

export function drawCards(state: GameState): GameState {
  let newState = { ...state };
  const currentGripUsage = newState.grip.reduce((acc, c) => acc + c.costInGrip, 0);
  const maxGrip = 5;
  let remainingGrip = maxGrip - currentGripUsage;

  const newGrip = [...newState.grip];
  const newBurden = [...newState.burden];
  const newDiscard = [...newState.discard];

  while (remainingGrip > 0 && (newBurden.length > 0 || newDiscard.length > 0)) {
    if (newBurden.length === 0) {
      newBurden.push(...newDiscard.splice(0, newDiscard.length).sort(() => Math.random() - 0.5));
    }
    
    const card = newBurden.pop();
    if (card) {
      if (card.costInGrip <= remainingGrip) {
        newGrip.push(card);
        remainingGrip -= card.costInGrip;
      } else {
        // Can't fit this card, put back or stop
        newBurden.push(card);
        break;
      }
    }
  }

  return { ...newState, grip: newGrip, burden: newBurden, discard: newDiscard };
}

// Fix: SCAR_CARDS is imported from constants.tsx. Also ensuring grip is updated immutably.
export function checkCovenant(state: GameState): { updatedState: GameState, violated: boolean } {
  if (!state.covenant) return { updatedState: state, violated: false };
  
  let violated = false;
  const count = state.cardsPlayedThisTurn;
  
  switch(state.covenant.type) {
    case CovenantType.BALANCE:
      if (count === 0 || count >= 3) violated = true;
      break;
    case CovenantType.BLOOD:
      if (count >= 3) violated = true;
      break;
    case CovenantType.RESTRAINT:
      // Handled during play action usually, but check here too
      if (count > 2) violated = true;
      break;
    default:
      break;
  }

  let newState = { ...state };
  if (violated && state.covenant) {
    const scarName = state.covenant.punishmentScar;
    const scarCard = { ...SCAR_CARDS[scarName], id: `scar-${Date.now()}` };
    newState.logs = [`COVENANT VIOLATED! Punishment: ${scarName} added to Grip.`, ...newState.logs];
    // Immutable update to grip array
    newState.grip = [...newState.grip, scarCard];
  }

  return { updatedState: newState, violated };
}
