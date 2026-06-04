import type { BracketMatch, BracketMatchId, BracketState } from '../types';
import { BRACKET_MATCH_IDS, createDefaultBracketState } from './bracket';

export const createBracketMatchesFromState = (bracket: BracketState): BracketMatch[] =>
  BRACKET_MATCH_IDS.map((matchId) => {
    const match = bracket.matches[matchId];

    return {
      id: match.id,
      teamA: match.teamA,
      teamB: match.teamB,
      scoreA: match.scoreA,
      scoreB: match.scoreB,
      winner: match.winnerName || '',
    };
  });

export const createDefaultBracketMatches = (): BracketMatch[] => createBracketMatchesFromState(createDefaultBracketState());

export const getBracketMatch = (matches: BracketMatch[], matchId: BracketMatchId): BracketMatch =>
  matches.find((match) => match.id === matchId) ?? createDefaultBracketMatches().find((match) => match.id === matchId)!;

export const normalizeBracketMatches = (incoming?: Partial<BracketMatch>[] | null, bracket?: BracketState): BracketMatch[] => {
  if (bracket) {
    return createBracketMatchesFromState(bracket);
  }

  const defaults = createDefaultBracketMatches();
  return BRACKET_MATCH_IDS.map((matchId) => {
    const defaultMatch = defaults.find((match) => match.id === matchId)!;
    const incomingMatch = incoming?.find((match) => match?.id === matchId);

    return {
      id: matchId,
      teamA: incomingMatch?.teamA ?? defaultMatch.teamA,
      teamB: incomingMatch?.teamB ?? defaultMatch.teamB,
      scoreA: Number.isFinite(incomingMatch?.scoreA) ? Number(incomingMatch!.scoreA) : defaultMatch.scoreA,
      scoreB: Number.isFinite(incomingMatch?.scoreB) ? Number(incomingMatch!.scoreB) : defaultMatch.scoreB,
      winner: incomingMatch?.winner ?? defaultMatch.winner,
    };
  });
};

export const updateBracketMatch = (
  matches: BracketMatch[],
  matchId: BracketMatchId,
  field: keyof BracketMatch,
  value: string | number,
): BracketMatch[] =>
  matches.map((match) => {
    if (match.id !== matchId) return match;

    if (field === 'scoreA' || field === 'scoreB') {
      return {
        ...match,
        [field]: Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 0),
      } as BracketMatch;
    }

    return {
      ...match,
      [field]: value,
    } as BracketMatch;
  });
