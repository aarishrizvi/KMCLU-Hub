import { motion } from 'motion/react';
import { RefreshCw, Save, Trophy } from 'lucide-react';
import type { BracketMatchId, BracketSetup, BracketState, BracketWinnerSlot } from '../types';

interface BracketControlSectionProps {
  setup: BracketSetup;
  bracket: BracketState;
  onSetupChange: (field: keyof BracketSetup, value: string) => void;
  onSetupSave: () => void;
  onScoreChange: (matchId: BracketMatchId, field: 'scoreA' | 'scoreB', value: number) => void;
  onWinnerSelect: (matchId: BracketMatchId, winnerSlot: Exclude<BracketWinnerSlot, null>) => void;
  onResetBracket: () => void;
}

function SetupField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[10px] uppercase tracking-[0.35em] text-white/45">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-[#2D2F31] bg-[#0B0B0B] p-3 text-sm font-black uppercase tracking-tight outline-none transition-colors focus:border-orange-core"
      />
    </label>
  );
}

function MatchCard({
  title,
  subtitle,
  teamA,
  teamB,
  scoreA,
  scoreB,
  winnerSlot,
  winnerName,
  onScoreChange,
  onWinnerSelect,
}: {
  title: string;
  subtitle: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winnerSlot: BracketWinnerSlot;
  winnerName: string;
  onScoreChange: (field: 'scoreA' | 'scoreB', value: number) => void;
  onWinnerSelect: (winnerSlot: Exclude<BracketWinnerSlot, null>) => void;
}) {
  const teamAActive = winnerSlot === 'A';
  const teamBActive = winnerSlot === 'B';
  const canEdit = teamA !== 'TBD' && teamB !== 'TBD';

  return (
    <div className="border border-[#2D2F31] bg-[#0B0B0B] p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.25em] text-orange-core font-black">{title}</div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Winner</div>
          <div className="text-sm font-black uppercase tracking-tight text-white/90">
            {winnerName || 'TBD'}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`rounded border p-3 transition-colors ${teamAActive ? 'border-orange-core/70 bg-orange-core/10' : 'border-[#2D2F31] bg-[#111316]'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/45">Team A</div>
              <div className="truncate text-lg font-black uppercase tracking-tight text-white">{teamA}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => onScoreChange('scoreA', Math.max(0, scoreA - 1))}
                className={`h-8 w-8 border bg-black/30 text-white/80 transition-colors ${
                  canEdit ? 'border-[#2D2F31] hover:border-orange-core/70 hover:text-orange-core' : 'cursor-not-allowed border-[#1E1F22] opacity-40'
                }`}
              >
                -
              </button>
              <div className="min-w-[3rem] text-center font-mono text-3xl font-black text-orange-core">
                {scoreA.toString().padStart(2, '0')}
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => onScoreChange('scoreA', scoreA + 1)}
                className={`h-8 w-8 border bg-orange-core text-black transition-colors ${
                  canEdit ? 'border-[#2D2F31] hover:bg-[#FB923C]' : 'cursor-not-allowed border-[#1E1F22] opacity-40'
                }`}
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => onWinnerSelect('A')}
            className={`mt-3 w-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.35em] transition-colors ${
              !canEdit
                ? 'cursor-not-allowed border-[#1E1F22] text-white/25'
                : teamAActive
                ? 'border-orange-core bg-orange-core text-black'
                : 'border-[#2D2F31] text-white/70 hover:border-orange-core/60 hover:text-white'
            }`}
          >
            Select Team A Winner
          </button>
        </div>

        <div className={`rounded border p-3 transition-colors ${teamBActive ? 'border-orange-core/70 bg-orange-core/10' : 'border-[#2D2F31] bg-[#111316]'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/45">Team B</div>
              <div className="truncate text-lg font-black uppercase tracking-tight text-white">{teamB}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => onScoreChange('scoreB', Math.max(0, scoreB - 1))}
                className={`h-8 w-8 border bg-black/30 text-white/80 transition-colors ${
                  canEdit ? 'border-[#2D2F31] hover:border-orange-core/70 hover:text-orange-core' : 'cursor-not-allowed border-[#1E1F22] opacity-40'
                }`}
              >
                -
              </button>
              <div className="min-w-[3rem] text-center font-mono text-3xl font-black text-white">
                {scoreB.toString().padStart(2, '0')}
              </div>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => onScoreChange('scoreB', scoreB + 1)}
                className={`h-8 w-8 border bg-orange-core text-black transition-colors ${
                  canEdit ? 'border-[#2D2F31] hover:bg-[#FB923C]' : 'cursor-not-allowed border-[#1E1F22] opacity-40'
                }`}
              >
                +
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => onWinnerSelect('B')}
            className={`mt-3 w-full border px-3 py-2 text-[10px] font-black uppercase tracking-[0.35em] transition-colors ${
              !canEdit
                ? 'cursor-not-allowed border-[#1E1F22] text-white/25'
                : teamBActive
                ? 'border-orange-core bg-orange-core text-black'
                : 'border-[#2D2F31] text-white/70 hover:border-orange-core/60 hover:text-white'
            }`}
          >
            Select Team B Winner
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BracketControlSection({
  setup,
  bracket,
  onSetupChange,
  onSetupSave,
  onScoreChange,
  onWinnerSelect,
  onResetBracket,
}: BracketControlSectionProps) {
  const matches = bracket.matches;

  return (
    <section className="bg-[#1A1C1E] p-6 border border-[#2D2F31] shadow-xl">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#2D2F31]">
        <Trophy className="w-4 h-4 text-orange-core" />
        <div>
          <h2 className="text-[11px] text-orange-core font-bold uppercase tracking-widest">Fixed 4-Team Bracket</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Enter the four teams once, then control only scores and winners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 space-y-4">
          <div className="border border-[#2D2F31] bg-[#0B0B0B] p-4">
            <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-orange-core font-black">
              Tournament Setup
            </div>
            <div className="space-y-4">
              <SetupField label="Team 1" value={setup.team1} onChange={(value) => onSetupChange('team1', value)} />
              <SetupField label="Team 2" value={setup.team2} onChange={(value) => onSetupChange('team2', value)} />
              <SetupField label="Team 3" value={setup.team3} onChange={(value) => onSetupChange('team3', value)} />
              <SetupField label="Team 4" value={setup.team4} onChange={(value) => onSetupChange('team4', value)} />
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={onSetupSave}
                className="w-full flex items-center justify-center gap-2 bg-orange-core px-4 py-3 text-black font-black uppercase tracking-tighter hover:bg-[#FB923C] transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Teams & Generate Bracket
              </button>
              <button
                type="button"
                onClick={onResetBracket}
                className="w-full flex items-center justify-center gap-2 border border-[#2D2F31] bg-[#111316] px-4 py-3 text-white/70 font-black uppercase tracking-tighter hover:border-orange-core/60 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Match Results
              </button>
            </div>
          </div>

          <div className="border border-[#2D2F31] bg-[#0B0B0B] p-4 text-sm text-white/65">
            <div className="text-[11px] uppercase tracking-[0.25em] text-orange-core font-black mb-3">
              Auto-Advance Rules
            </div>
            <ul className="space-y-2 text-[12px] leading-5">
              <li>Winner Match 1 → Upper Final Team A</li>
              <li>Winner Match 2 → Upper Final Team B</li>
              <li>Loser Match 1 → Lower Round Team A</li>
              <li>Loser Match 2 → Lower Round Team B</li>
              <li>Winner Upper Final → Grand Final Team A</li>
              <li>Loser Upper Final → Lower Final Team B</li>
              <li>Winner Lower Round → Lower Final Team A</li>
              <li>Winner Lower Final → Grand Final Team B</li>
            </ul>
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-orange-core font-black">Upper Bracket</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match1.title}
                  subtitle={matches.match1.subtitle}
                  teamA={matches.match1.teamA}
                  teamB={matches.match1.teamB}
                  scoreA={matches.match1.scoreA}
                  scoreB={matches.match1.scoreB}
                  winnerSlot={matches.match1.winnerSlot}
                  winnerName={matches.match1.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match1', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match1', winnerSlot)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match2.title}
                  subtitle={matches.match2.subtitle}
                  teamA={matches.match2.teamA}
                  teamB={matches.match2.teamB}
                  scoreA={matches.match2.scoreA}
                  scoreB={matches.match2.scoreB}
                  winnerSlot={matches.match2.winnerSlot}
                  winnerName={matches.match2.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match2', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match2', winnerSlot)}
                />
              </motion.div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-orange-core font-black">Lower Bracket</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match4.title}
                  subtitle={matches.match4.subtitle}
                  teamA={matches.match4.teamA}
                  teamB={matches.match4.teamB}
                  scoreA={matches.match4.scoreA}
                  scoreB={matches.match4.scoreB}
                  winnerSlot={matches.match4.winnerSlot}
                  winnerName={matches.match4.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match4', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match4', winnerSlot)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match5.title}
                  subtitle={matches.match5.subtitle}
                  teamA={matches.match5.teamA}
                  teamB={matches.match5.teamB}
                  scoreA={matches.match5.scoreA}
                  scoreB={matches.match5.scoreB}
                  winnerSlot={matches.match5.winnerSlot}
                  winnerName={matches.match5.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match5', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match5', winnerSlot)}
                />
              </motion.div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-orange-core font-black">Championship</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match3.title}
                  subtitle={matches.match3.subtitle}
                  teamA={matches.match3.teamA}
                  teamB={matches.match3.teamB}
                  scoreA={matches.match3.scoreA}
                  scoreB={matches.match3.scoreB}
                  winnerSlot={matches.match3.winnerSlot}
                  winnerName={matches.match3.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match3', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match3', winnerSlot)}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <MatchCard
                  title={matches.match6.title}
                  subtitle={matches.match6.subtitle}
                  teamA={matches.match6.teamA}
                  teamB={matches.match6.teamB}
                  scoreA={matches.match6.scoreA}
                  scoreB={matches.match6.scoreB}
                  winnerSlot={matches.match6.winnerSlot}
                  winnerName={matches.match6.winnerName}
                  onScoreChange={(field, value) => onScoreChange('match6', field, value)}
                  onWinnerSelect={(winnerSlot) => onWinnerSelect('match6', winnerSlot)}
                />
              </motion.div>
            </div>
          </div>

          <div>
            <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-orange-core font-black">Reset Final</div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <MatchCard
                title={matches.match7.title}
                subtitle={matches.match7.subtitle}
                teamA={matches.match7.teamA}
                teamB={matches.match7.teamB}
                scoreA={matches.match7.scoreA}
                scoreB={matches.match7.scoreB}
                winnerSlot={matches.match7.winnerSlot}
                winnerName={matches.match7.winnerName}
                onScoreChange={(field, value) => onScoreChange('match7', field, value)}
                onWinnerSelect={(winnerSlot) => onWinnerSelect('match7', winnerSlot)}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
