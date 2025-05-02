import { useState, useEffect, useRef } from 'react';
import { getStreamingAvailability } from '../services/api';
import '../css/StreamingModal.css';

function StreamingModal({ movieTitle, titleId, onClose }) {
    const modalRef = useRef(null);
    const [sources, setSources] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreamingSources = async () => {
            try {
                const data = await getStreamingAvailability(titleId);
                console.log('Streaming data:', data);
                
                if (!data || data.length === 0) {
                    setSources({});
                    return;
                }

                // Group sources by type and sort by price
                const grouped = data.reduce((acc, source) => {
                    const type = source.type || 'other';
                    if (!acc[type]) {
                        acc[type] = [];
                    }
                    acc[type].push(source);
                    return acc;
                }, {});

                // Sort each category by price if available
                Object.keys(grouped).forEach(type => {
                    grouped[type].sort((a, b) => (a.price || 0) - (b.price || 0));
                });

                setSources(grouped);
            } catch (error) {
                console.error('Error fetching streaming sources:', error);
                setSources({});
            } finally {
                setLoading(false);
            }
        };

        if (titleId) {
            fetchStreamingSources();
        }

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [titleId, onClose]);

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const categoryIcons = {
        subscription: '🎬',
        free: '🆓',
        rent: '💰',
        buy: '🛒',
        other: '📺'
    };

    const categoryTitles = {
        subscription: 'Streaming Services',
        free: 'Free to Watch',
        rent: 'Rent Digital Copy',
        buy: 'Buy Digital Copy',
        other: 'Other Services'
    };

    const categoryDescriptions = {
        subscription: 'Watch with your subscription',
        free: 'Available to stream for free',
        rent: 'Rent and watch within 48 hours',
        buy: 'Purchase and own forever',
        other: 'Additional viewing options'
    };

    return (
        <div className="streaming-modal-overlay" onClick={handleOutsideClick}>
            <div className="streaming-modal" ref={modalRef}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                <h2 className="modal-title">
                    <span className="movie-title">{movieTitle}</span>
                    <span className="subtitle">Where to Watch</span>
                </h2>

                {loading ? (
                    <div className="modal-loading">
                        <div className="loader"></div>
                        <p>Finding the best streaming options...</p>
                    </div>
                ) : Object.keys(sources).length === 0 ? (
                    <div className="no-sources">
                        <span className="no-sources-icon">🔍</span>
                        <p>No streaming options available</p>
                        <p className="no-sources-subtitle">
                            We couldn't find any current streaming services offering this title.
                            Check back later as availability often changes.
                        </p>
                    </div>
                ) : (
                    <div className="streaming-categories">
                        {Object.entries(sources).map(([type, platforms]) => (
                            <div key={type} className="category-section">
                                <h3>
                                    <span className="category-icon">{categoryIcons[type]}</span>
                                    {categoryTitles[type]}
                                </h3>
                                <p className="category-description">{categoryDescriptions[type]}</p>
                                <div className="platforms-grid">
                                    {platforms.map((platform) => (
                                        <a
                                            key={platform.source_id}
                                            href={platform.web_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="platform-card"
                                        >
                                            <div className="platform-logo-container">
                                                <img
                                                    src={platform.logo_url || `https://logo.clearbit.com/${platform.name.toLowerCase().replace(/\s+/g, '')}.com`}
                                                    alt={platform.name}
                                                    className="platform-logo"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/100x60/f8fafc/64748b?text=' + platform.name.charAt(0);
                                                    }}
                                                />
                                            </div>
                                            <div className="platform-info">
                                                <span className="platform-name">{platform.name}</span>
                                                {platform.price && (
                                                    <span className="platform-price">
                                                        ${platform.price.toFixed(2)}
                                                    </span>
                                                )}
                                                {platform.quality && (
                                                    <span className="platform-quality">
                                                        {platform.quality}
                                                    </span>
                                                )}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StreamingModal; 