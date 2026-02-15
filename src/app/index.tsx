import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useQueueStore } from '../store/queueStore';
import VideoPlayer from '../components/VideoPlayer';
import SearchBar from '../components/SearchBar';
import PitchControl from '../components/PitchControl';
import VolumeControl from '../components/VolumeControl';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function App() {
    const { currentSong, queue, playNext, addToQueue, removeFromQueue } = useQueueStore();

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
            {/* Top Section: Video Player */}
            <View style={styles.videoContainer}>
                <VideoPlayer />
            </View>

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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    videoContainer: {
        // 16:9 ratio is handled inside VideoPlayer, but we can constrain it here
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    controlsContainer: {
        padding: 10,
        backgroundColor: '#1E1E1E',
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
        backgroundColor: '#333',
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
        backgroundColor: '#2C2C2C',
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
        color: '#666',
        textAlign: 'center',
        marginTop: 20
    }
});
