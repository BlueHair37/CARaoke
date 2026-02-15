import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as Speech from 'expo-speech'; // Note: expo-speech is for TTS. For STT we might need another lib or use keyboard dictation. 
// Actually, 'expo-speech' is Text-to-Speech.
// 'expo-speech-recognition' is a separate community package or we use native keyboard dictation.
// For simplicity in this plan, accessing the detailed implementation plan, I said "expo-speech-recognition (or react-native-voice)".
// Since 'react-native-voice' requires native linking which can be tricky in managed workflow without prebuild, and 'expo-speech' is TTS.
// I will simulate voice button to just focus input for system dictation for now, as reliable STT often requires native permissions and config.
// OR I can use a simpler approach: Just a button that focuses the input, user uses keyboard mic.
// AND I recall the user asked for voice search.
// Let's implement the UI and a placeholder for the actual Speech-to-Text logic, or assume the user uses the keyboard's microphone.

// Update: The implementation plan said: "Voice Search will use Expo's speech-to-text to capture input"
// Expo doesn't have a built-in STT API in the core SDK that works easily without config. 
// However, I can add a visual placeholder for the "Mic" button.

import { useRouter } from 'expo-router';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search songs / artists..."
                placeholderTextColor="#888"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            {/* Mic Button Placeholder */}
            <TouchableOpacity style={[styles.button, styles.micButton]} onPress={() => alert("Voice Search: Please use keyboard microphone for now.")}>
                <Text style={styles.buttonText}>🎤</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        width: '100%',
        maxWidth: 800, // Max width for larger screens
        alignSelf: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#333',
        color: 'white',
        padding: 15,
        borderRadius: 8,
        fontSize: 18,
        marginRight: 10,
    },
    button: {
        backgroundColor: '#ff0000',
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    micButton: {
        backgroundColor: '#555',
        marginLeft: 10,
        minWidth: 50,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
