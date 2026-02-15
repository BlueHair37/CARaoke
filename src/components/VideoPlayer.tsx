import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useQueueStore } from '../store/queueStore';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function VideoPlayer() {
    const { currentSong, playNext, playbackRate, volume } = useQueueStore();
    const [playing, setPlaying] = useState(false);

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
            playNext();
        }
        if (state === 'playing') {
            setPlaying(true);
        }
        if (state === 'paused') {
            setPlaying(false);
        }
    }, [playNext]);

    if (!currentSong) {
        return (
            <View style={styles.placeholder}>
                {/* You could add a logo or waiting text here */}
            </View>
        );
    }

    // Calculate 16:9 aspect ratio height based on screen width
    const screenWidth = Dimensions.get('window').width;
    // Use 100% width, height calculated for 16:9
    const videoHeight = screenWidth * (9 / 16);

    return (
        <View style={styles.container}>
            <YoutubePlayer
                height={videoHeight}
                play={true}
                videoId={currentSong.id}
                onChangeState={onStateChange}
                playbackRate={playbackRate}
                volume={volume}
                initialPlayerParams={{
                    controls: true,
                    modestbranding: true,
                    rel: 0,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    placeholder: {
        width: '100%',
        height: wp('100%') * (9 / 16), // Placeholder height
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
