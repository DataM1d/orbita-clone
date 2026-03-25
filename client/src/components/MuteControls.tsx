

import { useStore } from '../store/useStore';

export const MuteControls = () => {
    const { 
        mutedTracks, 
        toggleTrack, 
        saveProject, 
        clearPlatter, 
        isSaving, 
        magnets 
    } = useStore();

    const trackColors = [
        'border-[#ff4d4d]', 
        'border-[#4da6ff]', 
        'border-[#4d4dff]', 
        'border-[#4dffff]'
    ];

    const activeBgColors = [
        'bg-[#ff4d4d]',
        'bg-[#4da6ff]',
        'bg-[#4d4dff]',
        'bg-[#4dffff]'
    ];

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex gap-4">
            {mutedTracks.map((isMuted, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => toggleTrack(i)}
                        className={`w-14 h-14 rounded-full border-4 transition-all duration-200 flex items-center justify-center font-bold text-xs ${
                            isMuted 
                                ? 'border-neutral-800 bg-neutral-900 text-neutral-600 scale-90'
                                : `${trackColors[i]} ${activeBgColors[i]} text-white scale-100 shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)]`
                        }`}
                    >
                        {isMuted ? 'MUTE' : 'ON'}
                    </button>
                    <span className="text-[10px] text-white/40 font-mono tracking-widest">TRK 0{i + 1}</span>
                </div>
            ))}
        </div>

        <div className="w-[1px] h-12 bg-white/10 mx-2" />

        <div className="flex flex-col gap-2">
                <button
                    onClick={saveProject}
                    disabled={isSaving || magnets.length === 0}
                    className={`px-6 py-2 rounded-lg font-mono text-[11px] font-bold tracking-tighter transition-all ${
                        isSaving 
                        ? 'bg-yellow-500/20 text-yellow-500 cursor-wait' 
                        : 'bg-white/10 text-white hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed'
                    }`}
                >
                    {isSaving ? 'UPLOADING...' : 'SAVE LOOP'}
                </button>
                
                <button
                    onClick={clearPlatter}
                    className="px-6 py-2 rounded-lg font-mono text-[11px] font-bold tracking-tighter text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-95"
                >
                    CLEAR ALL
              </button>
          </div>
      </div>
    );
};