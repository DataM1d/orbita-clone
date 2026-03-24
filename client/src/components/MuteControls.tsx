

import { useStore } from '../store/useStore';

export const MuteControls = () => {
    const mutedTracks = useStore((state) => state.mutedTracks);
    const toggleTrack = useStore((state) => state.toggleTrack);

    // Matching the colors from useStore.ts
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
            {mutedTracks.map((isMuted, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                    <button
                        onClick={() => toggleTrack(i)}
                        className={`w-14 h-14 rounded-full border-4 transition-all duration-200 flex items-center justify-center font-bold text-xs ${
                            isMuted 
                                ? 'border-neutral-700 bg-neutral-900 text-neutral-600 scale-90' 
                                : `${trackColors[i]} ${activeBgColors[i]} text-white scale-100 shadow-[0_0_20px_rgba(255,255,255,0.2)]`
                        }`}
                    >
                        {isMuted ? 'MUTE' : 'ON'}
                    </button>
                    <span className="text-[10px] text-white/50 font-mono">TRACK 0{i + 1}</span>
                </div>
            ))}
        </div>
    );
};