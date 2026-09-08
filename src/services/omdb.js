import { CONFIG } from './config';

/**
 * Fetch detailed movie information from OMDB API
 * @param {string} imdbId - IMDb movie ID (e.g., tt0111161)
 */
export const getOmdbMovieDetails = async (imdbId) => {
    try {
        if (!CONFIG.OMDB.API_KEY) {
            throw new Error('OMDB API key is not configured. Please set VITE_OMDB_API_KEY in .env');
        }

        const response = await fetch(
            `${CONFIG.OMDB.BASE_URL}/?apikey=${CONFIG.OMDB.API_KEY}&i=${encodeURIComponent(imdbId)}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching OMDB movie details:', error);
        throw error;
    }
};
