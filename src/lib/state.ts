import { buildBracketStateFromSetup, createDefaultBracketSetup, normalizeBracketSetup, normalizeBracketState } from './bracket';
import { createBracketMatchesFromState } from './bracketMatches';
import type { OverlayState } from '../types';

const DEFAULT_BRACKET_SETUP = createDefaultBracketSetup();
const DEFAULT_BRACKET = buildBracketStateFromSetup(DEFAULT_BRACKET_SETUP);

export const createDefaultOverlayState = (): OverlayState => ({
  teamA: 'TEAM A',
  teamB: 'TEAM B',
  scoreA: 0,
  scoreB: 0,
  matchTitle: 'GRAND FINALS',
  roundName: 'BEST OF 5',
  matchStatus: 'LIVE',
  nextTeamA: 'TBD',
  nextTeamB: 'TBD',
  nextMatchTitle: 'NEXT MATCH',
  winnerName: 'TBD',
  winnerTeam: 'TBD',
  winnerScore: 0,
  bracketSetup: DEFAULT_BRACKET_SETUP,
  bracketMatches: createBracketMatchesFromState(DEFAULT_BRACKET),
  bracket: DEFAULT_BRACKET,
  showOverlay: true,
});

export const normalizeOverlayState = (incoming?: Partial<OverlayState> | null): OverlayState => {
  const bracketSetup = normalizeBracketSetup(incoming?.bracketSetup);
  const bracket = incoming?.bracket ? normalizeBracketState(incoming.bracket) : buildBracketStateFromSetup(bracketSetup);

  return {
    teamA: incoming?.teamA ?? 'TEAM A',
    teamB: incoming?.teamB ?? 'TEAM B',
    scoreA: Number.isFinite(incoming?.scoreA) ? incoming!.scoreA : 0,
    scoreB: Number.isFinite(incoming?.scoreB) ? incoming!.scoreB : 0,
    matchTitle: incoming?.matchTitle ?? 'GRAND FINALS',
    roundName: incoming?.roundName ?? 'BEST OF 5',
    matchStatus: incoming?.matchStatus ?? 'LIVE',
    nextTeamA: incoming?.nextTeamA ?? 'TBD',
    nextTeamB: incoming?.nextTeamB ?? 'TBD',
    nextMatchTitle: incoming?.nextMatchTitle ?? 'NEXT MATCH',
    winnerName: incoming?.winnerName ?? 'TBD',
    winnerTeam: incoming?.winnerTeam ?? 'TBD',
    winnerScore: Number.isFinite(incoming?.winnerScore) ? incoming!.winnerScore : 0,
    bracketSetup,
    bracket,
    bracketMatches: createBracketMatchesFromState(bracket),
    showOverlay: incoming?.showOverlay !== false,
  };
};
