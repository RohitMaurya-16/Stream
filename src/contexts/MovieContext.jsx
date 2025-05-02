import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Load favorites from localStorage when app starts
    useEffect(() => {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
        }
    }, []);

    // Save favorites to localStorage whenever favorites state changes
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Function to add a movie to favorites (Prevents duplicates)
    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            if (!prev.some((fav) => fav.id === movie.id)) {
                return [...prev, movie]; // Add only if not already in favorites
            }
            return prev;
        });
    };

    // Function to remove a movie from favorites
    const removeFromFavorites = (movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    // Function to check if a movie is in favorites
    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId);
    };

    // Provide state and functions to components
    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};
