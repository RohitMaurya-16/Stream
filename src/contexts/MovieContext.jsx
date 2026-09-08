import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
    fetchUserFavoritesFromDb,
    addUserFavoriteToDb,
    removeUserFavoriteFromDb,
    isSupabaseConfigured
} from "../services/supabase";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const { user, openAuthModal } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    // Sync favorites when user logs in or out
    useEffect(() => {
        let isMounted = true;

        const loadFavorites = async () => {
            if (user && isSupabaseConfigured()) {
                setLoadingFavorites(true);
                try {
                    const userFavs = await fetchUserFavoritesFromDb(user.id);
                    if (isMounted) {
                        setFavorites(userFavs || []);
                    }
                } catch (err) {
                    console.error("Failed to load user favorites:", err);
                } finally {
                    if (isMounted) {
                        setLoadingFavorites(false);
                    }
                }
            } else if (user) {
                // Fallback to user-scoped localStorage if Supabase is not yet configured with keys
                const stored = localStorage.getItem(`favorites_${user.id}`);
                setFavorites(stored ? JSON.parse(stored) : []);
                setLoadingFavorites(false);
            } else {
                // When logged out, clear user favorites to ensure user privacy
                setFavorites([]);
                setLoadingFavorites(false);
            }
        };

        loadFavorites();

        return () => {
            isMounted = false;
        };
    }, [user]);

    // Function to add a movie to favorites
    const addToFavorites = async (movie) => {
        if (!user) {
            // Prompt user to log in so their favorites can be saved to their account
            openAuthModal('login');
            return;
        }

        // Optimistic update
        setFavorites((prev) => {
            if (!prev.some((fav) => String(fav.id) === String(movie.id))) {
                return [...prev, movie];
            }
            return prev;
        });

        if (isSupabaseConfigured()) {
            await addUserFavoriteToDb(user.id, movie);
        } else {
            const current = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
            if (!current.some((fav) => String(fav.id) === String(movie.id))) {
                localStorage.setItem(`favorites_${user.id}`, JSON.stringify([...current, movie]));
            }
        }
    };

    // Function to remove a movie from favorites
    const removeFromFavorites = async (movieId) => {
        if (!user) return;

        // Optimistic update
        setFavorites((prev) => prev.filter((movie) => String(movie.id) !== String(movieId)));

        if (isSupabaseConfigured()) {
            await removeUserFavoriteFromDb(user.id, movieId);
        } else {
            const current = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || "[]");
            const updated = current.filter((m) => String(m.id) !== String(movieId));
            localStorage.setItem(`favorites_${user.id}`, JSON.stringify(updated));
        }
    };

    // Function to check if a movie is in favorites
    const isFavorite = (movieId) => {
        return favorites.some((movie) => String(movie.id) === String(movieId));
    };

    const value = {
        favorites,
        loadingFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
