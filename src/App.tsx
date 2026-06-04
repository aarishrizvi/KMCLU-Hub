/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ControlRoom from './pages/ControlRoom';
import Overlay from './pages/Overlay';

function Home() {
  return (
    <div className="min-h-screen bg-gunmetal-dark flex flex-col items-center justify-center p-8 text-center text-white">
      <h1 className="text-4xl font-display font-bold mb-4">KMCLU Hub Overlay System</h1>
      <p className="text-gray-400 mb-8 max-w-lg">
        This is a real-time broadcast graphics system. Open the Control Room in one tab and the Overlay in another to see it in action.
      </p>
      
      <div className="flex gap-4">
        <Link 
          to="/control-room" 
          target="_blank"
          className="px-6 py-3 bg-gunmetal border border-gray-700 hover:border-orange-core hover:text-orange-core transition-colors"
        >
          Open Control Room
        </Link>
        <Link 
          to="/overlay" 
          target="_blank"
          className="px-6 py-3 bg-orange-core text-white hover:bg-orange-600 transition-colors"
        >
          Open OBS Overlay
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/control-room" element={<ControlRoom />} />
        <Route path="/overlay" element={<Overlay />} />
      </Routes>
    </BrowserRouter>
  );
}
