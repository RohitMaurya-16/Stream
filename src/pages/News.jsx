import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/News.css';

const NEWS_API_KEY = "2bfdac5a73b846c6823a68065d3d902b";

function News() {
    const { movieTitle } = useParams();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setLoading(true);
                // Construct a more focused search query
                const searchQuery = `"${movieTitle}" AND (movie OR film OR cinema OR review OR premiere)`;
                
                const response = await fetch(
                    `https://newsapi.org/v2/everything?` + 
                    `q=${encodeURIComponent(searchQuery)}` +
                    `&apiKey=${NEWS_API_KEY}` +
                    `&language=en` +
                    `&sortBy=publishedAt` +
                    `&pageSize=12` +
                    `&searchIn=title,description`
                );
                
                const data = await response.json();
                
                if (data.status === 'ok' && data.articles) {
                    // Filter and process the articles
                    const filteredNews = data.articles
                        .filter(article => (
                            article.urlToImage && 
                            article.title && 
                            article.description &&
                            !article.title.includes('[Removed]')
                        ))
                        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                        .slice(0, 12);
                    
                    setNews(filteredNews);
                } else {
                    throw new Error(data.message || 'Failed to fetch news');
                }
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