export interface Song {
    id: string;
    title: string;
    artist: string; // Often part of the title in YouTube results
    thumbnail: string;
    channelTitle: string;
}

export interface QueueState {
    currentSong: Song | null;
    queue: Song[];
    history: Song[];
    pitch: number; // -6 to +6
    playbackRate: number; // calculated from pitch
    volume: number; // 0 to 100
    addToQueue: (song: Song) => void;
    playNext: () => void;
    removeFromQueue: (songId: string) => void;
    setPitch: (pitch: number) => void;
    setVolume: (volume: number) => void;
}
