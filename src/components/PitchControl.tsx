import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQueueStore } from '../store/queueStore';

export default function PitchControl() {
    const { pitch, setPitch } = useQueueStore();

    const handlePitchChange = (change: number) => {
        setPitch(pitch + change);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Key Control</Text>
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePitchChange(-1)}
                    onLongPress={() => handlePitchChange(-6)} // Quick jump
                >
                    <Text style={styles.buttonText}>b (-1)</Text>
                </TouchableOpacity>

                <View style={styles.display}>
                    <Text style={styles.value}>
                        {pitch > 0 ? `+${pitch}` : pitch}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handlePitchChange(1)}
                    onLongPress={() => handlePitchChange(6)} // Quick jump
                >
                    <Text style={styles.buttonText}># (+1)</Text>
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
        minWidth: 60,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    display: {
        width: 50,
        alignItems: 'center',
    },
    value: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
