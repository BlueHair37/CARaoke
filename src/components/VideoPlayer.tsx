import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useQueueStore } from '../store/queueStore';

export default function VideoPlayer() {
    const { currentSong, playNext, playbackRate, pitch, volume } = useQueueStore();
    const webviewRef = useRef<WebView>(null);
    const [playing, setPlaying] = useState(false);

    // Whenever playbackRate, pitch, or volume changes, send a message to the webview
    useEffect(() => {
        if (webviewRef.current) {
            // Send new settings to the injected JS via postMessage instead of re-injecting
            const message = JSON.stringify({
                type: 'UPDATE_SETTINGS',
                playbackRate: playbackRate,
                pitch: pitch,
                volume: volume / 100
            });
            webviewRef.current.injectJavaScript(`window.postMessage(${message}, '*'); true;`);
        }
    }, [playbackRate, pitch, volume]);

    const onMessage = (event: WebViewMessageEvent) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.event === 'ended') {
                setPlaying(false);
                playNext();
            } else if (data.event === 'playing') {
                setPlaying(true);
            } else if (data.event === 'paused') {
                setPlaying(false);
            }
        } catch (e) {
            console.error('WebView message parsing error', e);
        }
    };

    if (!currentSong) {
        return (
            <View style={styles.placeholder}>
            </View>
        );
    }

    const injectedJS = `
    // Listen for messages from React Native to update pitch and volume live
    window.addEventListener('message', function (event) {
        try {
            if (event.data && event.data.type === 'UPDATE_SETTINGS') {
                window.targetPitch = event.data.pitch; // expecting semitones -6 to +6
                window.targetVolume = event.data.volume;

                var video = document.querySelector('video');
                if (video) {
                    video.volume = window.targetVolume;
                }

                // If pitchShifter is setup, update it
                if (window.pitchShifter) {
                    window.pitchShifter.setPitchOffset(window.targetPitch);
                }
            }
        } catch (e) { }
    });

    // Initialize target rates from initial props
    window.targetPitch = ${pitch};
    window.targetVolume = ${volume / 100};

    // --- Original Jungle.js Pitch Shifter implementation ---
    function createFadeBuffer(context, activeTime, fadeTime) {
        var length1 = activeTime * context.sampleRate;
        var length2 = (activeTime - 2*fadeTime) * context.sampleRate;
        var length = length1 + length2;
        var buffer = context.createBuffer(1, length, context.sampleRate);
        var p = buffer.getChannelData(0);
        
        var fadeLength = fadeTime * context.sampleRate;

        var fadeIndex1 = fadeLength;
        var fadeIndex2 = length1 - fadeLength;
        
        // 1st part of cycle
        for (var i = 0; i < length1; ++i) {
            var value;
            if (i < fadeIndex1) {
                value = Math.sqrt(i / fadeLength);
            } else if (i >= fadeIndex2) {
                value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength);
            } else {
                value = 1;
            }
            p[i] = value;
        }

        // 2nd part
        for (var i = length1; i < length; ++i) {
            p[i] = 0;
        }
        return buffer;
    }

    function createDelayTimeBuffer(context, activeTime, fadeTime, shiftUp) {
        var length1 = activeTime * context.sampleRate;
        var length2 = (activeTime - 2*fadeTime) * context.sampleRate;
        var length = length1 + length2;
        var buffer = context.createBuffer(1, length, context.sampleRate);
        var p = buffer.getChannelData(0);

        // 1st part of cycle
        for (var i = 0; i < length1; ++i) {
            if (shiftUp) {
              p[i] = (length1-i)/length;
            } else {
              p[i] = i / length1;
            }
        }

        // 2nd part
        for (var i = length1; i < length; ++i) {
            p[i] = 0;
        }
        return buffer;
    }

    function Jungle(context) {
        var delayTime = 0.100;
        var fadeTime = 0.050;
        var bufferTime = 0.100;

        var input = context.createGain();
        var output = context.createGain();
        var bypass = context.createGain();
        
        var mod1 = context.createBufferSource();
        var mod2 = context.createBufferSource();
        var mod3 = context.createBufferSource();
        var mod4 = context.createBufferSource();
        var shiftDownBuffer = createDelayTimeBuffer(context, bufferTime, fadeTime, false);
        var shiftUpBuffer = createDelayTimeBuffer(context, bufferTime, fadeTime, true);
        mod1.buffer = shiftDownBuffer;
        mod2.buffer = shiftDownBuffer;
        mod3.buffer = shiftUpBuffer;
        mod4.buffer = shiftUpBuffer;
        mod1.loop = true;
        mod2.loop = true;
        mod3.loop = true;
        mod4.loop = true;

        var mod1Gain = context.createGain();
        var mod2Gain = context.createGain();
        var mod3Gain = context.createGain();
        var mod4Gain = context.createGain();
        mod3Gain.gain.value = 0;
        mod4Gain.gain.value = 0;

        mod1.connect(mod1Gain);
        mod2.connect(mod2Gain);
        mod3.connect(mod3Gain);
        mod4.connect(mod4Gain);

        var modGain1 = context.createGain();
        var modGain2 = context.createGain();

        var delay1 = context.createDelay(1);
        var delay2 = context.createDelay(1);
        mod1Gain.connect(modGain1);
        mod2Gain.connect(modGain2);
        mod3Gain.connect(modGain1);
        mod4Gain.connect(modGain2);
        modGain1.connect(delay1.delayTime);
        modGain2.connect(delay2.delayTime);

        var fade1 = context.createBufferSource();
        var fade2 = context.createBufferSource();
        var fadeBuffer = createFadeBuffer(context, bufferTime, fadeTime);
        fade1.buffer = fadeBuffer;
        fade2.buffer = fadeBuffer;
        fade1.loop = true;
        fade2.loop = true;

        var mix1 = context.createGain();
        var mix2 = context.createGain();
        mix1.gain.value = 0;
        mix2.gain.value = 0;

        fade1.connect(mix1.gain);    
        fade2.connect(mix2.gain);
            
        input.connect(delay1);
        input.connect(delay2);    
        delay1.connect(mix1);
        delay2.connect(mix2);
        mix1.connect(output);
        mix2.connect(output);
        input.connect(bypass);
        
        var t = context.currentTime + 0.050;
        var t2 = t + bufferTime - fadeTime;
        mod1.start(t);
        mod2.start(t2);
        mod3.start(t);
        mod4.start(t2);
        fade1.start(t);
        fade2.start(t2);

        var isBypassed = true;

        return {
            input: input,
            output: output,
            bypass: bypass,
            setPitchOffset: function(mult) {
                // Pitch bypass logi
                if (mult === 0) {
                    bypass.gain.value = 1;
                    output.gain.value = 0;
                    isBypassed = true;
                    return;
                } else {
                    bypass.gain.value = 0;
                    output.gain.value = 1;
                    isBypassed = false;
                }

                if (mult > 0) { // pitch up
                    mod1Gain.gain.value = 0;
                    mod2Gain.gain.value = 0;
                    mod3Gain.gain.value = 1;
                    mod4Gain.gain.value = 1;
                } else { // pitch down
                    mod1Gain.gain.value = 1;
                    mod2Gain.gain.value = 1;
                    mod3Gain.gain.value = 0;
                    mod4Gain.gain.value = 0;
                }

                var pitchRatio = Math.pow(2, mult / 12);
                var pitchOffset = Math.abs(pitchRatio - 1.0);
                
                modGain1.gain.setTargetAtTime(0.5 * delayTime * pitchOffset, context.currentTime, 0.010);
                modGain2.gain.setTargetAtTime(0.5 * delayTime * pitchOffset, context.currentTime, 0.010);
            }
        };
    }
    // ----------------------------------------------------

    var checkExist = setInterval(function () {
        var video = document.querySelector('video');
        if (video && !window.videoHooked) {
            window.videoHooked = true;

            // Initialize Web Audio API Pitch Shifter
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                window.audioCtx = new AudioContext({ sampleRate: 44100 });
                var source = window.audioCtx.createMediaElementSource(video);

                window.pitchShifter = Jungle(window.audioCtx);
                window.pitchShifter.setPitchOffset(window.targetPitch);

                source.connect(window.pitchShifter.input);
                window.pitchShifter.output.connect(window.audioCtx.destination);
                window.pitchShifter.bypass.connect(window.audioCtx.destination);
            } catch (e) {
                console.log("AudioContext setup failed: ", e);
            }

            // Since we are handling pitch manually, leave exact playback rate and standard pitch rules alone
            video.preservesPitch = true;
            video.webkitPreservesPitch = true;
            video.mozPreservesPitch = true;

            // Hook basic events
            video.addEventListener('ended', function () {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ended' }));
            });

            video.addEventListener('play', function () {
                if (window.audioCtx && window.audioCtx.state === 'suspended') {
                    window.audioCtx.resume();
                }
                video.volume = window.targetVolume;
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'playing' }));
            });

            video.addEventListener('pause', function () {
                if (video.currentTime === video.duration) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'ended' }));
                } else {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'paused' }));
                }
            });

            video.volume = window.targetVolume;
        }
    }, 300);

    // Hide EVERYTHING except the video element.
    var css = \`
            body, html {
                overflow: hidden !important;
                background-color: black !important;
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            video {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999999999 !important;
                object-fit: contain !important;
                background-color: black !important;
                pointer-events: auto !important;
            }
            /* Hide ALL specific YouTube mobile UI overlays */
            ytm-app ~ *, ytm-mobile-topbar-renderer, ytm-bottom-sheet-renderer, 
            .ytp-chrome-top, .ytp-chrome-bottom, .ytp-watermark, .ytm-custom-control,
            .player-controls-bottom, .player-controls-top, .ytm-media-controls,
            .bottom-controls, .spinner, .ytp-spinner {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
            }
        \`;
        var style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);

        true;
    `;

    // Modern mobile user agent to force the mobile site (m.youtube.com)
    // Using an Android UA here as it tends to be less strict on autoplay compared to iOS Safari UA
    const M_USER_AGENT = "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36";

    return (
        <View style={styles.container}>
            <WebView
                ref={webviewRef}
                style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'black' }}
                source={{
                    // Use the regular watch URL instead of embed to bypass 152/153 errors!
                    uri: 'https://m.youtube.com/watch?v=' + currentSong!.id
                }}
                userAgent={M_USER_AGENT}
                injectedJavaScript={injectedJS}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                originWhitelist={['*']}
                onMessage={onMessage}
                scrollEnabled={false}
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                // allow automatic playback on both iOS and Android
                mediaCapturePermissionGrantType="grant"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    placeholder: {
        width: '100%',
        height: Dimensions.get('window').width * (9 / 16),
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
