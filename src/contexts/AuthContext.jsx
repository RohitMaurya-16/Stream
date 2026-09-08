import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authModalTab, setAuthModalTab] = useState('login'); // 'login' or 'signup'
    const isConfigured = isSupabaseConfigured();

    useEffect(() => {
        if (!isConfigured || !supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((err) => {
            console.error('Error getting initial session:', err);
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, [isConfigured]);

    const signIn = async ({ email, password }) => {
        if (!isConfigured || !supabase) {
            throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
        }
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const signUp = async ({ email, password, name, phone }) => {
        if (!isConfigured || !supabase) {
            throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    phone: phone
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        if (supabase) {
            const { error } = await supabase.auth.signOut();
            if (error) console.error('Error signing out:', error.message);
        }
        setUser(null);
        setSession(null);
    };

    const openAuthModal = (tab = 'login') => {
        setAuthModalTab(tab);
        setAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    const value = {
        user,
        session,
        loading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
