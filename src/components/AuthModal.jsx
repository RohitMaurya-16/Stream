import { useState, useEffect } from 'react';
import '../css/AuthModal.css';
import { useAuth } from '../contexts/AuthContext';

function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
    const { signIn, signUp, isConfigured } = useAuth();
    const [isLogin, setIsLogin] = useState(initialTab === 'login');
    const [countryCode, setCountryCode] = useState('+91');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        name: ''
    });

    useEffect(() => {
        setIsLogin(initialTab === 'login');
        setError(null);
        setSuccessMessage(null);
    }, [initialTab, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (isLogin) {
                await signIn({
                    email: formData.email.trim(),
                    password: formData.password
                });
                setSuccessMessage('Logged in successfully!');
                setTimeout(() => {
                    onClose();
                    setFormData({ email: '', phone: '', password: '', name: '' });
                }, 700);
            } else {
                await signUp({
                    email: formData.email.trim(),
                    password: formData.password,
                    name: formData.name.trim(),
                    phone: formData.phone ? `${countryCode} ${formData.phone.trim()}` : ''
                });
                setSuccessMessage('Account created! You can now log in.');
                setTimeout(() => {
                    setIsLogin(true);
                }, 1200);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose} aria-label="Close">&times;</button>
                
                <div className="auth-header">
                    <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Sign in to access your personal movie favorites' : 'Sign up to sync your favorites across all devices'}</p>
                </div>

                {!isConfigured && (
                    <div className="auth-alert auth-alert-warning">
                        ⚠️ Supabase credentials not yet set in <code>.env</code>. Add your <code>VITE_SUPABASE_URL</code> & <code>VITE_SUPABASE_ANON_KEY</code> to enable live authentication.
                    </div>
                )}

                {error && (
                    <div className="auth-alert auth-alert-error">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="auth-alert auth-alert-success">
                        {successMessage}
                    </div>
                )}

                <div className="auth-tabs">
                    <button 
                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(null); }}
                        type="button"
                    >
                        Login
                    </button>
                    <button 
                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(null); }}
                        type="button"
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

                    {!isLogin && (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="phone-input">
                                <select 
                                    value={countryCode} 
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="country-code"
                                >
                                    <option value="+91">???? +91</option>
                                    <option value="+1">???? +1</option>
                                    <option value="+44">???? +44</option>
                                    <option value="+61">???? +61</option>
                                    <option value="+86">???? +86</option>
                                    <option value="+81">???? +81</option>
                                </select>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter phone number"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder={isLogin ? "Enter password" : "Create password (min 6 characters)"}
                            required
                            minLength={6}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? 
                            "Don't have an account? " : 
                            "Already have an account? "}
                        <button 
                            type="button"
                            className="switch-btn"
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
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
