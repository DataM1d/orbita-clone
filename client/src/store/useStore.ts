import { create } from 'zustand';

interface Magnet {
    id: string;
    angle: number;//0 to 360
    radius: number;
    trackIndex: number;// 0 to 3 (which ring)
    note: string;
    color: string;
}

interface OrbitaState {
    magnets: Magnet[];
    mutedTracks: boolean[];
    addMagnet: (angle: number, radius: number) => void;
    toggleTrack: (index: number) => void;
    removeMagnet: (id: string) => void;
}

export const useStore = create<OrbitaState>((set) => ({
    magnets: [],
    mutedTracks: [false, false, false, false],

    addMagnet: (angle, radius) => {
        const trackIndex = Math.min(Math.floor((radius - 0.5) / 1.1), 3);
        if (trackIndex < 0) return;

        const notes = ["C4", "E4", "G4", "B4"]; // Simple Cmaj7 chord mapping
        const colors = ["#ff4d4d", "#4da6ff", "#4d4dff", "#4dffff"];

        const newMagnet: Magnet = {
            id: Math.random().toString(36).substring(7),
            angle,
            radius: (trackIndex + 1) * 1.1, // Snap to the center of the track
            color: colors[trackIndex],
            note: notes[trackIndex],
            trackIndex,
        };

        set((state) => ({ magnets: [...state.magnets, newMagnet] }));
    },

    toggleTrack: (index) => set((state) => {
        const newMuted = [...state.mutedTracks];
        newMuted[index] = !newMuted[index];
        return { mutedTracks: newMuted };
    }),

    removeMagnet: (id) => set((state) => ({
        magnets: state.magnets.filter(m => m.id !== id)
    })),
}));