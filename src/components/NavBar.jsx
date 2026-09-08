import { Link } from "react-router-dom";
import "../css/Navbar.css";
import DarkModeToggle from "./DarkModeToggle";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
    const { user, signOut, openAuthModal } = useAuth();

    // Extract user display name or email prefix
    const displayName = user?.user_metadata?.full_name 
        || user?.user_metadata?.name 
        || user?.email?.split('@')[0] 
        || "User";

    const initial = displayName.charAt(0).toUpperCase();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <span className="brand-text-stream">𝕾𝖙𝖗𝖊𝖆𝖒</span>
                <span className="brand-text-sense">𝕾𝖊𝖓𝖘𝖊</span>
            </Link>
            <div className="navbar-links">
                <Link to="/" className="nav-link">
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                    <div className="nav-link-glow"></div>
                </Link>
                <Link to="/recommendations" className="nav-link">
                    <span className="nav-icon">🎯</span>
                    <span className="nav-text">Pick</span>
                    <div className="nav-link-glow"></div>
                </Link>
                <Link to="/favorites" className="nav-link">
                    <span className="nav-icon">❤️</span>
                    <span className="nav-text">Favorites</span>
                    <div className="nav-link-glow"></div>
                </Link>
                <Link to="/subscriptions" className="nav-link">
                    <span className="nav-icon">🔔</span>
                    <span className="nav-text">Subscription</span>
                    <div className="nav-link-glow"></div>
                </Link>
            </div>
            <div className="navbar-actions">
                <DarkModeToggle />
                {user ? (
                    <div className="user-profile-badge">
                        <div className="user-avatar-circle" title={user.email}>{initial}</div>
                        <span className="user-display-name" title={user.email}>{displayName}</span>
                        <button 
                            type="button" 
                            className="signout-button" 
                            onClick={signOut}
                            title="Sign out of your account"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <button 
                        type="button" 
                        className="signin-button" 
                        onClick={() => openAuthModal('login')}
                    >
                        Sign In
                    </button>
                )}
            </div>
        </nav>
    );
}

export default NavBar;