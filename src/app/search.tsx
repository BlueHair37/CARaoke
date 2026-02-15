import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { searchYouTube } from '../services/youtube';
import { useQueueStore } from '../store/queueStore';
import { Song } from '../types';

export default function SearchScreen() {
    const { q } = useLocalSearchParams<{ q: string }>();
    const [results, setResults] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToQueue } = useQueueStore();
    const router = useRouter();

    // Search Modifiers
    const modifiers = [
        { label: 'Key -1', value: 'key -1' },
        { label: 'Key +1', value: 'key +1' },
        { label: 'Female Key', value: 'female key' },
        { label: 'Male Key', value: 'male key' },
    ];

    useEffect(() => {
        if (q) {
            performSearch(q);
        }
    }, [q]);

    const performSearch = async (query: string) => {
        setLoading(true);
        const songs = await searchYouTube(query);
        setResults(songs);
        setLoading(false);
    };

    const handleModifierClick = (modifier: string) => {
        // Re-search with modifier
        performSearch(`${q} ${modifier}`);
    };

    const handleAddToQueue = (song: Song) => {
        addToQueue(song);
        // Optional: Go back to player or show toast
        // router.back(); 
        alert(`Added ${song.title} to queue!`);
    };

    const renderItem = ({ item }: { item: Song }) => (
        <View style={styles.resultItem}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => handleAddToQueue(item)}>
                <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Results for "{q}"</Text>
            </View>

            {/* Modifiers */}
            <View style={styles.modifiersContainer}>
                {modifiers.map((mod) => (
                    <TouchableOpacity key={mod.label} style={styles.modifierButton} onPress={() => handleModifierClick(mod.value)}>
                        <Text style={styles.modifierText}>{mod.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#ff0000" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    modifiersContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    modifierButton: {
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    modifierText: {
        color: '#ccc',
        fontSize: 14,
    },
    list: {
        flex: 1,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C2C2C',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    thumbnail: {
        width: 80,
        height: 60,
        borderRadius: 4,
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    title: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    artist: {
        color: '#aaaaaa',
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#ff0000',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
        marginLeft: 10,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    }
});
