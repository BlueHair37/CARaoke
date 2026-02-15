# CARaoke - 차량용 노래방 앱 🚗🎤

차량 내 엔터테인먼트를 위한 React Native (Expo) 기반 노래방 애플리케이션입니다.
**React Native**, **Expo**, **YouTube Data API**, **Zustand**를 사용하여 제작되었습니다.

## 주요 기능

- **유튜브 노래방 검색**: 유튜브에서 TJ/금영 노래방 반주 영상을 직접 검색합니다.
- **차량 최적화 플레이어**: 4:3 및 16:9 비율을 지원하며 차량 화면에 최적화된 커스텀 플레이어입니다.
- **음조 조절 (Pitch Control)**: 재생 속도를 조절하여 키를 변경합니다 (Varispeed 방식 - 유튜브 API 제약 우회).
- **볼륨 조절**: 운전 중에도 쉽게 조절할 수 있는 전용 볼륨 버튼을 제공합니다.
- **예약 시스템**: 노래를 대기열에 추가하고, 재생 기록을 확인하며, 다음 곡 자동 재생을 지원합니다.
- **음성 검색 준비**: 음성 검색 연동을 위한 UI가 마련되어 있습니다.

## 스크린샷

*(앱 실행 후 권장 스크린샷을 추가해주세요)*

## 시작하기

### 필수 사항

- Node.js
- npm 또는 yarn
- 모바일 기기의 Expo Go 앱 (또는 시뮬레이터 구동을 위한 Android Studio/Xcode)

### 설치 방법

1. 리포지토리 클론:
   ```bash
   git clone https://github.com/BlueHair37/CARaoke.git
   cd CARaoke
   ```

2. 패키지 설치:
   ```bash
   npm install
   ```

3. API 키 설정:
   - `src/services/youtube.ts` 파일을 엽니다.
   - `'YOUR_YOUTUBE_API_KEY'` 부분을 실제 발급받은 YouTube Data API Key로 변경합니다.

4. 앱 실행:
   ```bash
   npx expo start
   ```

## 기술 스택

- **프레임워크**: Expo (React Native)
- **네비게이션**: Expo Router
- **상태 관리**: Zustand
- **비디오**: react-native-youtube-iframe
- **스타일링**: StyleSheet (반응형)

## 라이선스

MIT
