import "./css/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import MovieInfoPage from "./pages/MovieInfoPage";
import News from "./pages/News";
import Subscription from "./pages/Subscription";
import Recommendations from "./pages/Recommendations";
import NavBar from "./components/NavBar";
import AuthModal from "./components/AuthModal";
import { MovieProvider } from "./contexts/MovieContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
    const { authModalOpen, authModalTab, closeAuthModal } = useAuth();

    return (
        <MovieProvider>
            <div className="app">
                <NavBar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/subscriptions" element={<Subscription />} />
                        <Route path="/movies/:id" element={<MovieDetails />} />
                        <Route path="/info/:imdbID" element={<MovieInfoPage />} />
                        <Route path="/news/:movieTitle" element={<News />} />
                    </Routes>
                </main>
                <AuthModal
                    isOpen={authModalOpen}
                    onClose={closeAuthModal}
                    initialTab={authModalTab}
                />
            </div>
        </MovieProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
