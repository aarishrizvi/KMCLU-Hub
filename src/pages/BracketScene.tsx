import React, { useEffect, useMemo, useState } from 'react';
import { socket } from '../lib/socket';
import type { BracketMatchState, OverlayState } from '../types';
import { normalizeOverlayState } from '../lib/state';

type LayoutBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const layout = {
  match1: { left: 2.5, top: 12, width: 17.5, height: 18 } as LayoutBox,
  match2: { left: 2.5, top: 58, width: 17.5, height: 18 } as LayoutBox,
  upperFinal: { left: 28.5, top: 18, width: 18.5, height: 18 } as LayoutBox,
  lowerRound: { left: 28.5, top: 60, width: 18.5, height: 18 } as LayoutBox,
  grandFinal: { left: 57.5, top: 38, width: 18.5, height: 18 } as LayoutBox,
  champion: { left: 82.5, top: 38, width: 11.5, height: 18 } as LayoutBox,
};

type TeamStatus = 'WON' | 'LOST' | 'PENDING' | 'TBD';

function getTeamStatus(match: BracketMatchState, slot: 'A' | 'B'): TeamStatus {
  const team = slot === 'A' ? match.teamA : match.teamB;

  if (!team || team === 'TBD') return 'TBD';
  if (!match.winnerSlot) return 'PENDING';
  return match.winnerSlot === slot ? 'WON' : 'LOST';
}

function statusClasses(status: TeamStatus): string {
  switch (status) {
    case 'WON':
      return 'border-orange-core/60 bg-orange-core text-black';
    case 'LOST':
      return 'border-white/10 bg-white/10 text-white/70';
    case 'PENDING':
      return 'border-white/10 bg-[#1B1B1B] text-white/55';
    case 'TBD':
    default:
      return 'border-white/10 bg-[#111] text-white/35';
  }
}

function StatusPill({ status }: { status: TeamStatus }) {
  return (
    <div
      className={`flex h-10 min-w-[5rem] items-center justify-center border px-3 text-[10px] font-black uppercase tracking-[0.3em] ${statusClasses(status)}`}
    >
      {status}
    </div>
  );
}

function MatchCard({
  label,
  match,
  champion = false,
}: {
  label: string;
  match?: BracketMatchState;
  champion?: boolean;
}) {
  return (
    <div className="relative h-full min-h-0">
      <div className="absolute left-0 top-0 z-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
        {label}
      </div>

      <div
        className={`absolute inset-0 overflow-hidden border ${
          champion ? 'border-orange-core/80 bg-[#111]' : 'border-white/10 bg-[#0F0F0F]'
        }`}
      >
        {champion ? (
          <div className="flex h-full items-center px-4">
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-core">Champion</div>
              <div className="mt-3 break-words text-[clamp(1.1rem,1.8vw,2rem)] font-black uppercase tracking-tight text-white">
                {match?.winnerName || 'TBD'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
              {label}
            </div>
            <div className="grid flex-1 min-h-0 grid-rows-2">
              <div className="flex min-h-0 items-center justify-between gap-3 border-b border-white/10 px-4">
                <div className="min-w-0 truncate text-[clamp(0.95rem,1.25vw,1.5rem)] font-black uppercase tracking-tight text-white">
                  {match?.teamA || 'TBD'}
                </div>
                <StatusPill status={match ? getTeamStatus(match, 'A') : 'TBD'} />
              </div>
              <div className="flex min-h-0 items-center justify-between gap-3 px-4">
                <div className="min-w-0 truncate text-[clamp(0.95rem,1.25vw,1.5rem)] font-black uppercase tracking-tight text-white">
                  {match?.teamB || 'TBD'}
                </div>
                <StatusPill status={match ? getTeamStatus(match, 'B') : 'TBD'} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectorLayer() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="#F97316"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
      >
        <path d="M 200 210 H 250 V 240 H 285" />
        <path d="M 200 670 H 250 V 300 H 285" />
        <path d="M 200 210 H 250 V 620 H 285" />
        <path d="M 200 670 H 250 V 660 H 285" />

        <path d="M 470 270 H 520 V 440 H 575" />
        <path d="M 470 680 H 520 V 500 H 575" />

        <path d="M 760 470 H 795 V 470 H 825" />
      </g>
    </svg>
  );
}

export default function BracketScene() {
  const [state, setState] = useState<OverlayState | null>(null);

  useEffect(() => {
    socket.on('stateUpdate', (newState: OverlayState) => {
      setState(normalizeOverlayState(newState));
    });

    return () => {
      socket.off('stateUpdate');
    };
  }, []);

  const matches = useMemo(() => {
    if (!state) return null;
    return state.bracket.matches;
  }, [state]);

  if (!state || !matches) return null;

  const match6 = matches.match6;
  const match7 = matches.match7;
  const championName =
    match6.winnerSlot === 'A'
      ? match6.winnerName || 'TBD'
      : match7.winnerName || 'TBD';

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#070707] text-white">
      <ConnectorLayer />

      <div className="absolute inset-0">
        <div className="absolute" style={{ left: `${layout.match1.left}%`, top: `${layout.match1.top}%`, width: `${layout.match1.width}%`, height: `${layout.match1.height}%` }}>
          <MatchCard label="Match 1" match={matches.match1} />
        </div>

        <div className="absolute" style={{ left: `${layout.match2.left}%`, top: `${layout.match2.top}%`, width: `${layout.match2.width}%`, height: `${layout.match2.height}%` }}>
          <MatchCard label="Match 2" match={matches.match2} />
        </div>

        <div className="absolute" style={{ left: `${layout.upperFinal.left}%`, top: `${layout.upperFinal.top}%`, width: `${layout.upperFinal.width}%`, height: `${layout.upperFinal.height}%` }}>
          <MatchCard label="Upper Final" match={matches.match3} />
        </div>

        <div className="absolute" style={{ left: `${layout.lowerRound.left}%`, top: `${layout.lowerRound.top}%`, width: `${layout.lowerRound.width}%`, height: `${layout.lowerRound.height}%` }}>
          <MatchCard label="Lower Round" match={matches.match4} />
        </div>

        <div className="absolute" style={{ left: `${layout.grandFinal.left}%`, top: `${layout.grandFinal.top}%`, width: `${layout.grandFinal.width}%`, height: `${layout.grandFinal.height}%` }}>
          <MatchCard label="Grand Final" match={matches.match6} />
        </div>

        <div className="absolute" style={{ left: `${layout.champion.left}%`, top: `${layout.champion.top}%`, width: `${layout.champion.width}%`, height: `${layout.champion.height}%` }}>
          <MatchCard
            label="Champion"
            champion
            match={{
              ...matches.match6,
              winnerName: championName,
            }}
          />
        </div>
      </div>
    </div>
  );
}
