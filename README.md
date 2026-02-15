# CARaoke - Car Karaoke App 🚗🎤

A React Native (Expo) application designed for in-car karaoke entertainment.
Built with **React Native**, **Expo**, **YouTube Data API**, and **Zustand**.

## Features

- **YouTube Karaoke Search**: Search for TJ/Geumyoung karaoke videos directly from YouTube.
- **Video Player**: Customized YouTube player optimized for car screens (supports 4:3 and 16:9).
- **Pitch Control (Varispeed)**: Change the key of the song by adjusting playback speed (Client-side workaround for YouTube API limitations).
- **Volume Control**: Dedicated volume buttons for easy adjustment while driving.
- **Queue System**: Add songs to a queue, view history, and auto-play the next song.
- **Voice Search Capable**: UI prepared for voice search integration.

## Screenshots

*(Add screenshots here manually after running the app)*

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo Go app on your mobile device (or Android Studio/Xcode for simulator)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BlueHair37/CARaoke.git
   cd CARaoke
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API Key:
   - Open `src/services/youtube.ts`
   - Replace `'YOUR_YOUTUBE_API_KEY'` with your actual YouTube Data API Key.

4. Run the app:
   ```bash
   npx expo start
   ```

## Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router
- **State Management**: Zustand
- **Video**: react-native-youtube-iframe
- **Styling**: StyleSheet (Responsive)

## License

MIT
