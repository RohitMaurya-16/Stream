// Centralized configuration for all external APIs and services
// All sensitive keys are read strictly from environment variables (.env)

const getEnv = (key, name) => {
    const val = import.meta.env[key] || "";
    if (!val && import.meta.env.DEV) {
        console.warn(`[Config] Environment variable ${key} (${name}) is not set.`);
    }
    return val;
};

export const CONFIG = {
    TMDB: {
        API_KEY: getEnv("VITE_TMDB_API_KEY", "TMDB API Key"),
        BASE_URL: "https://api.themoviedb.org/3",
        IMAGE_BASE_URL: "https://image.tmdb.org/t/p"
    },
    YOUTUBE: {
        API_KEY: getEnv("VITE_YOUTUBE_API_KEY", "YouTube API Key"),
        BASE_URL: "https://www.googleapis.com/youtube/v3"
    },
    WATCHMODE: {
        API_KEY: getEnv("VITE_WATCHMODE_API_KEY", "Watchmode API Key"),
        BASE_URL: "https://api.watchmode.com/v1"
    },
    OMDB: {
        API_KEY: getEnv("VITE_OMDB_API_KEY", "OMDb API Key"),
        BASE_URL: "https://www.omdbapi.com"
    },
    NEWS: {
        API_KEY: getEnv("VITE_NEWS_API_KEY", "NewsAPI Key"),
        BASE_URL: "https://newsapi.org/v2"
    },
    SUPABASE: {
        URL: import.meta.env.VITE_SUPABASE_URL || "",
        ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ""
    }
};

export default CONFIG;
