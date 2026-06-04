export type BracketMatchId = 'match1' | 'match2' | 'match3' | 'match4' | 'match5' | 'match6' | 'match7';
export type BracketWinnerSlot = 'A' | 'B' | null;

export interface BracketSetup {
  team1: string;
  team2: string;
  team3: string;
  team4: string;
}

export interface BracketMatch {
  id: BracketMatchId;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
}

export interface BracketMatchState {
  id: BracketMatchId;
  title: string;
  subtitle: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winnerSlot: BracketWinnerSlot;
  winnerName: string;
}

export interface BracketState {
  matches: Record<BracketMatchId, BracketMatchState>;
}

export interface OverlayState {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  matchTitle: string;
  roundName: string;
  matchStatus: string;
  nextTeamA: string;
  nextTeamB: string;
  nextMatchTitle: string;
  winnerName: string;
  winnerTeam: string;
  winnerScore: number;
  bracketSetup: BracketSetup;
  bracketMatches: BracketMatch[];
  bracket: BracketState;
  showOverlay: boolean;
}
