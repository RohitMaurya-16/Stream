import { useState } from 'react';
import '../css/AuthModal.css';

function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [countryCode, setCountryCode] = useState('+91');
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        name: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p>Start your 7-day free trial of Stream Sense Primus</p>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button 
                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="phone-input">
                            <select 
                                value={countryCode} 
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="country-code"
                            >
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+61">🇦🇺 +61</option>
                                <option value="+86">🇨🇳 +86</option>
                                <option value="+81">🇯🇵 +81</option>
                            </select>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={isLogin ? "Enter password" : "Create password"}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-btn">
                        {isLogin ? 'Login' : 'Create Account & Start Trial'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? 
                            "Don't have an account? " : 
                            "Already have an account? "}
                        <button 
                            className="switch-btn"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthModal; 