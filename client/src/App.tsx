import { useState, useEffect } from 'react';
import { Scene } from './engine/Scene';
import { initAudio } from './engine/Audio';
import { MuteControls } from './components/MuteControls';
import { useStore } from './store/useStore';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const { loadProject, projectName } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('p');

    if (projectId) {
      loadProject(projectId);
    }
  }, [loadProject]);  

  const handleStart = async () => {
    try {
      await initAudio();
      setIsStarted(true);
    } catch (error) {
      console.error("Failed to start audio:", error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      {!isStarted ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <h1 className="text-white text-4xl font-black tracking-tighter mb-8 opacity-20">ORBITA</h1>
          <button 
            onClick={handleStart}
            className="px-12 py-5 bg-white text-black rounded-full font-black text-sm tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            INITIALIZE ENGINE
          </button>
        </div>
      ) : (
        <>
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <h2 className="text-white/20 text-[10px] font-mono tracking-[0.3em] uppercase mb-1">Active Project</h2>
            <p className="text-white font-bold tracking-tight opacity-80">{projectName}</p>
          </div>

          <Scene />
          <MuteControls />
        </>
      )}
    </div>
  );
}

export default App;