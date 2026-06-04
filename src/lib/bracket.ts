import type {
  BracketMatchId,
  BracketMatchState,
  BracketSetup,
  BracketState,
  BracketWinnerSlot,
} from '../types';

export const BRACKET_MATCH_IDS: BracketMatchId[] = [
  'match1',
  'match2',
  'match3',
  'match4',
  'match5',
  'match6',
  'match7',
];

const cleanTeamName = (value: unknown, fallback: string): string => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const createMatch = (
  id: BracketMatchId,
  title: string,
  subtitle: string,
  teamA = 'TBD',
  teamB = 'TBD',
): BracketMatchState => ({
  id,
  title,
  subtitle,
  teamA,
  teamB,
  scoreA: 0,
  scoreB: 0,
  winnerSlot: null,
  winnerName: '',
});

export const createDefaultBracketSetup = (): BracketSetup => ({
  team1: 'TEAM 1',
  team2: 'TEAM 2',
  team3: 'TEAM 3',
  team4: 'TEAM 4',
});

export const normalizeBracketSetup = (incoming?: Partial<BracketSetup> | null): BracketSetup => {
  const defaults = createDefaultBracketSetup();

  return {
    team1: cleanTeamName(incoming?.team1, defaults.team1),
    team2: cleanTeamName(incoming?.team2, defaults.team2),
    team3: cleanTeamName(incoming?.team3, defaults.team3),
    team4: cleanTeamName(incoming?.team4, defaults.team4),
  };
};

export const createDefaultBracketState = (): BracketState => buildBracketStateFromSetup(createDefaultBracketSetup());

const createEmptyBracketState = (): BracketState => ({
  matches: {
    match1: createMatch('match1', 'Match 1', 'Opening Round'),
    match2: createMatch('match2', 'Match 2', 'Opening Round'),
    match3: createMatch('match3', 'Upper Final', 'Winners Final'),
    match4: createMatch('match4', 'Lower Round', 'Losers Round 1'),
    match5: createMatch('match5', 'Lower Final', 'Losers Final'),
    match6: createMatch('match6', 'Grand Final', 'Championship'),
    match7: createMatch('match7', 'Reset Final', 'If Needed'),
  },
});

const cloneBracket = (bracket: BracketState): BracketState => ({
  matches: BRACKET_MATCH_IDS.reduce((matches, matchId) => {
    matches[matchId] = { ...bracket.matches[matchId] };
    return matches;
  }, {} as Record<BracketMatchId, BracketMatchState>),
});

const resetOutcome = (match: BracketMatchState): BracketMatchState => ({
  ...match,
  scoreA: 0,
  scoreB: 0,
  winnerSlot: null,
  winnerName: '',
});

const setTeams = (match: BracketMatchState, teamA: string, teamB: string): BracketMatchState => {
  const nextMatch = {
    ...match,
    teamA,
    teamB,
  };

  if (match.teamA !== teamA || match.teamB !== teamB) {
    return resetOutcome(nextMatch);
  }

  return nextMatch;
};

const getOutcome = (match: BracketMatchState) => {
  if (match.winnerSlot === 'A') {
    return { winner: match.teamA, loser: match.teamB };
  }

  if (match.winnerSlot === 'B') {
    return { winner: match.teamB, loser: match.teamA };
  }

  return { winner: '', loser: '' };
};

const recomputeFixedBracket = (bracket: BracketState): BracketState => {
  const next = cloneBracket(bracket);

  const match1Outcome = getOutcome(next.matches.match1);
  const match2Outcome = getOutcome(next.matches.match2);

  next.matches.match3 = setTeams(
    next.matches.match3,
    match1Outcome.winner || 'TBD',
    match2Outcome.winner || 'TBD',
  );
  next.matches.match4 = setTeams(
    next.matches.match4,
    match1Outcome.loser || 'TBD',
    match2Outcome.loser || 'TBD',
  );

  const match3Outcome = getOutcome(next.matches.match3);
  const match4Outcome = getOutcome(next.matches.match4);

  next.matches.match5 = setTeams(
    next.matches.match5,
    match4Outcome.winner || 'TBD',
    match3Outcome.loser || 'TBD',
  );

  const match5Outcome = getOutcome(next.matches.match5);

  next.matches.match6 = setTeams(
    next.matches.match6,
    match3Outcome.winner || 'TBD',
    match5Outcome.winner || 'TBD',
  );

  if (next.matches.match6.winnerSlot === 'B') {
    next.matches.match7 = setTeams(next.matches.match7, next.matches.match6.teamA, next.matches.match6.teamB);
  } else {
    next.matches.match7 = setTeams(next.matches.match7, 'TBD', 'TBD');
  }

  return next;
};

export const buildBracketStateFromSetup = (setup: BracketSetup): BracketState => {
  const normalizedSetup = normalizeBracketSetup(setup);
  const bracket = createEmptyBracketState();

  bracket.matches.match1 = {
    ...bracket.matches.match1,
    teamA: normalizedSetup.team1,
    teamB: normalizedSetup.team2,
  };
  bracket.matches.match2 = {
    ...bracket.matches.match2,
    teamA: normalizedSetup.team3,
    teamB: normalizedSetup.team4,
  };

  return recomputeFixedBracket(bracket);
};

export const normalizeBracketState = (incoming?: Partial<BracketState> | null): BracketState => {
  const defaults = createEmptyBracketState();
  const normalized = cloneBracket(defaults);

  BRACKET_MATCH_IDS.forEach((matchId) => {
    const defaultMatch = defaults.matches[matchId];
    const incomingMatch = incoming?.matches?.[matchId];

    normalized.matches[matchId] = {
      ...defaultMatch,
      ...incomingMatch,
      id: matchId,
      title: defaultMatch.title,
      subtitle: defaultMatch.subtitle,
      teamA: cleanTeamName(incomingMatch?.teamA, defaultMatch.teamA),
      teamB: cleanTeamName(incomingMatch?.teamB, defaultMatch.teamB),
      scoreA: Number.isFinite(incomingMatch?.scoreA) ? Number(incomingMatch!.scoreA) : defaultMatch.scoreA,
      scoreB: Number.isFinite(incomingMatch?.scoreB) ? Number(incomingMatch!.scoreB) : defaultMatch.scoreB,
      winnerSlot: incomingMatch?.winnerSlot === 'A' || incomingMatch?.winnerSlot === 'B' ? incomingMatch.winnerSlot : null,
      winnerName: incomingMatch?.winnerName ?? '',
    };
  });

  return recomputeFixedBracket(normalized);
};

export const updateBracketScore = (
  bracket: BracketState,
  matchId: BracketMatchId,
  field: 'scoreA' | 'scoreB',
  value: number,
): BracketState => {
  const next = cloneBracket(bracket);
  next.matches[matchId] = {
    ...next.matches[matchId],
    [field]: Math.max(0, Number.isFinite(value) ? value : 0),
  };
  return next;
};

export const setBracketWinner = (
  bracket: BracketState,
  matchId: BracketMatchId,
  winnerSlot: Exclude<BracketWinnerSlot, null>,
): BracketState => {
  const next = cloneBracket(bracket);
  const selectedMatch = next.matches[matchId];
  next.matches[matchId] = {
    ...selectedMatch,
    winnerSlot,
    winnerName: winnerSlot === 'A' ? selectedMatch.teamA : selectedMatch.teamB,
  };

  return recomputeFixedBracket(next);
};

export const advanceBracketState = setBracketWinner;

export const updateBracketTeam = (
  bracket: BracketState,
  matchId: BracketMatchId,
  field: 'teamA' | 'teamB',
  value: string,
): BracketState => {
  const next = cloneBracket(bracket);
  next.matches[matchId] = {
    ...next.matches[matchId],
    [field]: cleanTeamName(value, 'TBD'),
  };
  return recomputeFixedBracket(next);
};

export const getBracketWinnerLabel = (match: BracketMatchState): string => match.winnerName || 'TBD';
