import { useState, useEffect } from 'react';
import { getStreamingAvailability } from '../services/api';
import '../css/StreamingInfo.css';

function StreamingInfo({ titleId }) {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreamingSources = async () => {
            try {
                const data = await getStreamingAvailability(titleId);
                // Group sources by type (subscription, free, rent, buy)
                const groupedSources = data.reduce((acc, source) => {
                    if (!acc[source.type]) {
                        acc[source.type] = [];
                    }
                    acc[source.type].push(source);
                    return acc;
                }, {});
                setSources(groupedSources);
            } catch (error) {
                console.error('Error fetching streaming sources:', error);
            } finally {
                setLoading(false);
            }
        };

        if (titleId) {
            fetchStreamingSources();
        }
    }, [titleId]);

    if (loading) {
        return <div className="streaming-info-loading">Loading streaming info...</div>;
    }

    if (Object.keys(sources).length === 0) {
        return <div className="streaming-info-empty">No streaming information available</div>;
    }

    return (
        <div className="streaming-info">
            {Object.entries(sources).map(([type, platforms]) => (
                <div key={type} className="source-type">
                    <h4>{type.charAt(0).toUpperCase() + type.slice(1)}</h4>
                    <div className="platforms">
                        {platforms.map((platform) => (
                            <a
                                key={platform.source_id}
                                href={platform.web_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="platform"
                            >
                                <img 
                                    src={platform.logo_url} 
                                    alt={platform.name}
                                    className="platform-logo"
                                />
                                <span>{platform.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default StreamingInfo; 