import { useState } from 'react';
import '../css/Subscription.css';
import AuthModal from '../components/AuthModal';

function Subscription() {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="subscription-page">
            <div className="hero-section">
                <h1>Stream Sense Primus</h1>
                <p className="hero-subtitle">Unlock the Ultimate Streaming Experience</p>
            </div>

            <div className="subscription-content">
                <div className="features-section">
                    <h2>🎟️ Exclusive Premium Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="feature-icon">🎭</span>
                            <h3>Ad-free Experience</h3>
                            <p>Enjoy uninterrupted streaming with zero ads</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">🤖</span>
                            <h3>AI-Powered Picks</h3>
                            <p>Ultra-personalized recommendations just for you</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">⭐</span>
                            <h3>Early Access</h3>
                            <p>Watch premium content before everyone else</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">4K</span>
                            <h3>Ultra HD Streaming</h3>
                            <p>Experience movies in stunning 4K quality</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">📱</span>
                            <h3>Cross-platform Access</h3>
                            <p>Sync across all your devices seamlessly</p>
                        </div>
                        <div className="feature-card">
                            <span className="feature-icon">💰</span>
                            <h3>Rental Discounts</h3>
                            <p>Save up to 50% on trending movies</p>
                        </div>
                    </div>
                </div>

                <div className="pricing-section">
                    <h2>💰 Choose Your Plan</h2>
                    <div className="pricing-cards">
                        <div 
                            className={`pricing-card ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('monthly')}
                        >
                            <h3>Monthly Plan</h3>
                            <div className="price">
                                <span className="amount">₹829</span>
                                <span className="period">/month</span>
                            </div>
                            <button className="select-plan-btn" onClick={() => setShowAuthModal(true)}>
                                Select Plan
                            </button>
                        </div>
                        <div 
                            className={`pricing-card popular ${selectedPlan === 'annual' ? 'selected' : ''}`}
                            onClick={() => setSelectedPlan('annual')}
                        >
                            <div className="popular-badge">BEST DEAL</div>
                            <h3>Annual Plan</h3>
                            <div className="price">
                                <span className="amount">₹7,469</span>
                                <span className="period">/year</span>
                            </div>
                            <div className="savings">Save 25%</div>
                            <button className="select-plan-btn" onClick={() => setShowAuthModal(true)}>
                                Select Plan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="trial-section">
                    <div className="trial-content">
                        <h2>🎯 Start Your Free Trial</h2>
                        <p>Try all premium features risk-free for 7 days</p>
                        <button 
                            className="cta-button"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Start Free Trial Now
                            <span className="arrow">→</span>
                        </button>
                    </div>
                </div>

                <div className="guarantee-section">
                    <div className="guarantee-item">
                        <span className="guarantee-icon">✨</span>
                        <h3>No Commitment</h3>
                        <p>Cancel anytime, no questions asked</p>
                    </div>
                    <div className="guarantee-item">
                        <span className="guarantee-icon">🔒</span>
                        <h3>Secure Payment</h3>
                        <p>Your data is always protected</p>
                    </div>
                    <div className="guarantee-item">
                        <span className="guarantee-icon">💫</span>
                        <h3>Premium Support</h3>
                        <p>24/7 dedicated assistance</p>
                    </div>
                </div>
            </div>

            <AuthModal 
                isOpen={showAuthModal} 
                onClose={() => setShowAuthModal(false)} 
            />
        </div>
    );
}

export default Subscription; 