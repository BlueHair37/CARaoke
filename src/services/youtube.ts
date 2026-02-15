import { Song } from '../types';

const API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Replace with actual key
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export const searchYouTube = async (query: string): Promise<Song[]> => {
    if (API_KEY === 'YOUR_YOUTUBE_API_KEY') {
        console.warn('YouTube API Key is missing. Returning mock data.');
        return mockSearch(query);
    }

    try {
        const response = await fetch(
            `${BASE_URL}?part=snippet&q=${encodeURIComponent(query + ' karaoke')}&type=video&key=${API_KEY}&maxResults=10`
        );
        const data = await response.json();

        if (!data.items) {
            return [];
        }

        return data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle, // Simplifying for now
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
        }));
    } catch (error) {
        console.error('Error searching YouTube:', error);
        return [];
    }
};

const mockSearch = (query: string): Song[] => {
    return [
        {
            id: 'dQw4w9WgXcQ',
            title: `Mock Result for ${query} - Never Gonna Give You Up`,
            artist: 'Rick Astley',
            thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            channelTitle: 'RickAstleyVEVO'
        },
        {
            id: '34Na4j8AVgA',
            title: 'The Weeknd - Starboy ft. Daft Punk',
            artist: 'The Weeknd',
            thumbnail: 'https://i.ytimg.com/vi/34Na4j8AVgA/hqdefault.jpg',
            channelTitle: 'TheWeekndVEVO'
        }
    ];
}
