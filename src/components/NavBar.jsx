import { Link } from "react-router-dom";

import "../css/Navbar.css"
import DarkModeToggle from "./DarkModeToggle";

function NavBar() {
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
   
</div>

        </nav>
    );
}

export default NavBar;   