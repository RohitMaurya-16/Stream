import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { getMoviesByCategory } from "../services/api";
import "../css/Recommendations.css";

function Recommendations() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', name: 'All Movies', icon: '🎬' },
        { id: 'hollywood', name: 'Hollywood', icon: '🌟' },
        { id: 'bollywood', name: 'Bollywood', icon: '🎭' },
        { id: 'korean', name: 'Korean', icon: '🌸' },
        { id: 'dubbed', name: 'Hindi Dubbed', icon: '🎤' },
        { id: 'series', name: 'Web Series', icon: '📺' },
        { id: 'action', name: 'Action', icon: '💥' },
        { id: 'drama', name: 'Drama', icon: '🎭' },
        { id: 'comedy', name: 'Comedy', icon: '😄' },
        { id: 'horror', name: 'Horror', icon: '👻' },
        { id: 'romance', name: 'Romance', icon: '❤️' },
        { id: 'thriller', name: 'Thriller', icon: '🔍' }
    ];

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Fetching movies for category:', activeCategory);
                const data = await getMoviesByCategory(activeCategory);
                console.log('Received movies:', data);
                if (Array.isArray(data)) {
                    setMovies(data);
                } else {
                    console.error('Received invalid data format:', data);
                    setError('Received invalid data from the server');
                }
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError(`Failed to load ${activeCategory} movies. Please try again later.`);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [activeCategory]);

    const handleCategoryChange = (categoryId) => {
        console.log('Changing category to:', categoryId);
        setActiveCategory(categoryId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (error) {
        return (
            <div className="recommendations">
                <div className="categories-section">
                    <h2>Browse by Category</h2>
                    <div className="categories-nav">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category.id)}
                                disabled={loading}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                    <button 
                        className="retry-button"
                        onClick={() => handleCategoryChange(activeCategory)}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recommendations">
            <div className="categories-section">
                <h2>Browse by Category</h2>
                <div className="categories-nav">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category.id)}
                            disabled={loading}
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                            {loading && activeCategory === category.id && (
                                <span className="category-loading"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="content-section">
                <h3 className="section-title">
                    <span className="category-icon">
                        {categories.find(c => c.id === activeCategory)?.icon}
                    </span>
                    {categories.find(c => c.id === activeCategory)?.name || 'All Movies'}
                    {loading && <span className="loading-dot">...</span>}
                </h3>
                <div className="movies-grid">
                    {loading ? (
                        Array(12).fill(0).map((_, index) => (
                            <div key={index} className="movie-card-skeleton">
                                <div className="skeleton-poster"></div>
                                <div className="skeleton-info">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-date"></div>
                                </div>
                            </div>
                        ))
                    ) : movies.length > 0 ? (
                        movies.map((movie) => (
                            <MovieCard 
                                key={movie.id} 
                                movie={movie}
                                mediaType={movie.media_type || 'movie'}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <p>No movies found in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Recommendations; 