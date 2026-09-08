import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/News.css';
import { getMovieNews } from '../services/news';

function News() {
    const { movieTitle } = useParams();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                const filteredNews = await getMovieNews(movieTitle);
                setNews(filteredNews);
            } catch (error) {
                console.error('News fetch error:', error);
                setError(error.message || 'Failed to fetch news');
            } finally {
                setLoading(false);
            }
        };

        if (movieTitle) {
            fetchNews();
        }
    }, [movieTitle]);

    if (loading) return (
        <div className="loading-container">
            <div className="loading">Loading news about {movieTitle}...</div>
        </div>
    );

    if (error) return (
        <div className="error-container">
            <div className="error">
                <h2>Error</h2>
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="news-page">
            <div className="news-header">
                <h1>Latest News about "{movieTitle}"</h1>
                <p className="news-subtitle">Find the most recent articles and reviews</p>
            </div>
            
            <div className="news-grid">
                {news.map((article, index) => (
                    <div key={index} className="news-card">
                        <div className="news-image">
                            <img 
                                src={article.urlToImage} 
                                alt={article.title}
                                onError={(e) => {
                                    e.target.src = '/placeholder-news.jpg';
                                }}
                            />
                        </div>
                        <div className="news-content">
                            <h2>{article.title}</h2>
                            <p className="news-source">
                                {article.source.name} · {new Date(article.publishedAt).toLocaleDateString()}
                            </p>
                            <p className="news-description">{article.description}</p>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="read-more"
                            >
                                Read Full Article
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            
            {news.length === 0 && (
                <div className="no-news">
                    <h2>No Recent News Found</h2>
                    <p>We couldn't find any recent news articles about "{movieTitle}"</p>
                </div>
            )}
        </div>
    );
}

export default News; 