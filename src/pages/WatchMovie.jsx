import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/WatchMovie.css';

function WatchMovie() {
    const { imdbID } = useParams();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="watch-movie-container">
            <button className="back-button" onClick={handleBack}>
                ← Back to Details
            </button>
            <div className="video-wrapper">
                <iframe
                    className="video-player"
                    src={`https://vidsrc.xyz/embed/movie/${imdbID}`}
                    allowFullScreen
                    frameBorder="0"
                    title="Movie Player"
                ></iframe>
            </div>
        </div>
    );
}

export default WatchMovie; 