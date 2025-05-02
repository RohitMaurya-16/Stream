import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/MovieInfoPage.css';

function MovieInfoPage() {
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const [movieDetails, setMovieDetails] = useState(null);
    const [error, setError] = useState(null);
    const [showStreamOptions, setShowStreamOptions] = useState(false);

    const handlePlayMovie = (streamingService, server = null, lang = null) => {
        let videoUrl;
        if (streamingService === 'vidsrc') {
            videoUrl = `https://vidsrc.xyz/embed/movie?imdb=${imdbID}${lang ? `&ds_lang=${lang}` : ''}`;
        } else if (streamingService === 'autoembed') {
            videoUrl = `https://player.autoembed.cc/embed/movie/${imdbID}${server ? `?server=${server}` : ''}`;
        }
        window.open(videoUrl, '_blank');
        setShowStreamOptions(false);
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const apiKey = "e4ba0188";
            const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.Response === "True") {
                    setMovieDetails(data);
                } else {
                    setError(data.Error);
                }
            } catch (error) {
                setError("Failed to fetch movie details");
            }
        };

        fetchMovieDetails();
    }, [imdbID]);

    if (error) return <div className="error">Error: {error}</div>;
    if (!movieDetails) return <div className="loading">Loading...</div>;

    return (
        <div className="movie-info-page">
            <div className="movie-info-content">
                <div className="movie-poster-section">
                    <img src={movieDetails.Poster} alt={`${movieDetails.Title} Poster`} />
                    <div className="movie-ratings">
                        {movieDetails.Ratings?.map((rating, index) => (
                            <div key={index} className="rating-item">
                                <span className="rating-source">{rating.Source}</span>
                                <span className="rating-value">{rating.Value}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="movie-details-section">
                    <h1>{movieDetails.Title} <span className="year">({movieDetails.Year})</span></h1>
                    
                    <div className="movie-meta">
                        <span className="rated">{movieDetails.Rated}</span>
                        <span className="runtime">{movieDetails.Runtime}</span>
                        <span className="release-date">{movieDetails.Released}</span>
                    </div>

                    <div className="genre-list">
                        {movieDetails.Genre?.split(', ').map((genre, index) => (
                            <span key={index} className="genre-tag">{genre}</span>
                        ))}
                    </div>

                    <div className="streaming-options">
                        <button className="play-button" onClick={() => setShowStreamOptions(!showStreamOptions)}>
                            <span className="play-icon">▶</span>
                            Play Movie
                        </button>
                        {showStreamOptions && (
                            <div className="stream-dropdown">
                                <button onClick={() => handlePlayMovie('vidsrc')}>
                                    Watch on VidSrc (English)
                                </button>
                                <button onClick={() => handlePlayMovie('vidsrc', null, 'de')}>
                                    Watch on VidSrc (German)
                                </button>
                                <button onClick={() => handlePlayMovie('autoembed')}>
                                    Watch on AutoEmbed (Server 1)
                                </button>
                                <button onClick={() => handlePlayMovie('autoembed', 2)}>
                                    Watch on AutoEmbed (Server 2)
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="plot-section">
                        <h2>Plot</h2>
                        <p>{movieDetails.Plot}</p>
                    </div>

                    <div className="crew-section">
                        <div className="crew-item">
                            <h3>Director</h3>
                            <p>{movieDetails.Director}</p>
                        </div>
                        <div className="crew-item">
                            <h3>Writers</h3>
                            <p>{movieDetails.Writer}</p>
                        </div>
                        <div className="crew-item">
                            <h3>Stars</h3>
                            <p>{movieDetails.Actors}</p>
                        </div>
                    </div>

                    <div className="additional-info">
                        <div className="info-row">
                            <span className="info-label">Box Office</span>
                            <span className="info-value">{movieDetails.BoxOffice || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Awards</span>
                            <span className="info-value">{movieDetails.Awards || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Production</span>
                            <span className="info-value">{movieDetails.Production || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Country</span>
                            <span className="info-value">{movieDetails.Country}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Language</span>
                            <span className="info-value">{movieDetails.Language}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieInfoPage;
