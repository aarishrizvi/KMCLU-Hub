import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import type { OverlayState } from '../types';
import { normalizeOverlayState } from '../lib/state';
import { getBracketMatch } from '../lib/bracketMatches';

type MatchCardProps = {
  id: string;
  label: string;
  subtitle?: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  winner: string;
  left: number;
  top: number;
  width: number;
  height: number;
  accent?: boolean;
};

function MatchCard({
  id,
  label,
  subtitle,
  teamA,
  teamB,
  scoreA,
  scoreB,
  winner,
  left,
  top,
  width,
  height,
  accent = false,
}: MatchCardProps) {
  return (
    <div
      className={`absolute overflow-hidden border shadow-[0_0_24px_rgba(0,0,0,0.38)] ${
        accent ? 'border-orange-core/60 bg-[#474747]/92' : 'border-white/10 bg-[#444]/88'
      }`}
      style={{ left, top, width, height }}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/50 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-[1px] bg-[#6B6B6B]/80" />
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-black/20 px-5 pt-4 pb-3">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90">{label}</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/50">{subtitle ?? ''}</div>
        </div>
        <div className="flex flex-1 flex-col justify-between px-5 py-4 text-white">
          <div className="flex items-center justify-between gap-4 border-b border-black/20 pb-3">
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.35em] text-white/45">Team A</div>
              <div className="truncate text-[22px] leading-tight font-black uppercase tracking-tight">
                {teamA}
              </div>
            </div>
            <div className="font-mono text-[22px] font-black tracking-tight text-white/90">
              {scoreA.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 pt-3">
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-[0.35em] text-white/45">Team B</div>
              <div className="truncate text-[22px] leading-tight font-black uppercase tracking-tight">
                {teamB}
              </div>
            </div>
            <div className="font-mono text-[22px] font-black tracking-tight text-white/90">
              {scoreB.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        <div className="border-t border-black/20 px-5 py-2 text-[10px] uppercase tracking-[0.3em] text-orange-core">
          Winner: <span className="text-white/90">{winner || 'TBD'}</span>
        </div>
      </div>
    </div>
  );
}

function FooterItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-4 border-l border-white/10 px-10 first:border-l-0 first:pl-0">
      <div className="flex h-10 w-10 items-center justify-center text-orange-core">
        <div className="h-6 w-6 border border-orange-core/80" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.35em] text-white/45">{label}</div>
        <div className="truncate text-[18px] font-black uppercase tracking-tight text-orange-core">{value}</div>
      </div>
    </div>
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

  if (!state) return null;

  const matches = state.bracketMatches;
  const match1 = getBracketMatch(matches, 'match1');
  const match2 = getBracketMatch(matches, 'match2');
  const match3 = getBracketMatch(matches, 'match3');
  const match4 = getBracketMatch(matches, 'match4');
  const match5 = getBracketMatch(matches, 'match5');
  const match6 = getBracketMatch(matches, 'match6');
  const match7 = getBracketMatch(matches, 'match7');

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#1f1f1f] text-white font-display">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_34%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_24%),linear-gradient(180deg,#313131_0%,#191919_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[84px] bg-[#2f2f2f] shadow-[0_2px_0_rgba(0,0,0,0.4)]" />
      <div className="absolute inset-x-0 top-[84px] h-[6px] bg-[#191919] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]" />
      <div className="absolute left-0 top-[86px] h-[8px] w-[610px] bg-orange-core" />
      <div className="absolute left-[610px] top-[86px] h-[8px] w-[75px] bg-[#2f2f2f]" />
      <div className="absolute left-[41px] top-[19px] h-[36px] w-[61px] border-l-[18px] border-t-[10px] border-b-[10px] border-orange-core border-r-transparent transform skew-x-[-18deg]" />

      <div className="absolute left-[53px] top-[128px] w-[760px]">
        <div className="text-[54px] font-black italic uppercase tracking-[-0.04em] text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">
          KMCLU HUB ARENA SERIES S1
        </div>
        <div className="mt-2 text-[26px] font-medium uppercase tracking-[0.12em] text-orange-core">
          DOUBLE ELIMINATION FORMAT
        </div>
        <div className="mt-1 text-[22px] font-medium uppercase tracking-[0.1em] text-white/55">
          4 TEAMS
        </div>
      </div>

      <div className="absolute left-[0px] top-[290px] h-[2px] w-[54px] bg-orange-core" />
      <div className="absolute left-[69px] top-[277px] text-[20px] font-medium uppercase tracking-[0.12em] text-orange-core">
        UPPER BRACKET
      </div>

      <div className="absolute left-[0px] top-[575px] h-[2px] w-[54px] bg-orange-core" />
      <div className="absolute left-[69px] top-[562px] text-[20px] font-medium uppercase tracking-[0.12em] text-orange-core">
        LOWER BRACKET
      </div>

      <div className="absolute left-[237px] top-[292px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 1
      </div>
      <div className="absolute left-[237px] top-[605px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 2
      </div>
      <div className="absolute left-[806px] top-[340px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 3
      </div>
      <div className="absolute left-[806px] top-[605px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 5
      </div>
      <div className="absolute left-[1124px] top-[474px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 6
      </div>
      <div className="absolute left-[1128px] top-[522px] text-[18px] uppercase tracking-[0.18em] text-orange-core">
        CHAMPION
      </div>
      <div className="absolute left-[1150px] top-[711px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        GRAND FINAL (BO5)
      </div>
      <div className="absolute left-[802px] top-[760px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        LOWER FINAL
      </div>
      <div className="absolute left-[82px] top-[324px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 1
      </div>
      <div className="absolute left-[82px] top-[639px] text-[18px] uppercase tracking-[0.18em] text-white/50">
        MATCH 4
      </div>

      <svg
        className="pointer-events-none absolute inset-0"
        width="1778"
        height="999"
        viewBox="0 0 1778 999"
        fill="none"
        aria-hidden="true"
        style={{ left: 0, top: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0.976 0 1 0 0 0.451 0 0 1 0 0.086 0 0 0 1 0"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M618 342 H656 V407 H705" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M618 480 H656 V407 H705" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M705 408 H746" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M705 655 H746" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M1044 408 H1184 V509 H1241" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M1044 655 H1184 V540 H1241" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M1241 509 H1263" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M1241 540 H1263" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
        <path d="M1460 509 H1495" stroke="#F97316" strokeWidth="2.5" filter="url(#orangeGlow)" />
      </svg>

      <MatchCard
        id="match1"
        label="MATCH 1"
        subtitle="OPENING ROUND"
        teamA={match1.teamA}
        teamB={match1.teamB}
        scoreA={match1.scoreA}
        scoreB={match1.scoreB}
        winner={match1.winner}
        left={264}
        top={294}
        width={336}
        height={96}
        accent
      />

      <MatchCard
        id="match2"
        label="MATCH 2"
        subtitle="OPENING ROUND"
        teamA={match2.teamA}
        teamB={match2.teamB}
        scoreA={match2.scoreA}
        scoreB={match2.scoreB}
        winner={match2.winner}
        left={264}
        top={432}
        width={336}
        height={96}
        accent
      />

      <MatchCard
        id="match3"
        label="UPPER FINAL"
        subtitle="WINNERS BRACKET"
        teamA={match3.teamA}
        teamB={match3.teamB}
        scoreA={match3.scoreA}
        scoreB={match3.scoreB}
        winner={match3.winner}
        left={712}
        top={358}
        width={300}
        height={96}
      />

      <MatchCard
        id="match4"
        label="LOWER ROUND"
        subtitle="LOSERS BRACKET"
        teamA={match4.teamA}
        teamB={match4.teamB}
        scoreA={match4.scoreA}
        scoreB={match4.scoreB}
        winner={match4.winner}
        left={264}
        top={607}
        width={336}
        height={96}
      />

      <MatchCard
        id="match5"
        label="LOWER FINAL"
        subtitle="LOSERS BRACKET"
        teamA={match5.teamA}
        teamB={match5.teamB}
        scoreA={match5.scoreA}
        scoreB={match5.scoreB}
        winner={match5.winner}
        left={712}
        top={607}
        width={300}
        height={96}
        accent
      />

      <MatchCard
        id="match6"
        label="GRAND FINAL"
        subtitle="CHAMPIONSHIP"
        teamA={match6.teamA}
        teamB={match6.teamB}
        scoreA={match6.scoreA}
        scoreB={match6.scoreB}
        winner={match6.winner}
        left={1271}
        top={483}
        width={299}
        height={103}
        accent
      />

      <MatchCard
        id="match7"
        label="RESET FINAL"
        subtitle="IF NEEDED"
        teamA={match7.teamA}
        teamB={match7.teamB}
        scoreA={match7.scoreA}
        scoreB={match7.scoreB}
        winner={match7.winner}
        left={1271}
        top={634}
        width={299}
        height={103}
      />

      <div className="absolute inset-x-0 bottom-0 h-[112px] border-t border-white/12 bg-[#2b2b2b]/96 shadow-[0_-2px_0_rgba(0,0,0,0.35)]">
        <div className="absolute left-0 top-0 h-full w-[12px] bg-orange-core" />
        <div className="absolute right-0 top-0 h-full w-[12px] bg-orange-core [clip-path:polygon(0_0,100%_0,100%_100%,35%_100%)]" />
        <div className="flex h-full items-center px-[78px]">
          <div className="flex w-full items-center justify-between gap-8">
            <FooterItem label="GAME" value="BGMI" />
            <FooterItem label="MODE" value="4V4 TDM" />
            <FooterItem label="MAP" value="WAREHOUSE" />
            <FooterItem label="DATE" value="7 JUNE 2026" />
            <FooterItem label="TIME" value="7:00 PM IST" />
            <FooterItem label="MATCH FORMAT" value="BO3 (EXCEPT GRAND FINAL)" />
          </div>
        </div>
      </div>
    </div>
  );
}
