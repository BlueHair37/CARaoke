import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQueueStore } from '../store/queueStore';

export default function VolumeControl() {
    const { volume, setVolume } = useQueueStore();

    const handleVolumeChange = (change: number) => {
        setVolume(volume + change);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Volume</Text>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleVolumeChange(-10)}
                    onLongPress={() => handleVolumeChange(-20)}
                >
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>

                <View style={styles.display}>
                    <Text style={styles.value}>{volume}%</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleVolumeChange(10)}
                    onLongPress={() => handleVolumeChange(20)}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#222',
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
        marginLeft: 10, // Spacing if placed next to pitch control
    },
    label: {
        color: '#aaa',
        fontSize: 12,
        marginBottom: 5,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 5,
        minWidth: 40,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    display: {
        width: 60,
        alignItems: 'center',
    },
    value: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
