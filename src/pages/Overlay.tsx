import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { OverlayState } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { normalizeOverlayState } from '../lib/state';

export default function Overlay() {
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

  const showOverlay = state.showOverlay !== false;
  const scoreA = Number.isFinite(state.scoreA) ? state.scoreA : 0;
  const scoreB = Number.isFinite(state.scoreB) ? state.scoreB : 0;
  const winnerScore = Number.isFinite(state.winnerScore) ? state.winnerScore : 0;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-transparent font-display">
      <AnimatePresence>
        {showOverlay && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative h-full w-full text-white"
          >
            <div className="absolute inset-0 bg-[#050607]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_22%),linear-gradient(180deg,#0A0B0D_0%,#050607_100%)]" />
            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="relative z-10 h-full w-full overflow-hidden p-6 md:p-8 xl:p-10">
              <div className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)] gap-4 xl:gap-6">
                <div className="grid min-h-0 grid-cols-1 gap-4 md:grid-cols-[0.85fr_1.3fr_0.85fr] xl:gap-6">
                  <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_30px_rgba(0,0,0,0.45)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/70 to-transparent" />
                    <div className="relative flex h-full items-center gap-4 px-4 py-3 lg:px-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/10 bg-black/30">
                        <div className="h-7 w-7 rotate-45 border-2 border-orange-core" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/45">Tournament Logo</div>
                        <div className="truncate text-xl font-black italic uppercase tracking-tighter text-white">KMCLU Esports</div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={state.roundName}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="mt-2 truncate text-sm font-black uppercase tracking-[0.3em] text-orange-core"
                          >
                            {state.roundName}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: 0.03 }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_30px_rgba(0,0,0,0.45)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/70 to-transparent" />
                    <div className="flex h-full items-center justify-center px-5 py-3 text-center">
                      <AnimatePresence mode="wait">
                        <motion.h2
                          key={state.matchTitle}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="truncate text-3xl md:text-4xl xl:text-5xl font-black italic tracking-tighter uppercase"
                        >
                          {state.matchTitle}
                        </motion.h2>
                      </AnimatePresence>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut', delay: 0.06 }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_30px_rgba(0,0,0,0.45)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/70 to-transparent" />
                    <div className="flex h-full items-center justify-end px-4 py-3 lg:px-5">
                      <div className="flex items-center gap-2 border border-white/10 bg-black/30 px-3 py-2 text-[11px] font-black uppercase tracking-[0.35em] text-white/80">
                        <span className="h-2 w-2 rounded-full bg-orange-core shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
                        {state.matchStatus}
                      </div>
                    </div>
                  </motion.section>
                </div>

                <div className="grid min-h-0 grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr_1fr] xl:gap-6">
                  <motion.section
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/80 to-transparent" />
                    <div className="absolute left-0 top-0 h-full w-1 bg-orange-core" />
                    <div className="flex h-full flex-col p-4 md:p-5 xl:p-6">
                      <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                        <div className="min-w-0">
                          <div className="text-[10px] font-black uppercase tracking-[0.35em] text-orange-core">Current Match</div>
                          <div className="mt-1 truncate text-lg font-black uppercase tracking-[0.3em] text-white/70">
                            Main Event
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 border border-white/10 bg-black/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                          <span className="h-2 w-2 bg-orange-core" />
                          Live
                        </div>
                      </div>

                      <div className="mt-4 grid min-h-0 flex-1 grid-rows-[auto_auto_1fr] gap-3">
                        <div className="flex min-w-0 items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Team A</div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={state.teamA}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="truncate text-2xl md:text-3xl xl:text-4xl font-black italic uppercase tracking-tighter"
                              >
                                {state.teamA}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={scoreA}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="font-mono text-6xl font-black leading-none text-orange-core md:text-7xl xl:text-8xl"
                            >
                              {scoreA.toString().padStart(2, '0')}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-center border-y border-orange-core/30 bg-orange-core px-4 py-2 text-sm font-black uppercase tracking-[0.45em] text-black">
                          VS
                        </div>

                        <div className="flex min-w-0 items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Team B</div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={state.teamB}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="truncate text-2xl md:text-3xl xl:text-4xl font-black italic uppercase tracking-tighter"
                              >
                                {state.teamB}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={scoreB}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="font-mono text-6xl font-black leading-none text-white md:text-7xl xl:text-8xl"
                            >
                              {scoreB.toString().padStart(2, '0')}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                          <div className="overflow-hidden border border-white/10 bg-black/25 px-4 py-3">
                            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Round Name</div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={state.roundName}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="truncate text-lg md:text-xl xl:text-2xl font-black uppercase tracking-tighter"
                              >
                                {state.roundName}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <div className="overflow-hidden border border-orange-core/40 bg-[#1A1C1E] px-4 py-3">
                            <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Status</div>
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={state.matchStatus}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="truncate text-lg md:text-xl xl:text-2xl font-black uppercase tracking-[0.25em] text-orange-core"
                              >
                                {state.matchStatus}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/80 to-transparent" />
                    <div className="flex h-full flex-col p-4 md:p-5 xl:p-6">
                      <div className="border-b border-white/10 pb-3 text-[10px] font-black uppercase tracking-[0.35em] text-orange-core">
                        Up Next
                      </div>
                      <div className="mt-4 flex min-h-0 flex-1 flex-col justify-between gap-4">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${state.nextTeamA}-${state.nextTeamB}`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="min-w-0 text-xl md:text-2xl font-black italic uppercase tracking-tighter"
                          >
                            {state.nextTeamA} vs {state.nextTeamB}
                          </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={state.nextMatchTitle}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden border-l-4 border-orange-core bg-black/30 px-4 py-3 text-base md:text-lg xl:text-xl font-black uppercase tracking-[0.2em] text-white/90"
                          >
                            {state.nextMatchTitle}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: 0.08 }}
                    className="relative overflow-hidden border border-[#2D2F31] bg-[#111316]/95 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-core via-white/80 to-transparent" />
                    <div className="flex h-full flex-col p-4 md:p-5 xl:p-6">
                      <div className="border-b border-white/10 pb-3 text-[10px] font-black uppercase tracking-[0.35em] text-orange-core">
                        WINNER
                      </div>
                      <div className="mt-4 flex min-h-0 flex-1 flex-col justify-between gap-4">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={state.winnerName}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="truncate text-xl md:text-2xl xl:text-3xl font-black italic uppercase tracking-tighter"
                          >
                            {state.winnerName}
                          </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={state.winnerTeam}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden border border-white/10 bg-black/30 px-4 py-3 text-base md:text-lg xl:text-xl font-black uppercase tracking-[0.2em] text-white/85"
                          >
                            {state.winnerTeam}
                          </motion.div>
                        </AnimatePresence>
                        <div className="border-t border-white/10 pt-4">
                          <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">Match Result</div>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={winnerScore}
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="mt-1 font-mono text-4xl md:text-5xl xl:text-6xl font-black leading-none text-orange-core"
                            >
                              {winnerScore.toString().padStart(2, '0')}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.section>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
