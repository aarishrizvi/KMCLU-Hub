import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { OverlayState } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Overlay() {
  const [state, setState] = useState<OverlayState | null>(null);

  useEffect(() => {
    socket.on('stateUpdate', (newState: OverlayState) => {
      setState(newState);
    });

    return () => {
      socket.off('stateUpdate');
    };
  }, []);

  if (!state) return null;

  return (
    <div className="w-screen h-screen overflow-hidden p-4 sm:p-6 md:p-8 xl:p-12 flex flex-col justify-between font-display relative bg-transparent">
      
      <AnimatePresence>
        {state.showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex flex-col justify-between"
          >
            
            {/* TOP ROW */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start">
              {/* Top Left: Tournament Logo / Info */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-[#1A1C1E] p-4 md:p-6 border-l-4 border-orange-core shadow-2xl flex items-center gap-4 md:gap-6 min-w-0 max-w-[32vw] overflow-hidden"
              >
                <div className="w-10 h-10 bg-white/10 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-orange-core rotate-45 transform"></div>
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-orange-core font-black tracking-widest leading-none mb-1 truncate">OFFICIAL PARTNER</div>
                  <div className="text-lg font-black tracking-tighter leading-none italic uppercase truncate max-w-full px-2 overflow-visible">KMCLU ESPORTS</div>
                </div>
              </motion.div>

              {/* Top Center: Match Title */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={state.matchTitle}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-[#1A1C1E] px-6 md:px-10 lg:px-12 py-3 md:py-4 border-b-2 border-orange-core shadow-2xl min-w-0 w-full md:w-[min(42vw,720px)] max-w-[42vw] overflow-hidden mx-auto"
                >
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-[4px] text-center mb-1">Tournament Series</div>
                  <h2 className="text-base md:text-lg lg:text-xl font-black italic tracking-tighter text-white uppercase flex items-center justify-center gap-0 truncate max-w-full px-2 overflow-visible">
                    {state.matchTitle}
                  </h2>
                </motion.div>
              </AnimatePresence>
              
              {/* Top Right Spacer / Info */}
              <div className="bg-[#1A1C1E] p-4 md:p-6 flex flex-col items-end opacity-100 justify-self-end min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-core rounded-full animate-pulse"></div>
                  <span className="text-[11px] font-black tracking-widest text-white uppercase truncate max-w-[18ch]">LIVE BROADCAST</span>
                </div>
              </div>
            </div>

            {/* CENTER: SCOREBOARD */}
            <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex justify-center px-4 md:px-6">
              <div className="flex items-stretch shadow-2xl w-[min(92vw,1120px)] max-w-full overflow-hidden">
                {/* Team A */}
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-[#1A1C1E] px-6 md:px-8 py-4 md:py-6 flex-1 min-w-0 flex items-center justify-between gap-4 md:gap-6 border-l-4 border-orange-core overflow-hidden"
                >
                  <div className="text-right min-w-0 flex-1">
                    <div className="text-[10px] text-white/40 font-bold tracking-wider">HOME</div>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={state.teamA}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                          className="text-lg md:text-xl lg:text-3xl font-black italic tracking-tighter text-white uppercase truncate max-w-full px-2 overflow-visible"
                      >
                        {state.teamA}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={state.scoreA}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-black text-orange-core font-mono leading-none"
                    >
                      {state.scoreA.toString().padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Score VS Center */}
                <div className="bg-orange-core text-black h-auto px-4 md:px-6 flex items-center justify-center font-black italic -skew-x-12 z-10">
                  <span className="skew-x-12 tracking-tighter">VS</span>
                </div>

                {/* Team B */}
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-[#1A1C1E] px-6 md:px-8 py-4 md:py-6 flex-1 min-w-0 flex flex-row-reverse items-center justify-between gap-4 md:gap-6 border-r-4 border-white/20 overflow-hidden"
                >
                  <div className="text-left min-w-0 flex-1">
                     <div className="text-[10px] text-white/40 font-bold tracking-wider">AWAY</div>
                     <AnimatePresence mode="popLayout">
                      <motion.div
                        key={state.teamB}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-lg md:text-xl lg:text-3xl font-black italic tracking-tighter text-white uppercase truncate max-w-full px-2 overflow-visible"
                      >
                        {state.teamB}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={state.scoreB}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl md:text-6xl lg:text-7xl font-black text-white font-mono leading-none"
                    >
                      {state.scoreB.toString().padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* BOTTOM CENTER: ROUND / STATUS */}
            <div className="flex justify-center w-full">
                <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-stretch shadow-2xl bg-[#1A1C1E] border-t-2 border-orange-core w-full max-w-[min(92vw,900px)] mx-auto overflow-hidden"
              >
                <div className="px-6 md:px-10 py-3 bg-orange-core text-black font-black uppercase italic tracking-widest flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={state.roundName}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="truncate max-w-[28ch] px-2 overflow-visible"
                    >
                      {state.roundName}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="px-6 md:px-10 py-3 font-black uppercase italic tracking-widest flex items-center gap-4 text-white min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={state.matchStatus}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="truncate max-w-[36ch] px-2 overflow-visible"
                    >
                      {state.matchStatus}
                    </motion.span>
                  </AnimatePresence>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-orange-core"></div>
                    <div className="w-3 h-3 bg-orange-core"></div>
                    <div className="w-3 h-3 bg-white/10"></div>
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
