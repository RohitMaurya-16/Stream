import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
import { searchWatchmodeMovies } from "../services/api";
import StreamingModal from "./StreamingModal";

function MovieCard({ movie }) {
    const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
    const favorite = isFavorite(movie.id);
    const [showModal, setShowModal] = useState(false);
    const [watchmodeId, setWatchmodeId] = useState(null);
    const [loading, setLoading] = useState(false);

    function onFavoriteClick(e) {
        e.preventDefault();
        if (favorite) {
            removeFromFavorites(movie.id);
        } else {
            addToFavorites(movie);
        }
    }

    const handleRottenTomatoesClick = (e) => {
        e.preventDefault();
        const searchQuery = encodeURIComponent(`${movie.title} ${movie.release_date?.split('-')[0] || ''}`);
        window.open(`https://www.rottentomatoes.com/search?search=${searchQuery}`, '_blank');
    };

    async function handleStreamingClick(e) {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (!watchmodeId) {
                const results = await searchWatchmodeMovies(movie.title);
                if (results.length > 0) {
                    setWatchmodeId(results[0].id);
                }
            }
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching streaming info:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="movie-card-container">
                <Link to={`/movies/${movie.id}`} className="movie-card">
                    <div className="movie-poster">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="movie-overlay">
                            <div className="button-group">
                                <button
                                    className={`favorite-btn ${favorite ? "active" : ""}`}
                                    onClick={onFavoriteClick}
                                    title={favorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {favorite ? "💖" : "♡"}
                                </button>
                                <button
                                    className="rt-btn"
                                    onClick={handleRottenTomatoesClick}
                                    title="View on Rotten Tomatoes"
                                >
                                    🍅
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="movie-info">
                        <h3>{movie.title}</h3>
                        <p>{movie.release_date}</p>
                    </div>
                </Link>
                <button 
                    className={`streaming-btn ${loading ? "loading" : ""}`}
                    onClick={handleStreamingClick}
                    disabled={loading}
                >
                    {loading ? "" : "Where to Watch"}
                </button>
            </div>
            {showModal && watchmodeId && (
                <StreamingModal
                    movieTitle={movie.title}
                    titleId={watchmodeId}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

export default MovieCard;
