import React, { useState, useEffect } from 'react';
import '../css/PersonDetails.css';

const TMDB_API_KEY = "1e58a98830bc8b3f646072c2d4963c7f";

function PersonDetails({ personId, onClose }) {
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.themoviedb.org/3/person/${personId}?` +
                    `api_key=${TMDB_API_KEY}&append_to_response=credits,images`
                );
                const data = await response.json();
                
                if (response.ok) {
                    setPerson(data);
                } else {
                    throw new Error(data.status_message || 'Failed to fetch person details');
                }
            } catch (error) {
                console.error('Error fetching person details:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (personId) {
            fetchPersonDetails();
        }
    }, [personId]);

    if (loading) {
        return (
            <div className="person-modal">
                <div className="person-content loading">
                    <div className="loading-spinner">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="person-modal">
                <div className="person-content error">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    }

    if (!person) return null;

    return (
        <div className="person-modal" onClick={onClose}>
            <div className="person-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                
                <div className="person-header">
                    {person.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                            alt={person.name}
                            className="person-image"
                        />
                    )}
                    <div className="person-info">
                        <h2>{person.name}</h2>
                        {person.birthday && (
                            <p className="birth-info">
                                Born: {new Date(person.birthday).toLocaleDateString()}
                                {person.place_of_birth && ` in ${person.place_of_birth}`}
                            </p>
                        )}
                        {person.deathday && (
                            <p className="death-info">
                                Died: {new Date(person.deathday).toLocaleDateString()}
                            </p>
                        )}
                        <p className="department">Known for: {person.known_for_department}</p>
                    </div>
                </div>

                {person.biography && (
                    <div className="biography">
                        <h3>Biography</h3>
                        <p>{person.biography}</p>
                    </div>
                )}

                {person.credits && person.credits.cast && person.credits.cast.length > 0 && (
                    <div className="known-for">
                        <h3>Known For</h3>
                        <div className="movies-grid">
                            {person.credits.cast
                                .sort((a, b) => b.popularity - a.popularity)
                                .slice(0, 6)
                                .map(movie => (
                                    <div key={movie.id} className="movie-item">
                                        {movie.poster_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                alt={movie.title}
                                            />
                                        ) : (
                                            <div className="no-poster">No Poster</div>
                                        )}
                                        <p className="movie-title">{movie.title}</p>
                                        <p className="character">{movie.character}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PersonDetails; 