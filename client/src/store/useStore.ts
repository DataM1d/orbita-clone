import { create } from 'zustand';
import { getDeviceId } from '../utils/deviceId';

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
    projectName: string;
    isSaving: boolean;

    addMagnet: (angle: number, radius: number) => void;
    toggleTrack: (index: number) => void;
    removeMagnet: (id: string) => void;
    clearPlatter: () => void;

    saveProject: () => Promise<void>;
    loadProject: (id: string) => Promise<void>
}

export const useStore = create<OrbitaState>((set, get) => ({
    magnets: [],
    mutedTracks: [false, false, false, false],
    projectName: "New Orbita Loop",
    isSaving: false,

    addMagnet: (angle, radius) => {
        const trackIndex = Math.min(Math.floor((radius - 0.5) / 1.1), 3);
        if (trackIndex < 0) return;

        const notes = ["C4", "E4", "G4", "B4"]; // Simple Cmaj7 chord mapping
        const colors = ["#ff4d4d", "#4da6ff", "#4d4dff", "#4dffff"];

        const newMagnet: Magnet = {
            id: crypto.randomUUID?.() || Math.random().toString(36).substring(7),
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

    clearPlatter: () => set({ magnets: [] }),

    saveProject: async () => {
        const { magnets, projectName, isSaving } = get();
        if (isSaving || magnets.length === 0) return;

        set({ isSaving: true });

        try {
            const response = await fetch('http://localhost:8080/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Device-ID': getDeviceId(),
                },
                body: JSON.stringify({
                    name: projectName,
                    magnets: magnets,
                }),
            });

            if (!response.ok) throw new Error('Failed to save');
            
            const data = await response.json();
            console.log("Saved successfully! Project ID:", data.id);
        } catch (err) {
            console.error("Save Error", err);
        } finally {
            set({ isSaving: false });
        }
    },

    loadProject: async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
                headers: {
                    'X-Device-ID': getDeviceId(),
                }
            });
            
            if (!response.ok) throw new Error('Project not found');
            
            const data = await response.json();
            set({ 
                magnets: data.magnets || [], 
                projectName: data.name 
            });
        } catch (err) {
            console.error("Load Error:", err);
        }
    }
}));