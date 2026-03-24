import { useState } from 'react';
import { Scene } from './engine/Scene';
import { initAudio } from './engine/Audio';

function App() {
  const [isStarted, setIsStarted] = useState(false);

  const handleStart = async () => {
    try {
      await initAudio();
      setIsStarted(true);
    } catch (error) {
      console.error("Failed to start audio:", error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {!isStarted ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
          <button 
            onClick={handleStart}
            className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-colors"
          >
            INITIALIZE ORBITA
          </button>
        </div>
      ) : (
        <Scene />
      )}
    </div>
  );
}

export default App;