import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

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
    bpm: number;
    addMagnet: (angle: number, radius: number) => void;
    removeMagnet: (id: string) => void;
}

export const useStore = create<OrbitaState>((set) => ({
    magnets: [],
    bpm: 120,

    addMagnet: (angle, radius) => {
     //Determining track index based on radius 
    const trackIndex = Math.floor((radius / 5) * 4);
    const notes = ["C4", "E4", "G4", "B4"]; // Simple Cmaj7 chord mapping
    const colors = ["#ff4d4d", "#4da6ff", "#4d4dff", "#4dffff"];

    const newMagnet: Magnet = {
      id: uuidv4(),
      angle,
      radius,
      trackIndex: Math.min(trackIndex, 3),
      note: notes[Math.min(trackIndex, 3)],
      color: colors[Math.min(trackIndex, 3)],
    };

    set((state) => ({ magnets: [...state.magnets, newMagnet] }));
  },

  removeMagnet: (id) => set((state) => ({
    magnets: state.magnets.filter((m) => m.id !== id)
  })),
}));