import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails, getMovieTrailer, getMovieSongs, getMovieCredits } from "../services/api";
import PersonDetails from "../components/PersonDetails";
import "../css/MovieDetails.css";

function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [credits, setCredits] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPerson, setSelectedPerson] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [movieData, creditsData, trailerData, songsData] = await Promise.all([
                    getMovieDetails(id),
                    getMovieCredits(id),
                    getMovieTrailer(id),
                    getMovieSongs(movie?.title)
                ]);

                setMovie(movieData);
                setCredits(creditsData);
                setTrailer(trailerData);
                setSongs(songsData?.items || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handlePersonClick = (personId) => {
        setSelectedPerson(personId);
    };

    const handleClosePersonDetails = () => {
        setSelectedPerson(null);
    };

    const handleInfoClick = () => {
        console.log("Info Click - IMDB ID:", movie?.imdb_id); // Debug log
        if (movie?.imdb_id) {
            navigate(`/info/${movie.imdb_id}`);
        }
    };

    const handleNewsClick = () => {
        console.log("News Click - Title:", movie?.title); // Debug log
        if (movie?.title) {
            navigate(`/news/${encodeURIComponent(movie.title)}`);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const director = credits?.crew?.find(person => person.job === "Director");
    const writers = credits?.crew?.filter(person => 
        person.department === "Writing" || 
        person.job === "Screenplay" || 
        person.job === "Writer"
    );
    const mainCast = credits?.cast?.slice(0, 5);

    return (
        <div className="movie-details">
            <div className="movie-info">
                {movie?.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                    />
                )}
                <div className="movie-text">
                    <h1>{movie?.title}</h1>
                    <p className="release-date">
                        Release Date: {movie?.release_date || "N/A"}
                    </p>
                    
                    {director && (
                        <div className="crew-section">
                            <span className="crew-label">Director: </span>
                            <button 
                                className="person-link"
                                onClick={() => handlePersonClick(director.id)}
                            >
                                {director.name}
                            </button>
                        </div>
                    )}

                    {writers && writers.length > 0 && (
                        <div className="crew-section">
                            <span className="crew-label">Writers: </span>
                            {writers.map((writer, index) => (
                                <span key={writer.id}>
                                    <button 
                                        className="person-link"
                                        onClick={() => handlePersonClick(writer.id)}
                                    >
                                        {writer.name}
                                    </button>
                                    {index < writers.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </div>
                    )}

                    {mainCast && mainCast.length > 0 && (
                        <div className="crew-section">
                            <span className="crew-label">Stars: </span>
                            {mainCast.map((actor, index) => (
                                <span key={actor.id}>
                                    <button 
                                        className="person-link"
                                        onClick={() => handlePersonClick(actor.id)}
                                    >
                                        {actor.name}
                                    </button>
                                    {index < mainCast.length - 1 ? ", " : ""}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="actions-wrapper">
                        <div className="button-container">
                            <button 
                                type="button"
                                className="action-button info-btn" 
                                onClick={handleInfoClick}
                            >
                                More Info
                            </button>
                            <button 
                                type="button"
                                className="action-button news-btn" 
                                onClick={handleNewsClick}
                            >
                                News
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {trailer && (
                <div className="trailer-section">
                    <h2>Trailer</h2>
                    <div className="trailer-container">
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {songs.length > 0 && (
                <div className="songs-section">
                    <h2>Related Songs</h2>
                    <div className="songs-list">
                        {songs.map((song) => (
                            <div key={song.id.videoId} className="song-item">
                                <iframe
                                    width="280"
                                    height="157"
                                    src={`https://www.youtube.com/embed/${song.id.videoId}`}
                                    title={song.snippet.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                                <p className="song-title">{song.snippet.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedPerson && (
                <PersonDetails 
                    personId={selectedPerson} 
                    onClose={handleClosePersonDetails}
                />
            )}
        </div>
    );
}

export default MovieDetails;
