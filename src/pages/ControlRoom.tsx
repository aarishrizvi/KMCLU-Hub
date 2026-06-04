import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { OverlayState } from '../types';
import { Save, RefreshCw, EyeOff, Eye, Trophy, MonitorUp } from 'lucide-react';

export default function ControlRoom() {
  const [state, setState] = useState<OverlayState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    document.body.classList.add('bg-[#0B0B0B]');
    document.body.classList.remove('bg-transparent', 'overflow-hidden');

    socket.on('stateUpdate', (newState: OverlayState) => {
      setState(newState);
    });

    return () => {
      socket.off('stateUpdate');
      document.body.classList.remove('bg-[#0B0B0B]');
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!state) return;
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleScore = (team: 'scoreA' | 'scoreB', delta: number) => {
    if (!state) return;
    const newScore = Math.max(0, state[team] + delta);
    const newState = { ...state, [team]: newScore };
    setState(newState);
    socket.emit('updateState', { [team]: newScore }); // Immediate sync for rapid scoring
  };

  const handleSave = () => {
    setIsSaving(true);
    socket.emit('updateState', state);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all overlay data?')) {
      socket.emit('resetState');
    }
  };

  const toggleOverlay = () => {
    if (!state) return;
    const toggled = !state.showOverlay;
    setState({ ...state, showOverlay: toggled });
    socket.emit('updateState', { showOverlay: toggled });
  };

  if (!state) {
    return <div className="min-h-screen flex items-center justify-center text-white p-8">Connecting to broadcast server...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-white max-w-6xl mx-auto">
      <header className="flex items-center gap-4 mb-8 pb-4 border-b border-[#2D2F31]">
        <div>
          <h1 className="text-orange-core font-black text-2xl tracking-tighter">KMCLU HUB <span className="text-white opacity-50 font-normal text-sm ml-2">V1.0</span></h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[2px] mt-1">Broadcast Control Room</p>
        </div>
        <div className="ml-auto flex items-center gap-2 bg-orange-core p-4 text-black font-black tracking-tighter text-[10px]">
          <div className={`w-2 h-2 rounded-full ${state.showOverlay ? 'bg-black animate-pulse' : 'bg-red-900'} `}></div>
          <span>REALTIME CONNECTION: {state.showOverlay ? 'ACTIVE' : 'HIDDEN'}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: TEAMS & SCORES */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1A1C1E] p-6 border border-[#2D2F31] shadow-xl">
              <h2 className="text-[11px] text-orange-core font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> TEAM A
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#0B0B0B] border-l-4 border-orange-core">
                <label className="text-[10px] text-white/50 uppercase block mb-1">Team Name</label>
                <input
                  type="text"
                  name="teamA"
                  value={state.teamA}
                  onChange={handleChange}
                  className="bg-transparent text-lg font-black w-full mb-3 uppercase focus:outline-none focus:text-orange-core transition-colors"
                />
                <div className="flex items-center gap-4">
                  <button onClick={() => handleScore('scoreA', -1)} className="flex-1 bg-[#2D2F31] hover:bg-[#3D3F41] py-2 font-bold">-</button>
                  <div className="text-3xl font-black w-12 text-center text-orange-core">{state.scoreA.toString().padStart(2, '0')}</div>
                  <button onClick={() => handleScore('scoreA', 1)} className="flex-1 bg-orange-core text-black hover:bg-[#FB923C] py-2 font-bold">+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1C1E] p-6 border border-[#2D2F31] shadow-xl">
            <h2 className="text-[11px] text-orange-core font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> TEAM B
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#0B0B0B] border-l-4 border-white/20">
                <label className="text-[10px] text-white/50 uppercase block mb-1">Team Name</label>
                <input
                  type="text"
                  name="teamB"
                  value={state.teamB}
                  onChange={handleChange}
                  className="bg-transparent text-lg font-black w-full mb-3 uppercase focus:outline-none transition-colors"
                />
                <div className="flex items-center gap-4">
                  <button onClick={() => handleScore('scoreB', -1)} className="flex-1 bg-[#2D2F31] hover:bg-[#3D3F41] py-2 font-bold">-</button>
                  <div className="text-3xl font-black w-12 text-center text-white">{state.scoreB.toString().padStart(2, '0')}</div>
                  <button onClick={() => handleScore('scoreB', 1)} className="flex-1 bg-orange-core text-black hover:bg-[#FB923C] py-2 font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: MATCH DETAILS */}
        <div className="lg:col-span-4 bg-[#1A1C1E] p-6 border border-[#2D2F31] shadow-xl h-fit">
          <h2 className="text-[11px] text-orange-core font-bold uppercase tracking-widest mb-4">Match Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-white/50 uppercase block mb-1">Match Title</label>
              <input
                type="text"
                name="matchTitle"
                value={state.matchTitle}
                onChange={handleChange}
                className="w-full bg-[#0B0B0B] border border-[#2D2F31] p-3 text-sm focus:border-orange-core outline-none transition-colors uppercase font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase block mb-1">Round Name</label>
              <input
                type="text"
                name="roundName"
                value={state.roundName}
                onChange={handleChange}
                className="w-full bg-[#0B0B0B] border border-[#2D2F31] p-3 text-sm focus:border-orange-core outline-none transition-colors uppercase font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-white/50 uppercase block mb-1">Match Status</label>
              <input
                type="text"
                name="matchStatus"
                value={state.matchStatus}
                onChange={handleChange}
                className="w-full bg-[#0B0B0B] border border-[#2D2F31] p-3 text-sm focus:border-orange-core outline-none transition-colors uppercase font-bold"
                placeholder="e.g. LIVE, PAUSED"
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: ACTIONS */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#1A1C1E] p-6 border border-[#2D2F31] shadow-xl h-fit space-y-4">
             <h2 className="text-[11px] text-orange-core font-bold uppercase tracking-widest mb-4">Actions</h2>
             
             <button
              onClick={handleSave}
              className="w-full py-3 bg-orange-core text-black font-black tracking-tighter uppercase flex items-center justify-center gap-2 hover:bg-[#FB923C] transition-colors"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'SAVING...' : 'SAVE ALL'}
            </button>

            <button
              onClick={toggleOverlay}
              className={`w-full py-3 font-black tracking-tighter uppercase flex items-center justify-center gap-2 transition-colors ${state.showOverlay ? 'bg-[#0B0B0B] border border-[#2D2F31] text-white/50 hover:text-white' : 'bg-white text-black'}`}
            >
              {state.showOverlay ? <><EyeOff className="w-4 h-4" /> HIDE OVERLAY</> : <><Eye className="w-4 h-4" /> SHOW OVERLAY</>}
            </button>

            <button
              onClick={handleReset}
              className="w-full py-3 mt-8 font-black tracking-tighter uppercase flex items-center justify-center gap-2 text-red-500 border border-red-900/30 bg-[#0B0B0B] hover:bg-red-900/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> FACTORY RESET
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
