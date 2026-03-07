import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useQueueStore } from '../store/queueStore';
import VideoPlayer from '../components/VideoPlayer';
import SearchBar from '../components/SearchBar';
import PitchControl from '../components/PitchControl';
import VolumeControl from '../components/VolumeControl';

export default function App() {
    const { currentSong, queue, playNext, addToQueue, removeFromQueue } = useQueueStore();
    const [isPanelVisible, setPanelVisible] = useState(false);

    const renderQueueItem = ({ item }: { item: any }) => (
        <View style={styles.queueItem}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromQueue(item.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
        </View>
    );
    return (
        <View style={styles.container}>
            {/* Background: Fullscreen Video Player */}
            <View style={styles.videoContainer}>
                <VideoPlayer />
            </View>

            {/* Floating Action Button to toggle control panel */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setPanelVisible(!isPanelVisible)}
            >
                <Text style={styles.fabText}>{isPanelVisible ? '▼' : '▲'} Controls</Text>
            </TouchableOpacity>

            {/* Foreground: Floating Control Panel */}
            {isPanelVisible && (
                <View style={styles.overlayPanel}>
                    {/* Middle Section: Search & Controls */}
                    <View style={styles.controlsContainer}>
                        {currentSong && (
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <PitchControl />
                                <VolumeControl />
                            </View>
                        )}
                        <SearchBar />
                        {currentSong && (
                            <View style={styles.currentSongInfo}>
                                <Text style={styles.nowPlayingText}>Now Playing: {currentSong.title}</Text>
                                <TouchableOpacity style={styles.skipButton} onPress={playNext}>
                                    <Text style={styles.skipButtonText}>Skip Song</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Bottom Section: Queue */}
                    <View style={styles.queueContainer}>
                        <Text style={styles.sectionTitle}>Queue ({queue.length})</Text>
                        <FlatList
                            data={queue}
                            renderItem={renderQueueItem}
                            keyExtractor={(item) => item.id}
                            style={styles.queueList}
                            ListEmptyComponent={<Text style={styles.emptyText}>No songs in queue. Search to add!</Text>}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    videoContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 0,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#ff0000',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        zIndex: 20,
    },
    fabText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    overlayPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65%',
        backgroundColor: 'rgba(30,30,30,0.95)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        zIndex: 10,
    },
    controlsContainer: {
        padding: 10,
    },
    currentSongInfo: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    nowPlayingText: {
        color: '#fff',
        flex: 1,
        marginRight: 10,
    },
    skipButton: {
        backgroundColor: '#444',
        padding: 8,
        borderRadius: 5,
    },
    skipButtonText: {
        color: '#fff',
    },
    queueContainer: {
        flex: 1,
        padding: 10,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    queueList: {
        flex: 1,
    },
    queueItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
    },
    thumbnail: {
        width: 60,
        height: 45,
        borderRadius: 4,
        marginRight: 10,
    },
    songInfo: {
        flex: 1,
    },
    songTitle: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    songArtist: {
        color: '#aaaaaa',
        fontSize: 14,
    },
    removeButton: {
        padding: 10,
    },
    removeButtonText: {
        color: '#ff4444',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20
    }
});
