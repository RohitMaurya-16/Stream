import MovieCard from "../components/MovieCard";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Favorites.css";

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites.length > 0) {  // ✅ Fixed condition check
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movies-grid">
                    {favorites.map((movie) => (  // ✅ Corrected variable name
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-empty">
            <h2>No Favorite Movies Yet</h2>
            <p>Start adding movies to your favorites, and they will appear here...</p> {/* ✅ Fixed spelling */}
        </div>
    );
}

export default Favorites;
