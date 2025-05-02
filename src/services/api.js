const TMDB_API_KEY = "1e58a98830bc8b3f646072c2d4963c7f";
const YOUTUBE_API_KEY = "AIzaSyCofcJoFTC4L7Y8rbBaOrILKjVTF6CRZds";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";
const WATCHMODE_API_KEY = "bpQtOCMxR1m6qtxR3hNjd2HZvPEi2VwLNxKE7DWV";
const WATCHMODE_BASE_URL = "https://api.watchmode.com/v1";


// Function to get movie details
export const getMovieDetails = async (movieId, mediaType = 'movie') => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/${mediaType}/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

// Function to get movie trailer
export const getMovieTrailer = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/videos?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results.find(video => video.type === "Trailer");
};

// Function to get related songs
export const getMovieSongs = async (query) => {
    const response = await fetch(
        `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=5&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    return await response.json();
};

// Function to get popular movies
export const getPopularMovies = async () => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch popular movies');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        throw error;
    }
};

// Function to search movies by query
export const searchMovies = async (query) => {
    try {
        const response = await fetch(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
            throw new Error('Failed to search movies');
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

// Function to get movie credits
export const getMovieCredits = async (id) => {
    const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    );
    return await response.json();
};

// Function to get movies by category
export const getMoviesByCategory = async (category) => {
    try {
        let endpoint = '';
        const params = new URLSearchParams({
            api_key: TMDB_API_KEY,
            language: 'en-US',
            page: 1,
            include_adult: false
        });

        switch (category) {
            case 'hollywood':
                endpoint = '/discover/movie';
                params.append('with_original_language', 'en');
                params.append('sort_by', 'popularity.desc');
                break;
            case 'bollywood':
                endpoint = '/discover/movie';
                params.append('with_original_language', 'hi');
                params.append('sort_by', 'popularity.desc');
                break;
            case 'korean':
                endpoint = '/discover/movie';
                params.append('with_original_language', 'ko');
                params.append('sort_by', 'popularity.desc');
                break;
            case 'dubbed':
                endpoint = '/discover/movie';
                params.append('with_original_language', 'hi');
                break;
            case 'series':
                endpoint = '/tv/popular';
                break;
            case 'action':
                endpoint = '/discover/movie';
                params.append('with_genres', '28');
                break;
            case 'drama':
                endpoint = '/discover/movie';
                params.append('with_genres', '18');
                break;
            case 'comedy':
                endpoint = '/discover/movie';
                params.append('with_genres', '35');
                break;
            case 'horror':
                endpoint = '/discover/movie';
                params.append('with_genres', '27');
                break;
            case 'romance':
                endpoint = '/discover/movie';
                params.append('with_genres', '10749');
                break;
            case 'thriller':
                endpoint = '/discover/movie';
                params.append('with_genres', '53');
                break;
            default:
                return getPopularMovies();
        }

        console.log(`Fetching ${category} movies from: ${TMDB_BASE_URL}${endpoint}?${params}`);
        const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${params}`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch ${category} movies`);
        }

        const data = await response.json();

        if (category === 'series') {
            return data.results.map(show => ({
                id: show.id,
                title: show.name,
                poster_path: show.poster_path,
                release_date: show.first_air_date,
                overview: show.overview,
                vote_average: show.vote_average,
                media_type: 'tv'
            }));
        }

        return data.results;
    } catch (error) {
        console.error('Error fetching movies by category:', error);
        throw error;
    }
};

// Function to search Watchmode movies
export const searchWatchmodeMovies = async (query) => {
    try {
        const response = await fetch(
            `${WATCHMODE_BASE_URL}/search/?apiKey=${WATCHMODE_API_KEY}&search_field=name&search_value=${encodeURIComponent(query)}&types=movie`
        );
        
        if (!response.ok) {
            throw new Error(`Watchmode API error: ${response.status}`);
        }

        const data = await response.json();
        return data.title_results?.filter(result => result.type === 'movie') || [];
    } catch (error) {
        console.error("Error searching Watchmode movies:", error);
        return [];
    }
};

// Function to get streaming availability
export const getStreamingAvailability = async (titleId) => {
    try {
        const response = await fetch(
            `${WATCHMODE_BASE_URL}/title/${titleId}/sources/?apiKey=${WATCHMODE_API_KEY}&regions=US`
        );

        if (!response.ok) {
            throw new Error(`Watchmode API error: ${response.status}`);
        }

        const data = await response.json();
        return data.map(source => ({
            ...source,
            type: normalizeSourceType(source.type),
            price: source.price ? parseFloat(source.price) : null,
            quality: source.format || null
        }));
    } catch (error) {
        console.error("Error getting streaming availability:", error);
        return [];
    }
};

// Helper function to normalize source types
function normalizeSourceType(type) {
    const typeMap = {
        'sub': 'subscription',
        'free': 'free',
        'rent': 'rent',
        'purchase': 'buy',
        'tv': 'subscription',
        'addon': 'subscription'
    };
    return typeMap[type.toLowerCase()] || 'other';
}
