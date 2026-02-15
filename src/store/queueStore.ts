import { create } from 'zustand';
import { QueueState, Song } from '../types';

export const useQueueStore = create<QueueState>((set) => ({
    currentSong: null,
    queue: [],
    history: [],
    pitch: 0,
    playbackRate: 1.0,
    volume: 100,

    addToQueue: (song: Song) =>
        set((state) => {
            // If no song is playing, play this one immediately
            if (!state.currentSong) {
                return { currentSong: song };
            }
            return { queue: [...state.queue, song] };
        }),

    playNext: () =>
        set((state) => {
            const nextSong = state.queue[0];
            const remainingQueue = state.queue.slice(1);

            return {
                currentSong: nextSong || null,
                queue: remainingQueue,
                history: state.currentSong ? [...state.history, state.currentSong] : state.history,
            };
        }),

    removeFromQueue: (songId: string) =>
        set((state) => ({
            queue: state.queue.filter((s) => s.id !== songId),
        })),

    setPitch: (newPitch: number) =>
        set(() => {
            // Limit pitch between -6 and +6
            const clampedPitch = Math.max(-6, Math.min(6, newPitch));
            const rate = Math.pow(2, clampedPitch / 12);
            return { pitch: clampedPitch, playbackRate: rate };
        }),

    setVolume: (newVolume: number) =>
        set(() => ({
            volume: Math.max(0, Math.min(100, newVolume)),
        })),
}));
