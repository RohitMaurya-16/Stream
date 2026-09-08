import { CONFIG } from './config';

/**
 * Fetch movie news from NewsAPI
 * @param {string} movieTitle - Title of the movie
 */
export const getMovieNews = async (movieTitle) => {
    try {
        if (!CONFIG.NEWS.API_KEY) {
            console.warn('News API key is not configured. Please set VITE_NEWS_API_KEY in .env');
            return [];
        }

        const searchQuery = `"${movieTitle}" AND (movie OR film OR cinema OR review OR premiere)`;
        const response = await fetch(
            `${CONFIG.NEWS.BASE_URL}/everything?` +
            `q=${encodeURIComponent(searchQuery)}` +
            `&apiKey=${CONFIG.NEWS.API_KEY}` +
            `&language=en` +
            `&sortBy=publishedAt` +
            `&pageSize=12` +
            `&searchIn=title,description`
        );

        const data = await response.json();

        if (data.status === 'ok' && data.articles) {
            return data.articles
                .filter(article => (
                    article.urlToImage &&
                    article.title &&
                    article.description &&
                    !article.title.includes('[Removed]')
                ))
                .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                .slice(0, 12);
        } else {
            throw new Error(data.message || 'Failed to fetch news');
        }
    } catch (error) {
        console.error('News fetch error:', error);
        throw error;
    }
};
