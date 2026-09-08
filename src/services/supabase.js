import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

const rawUrl = CONFIG.SUPABASE.URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = CONFIG.SUPABASE.ANON_KEY || '';

export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));
};

// Create a single supabase client for interacting with database & auth
export const supabase = isSupabaseConfigured()
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Fetch favorite movies for a specific user from Supabase database
 * Enforces user-isolation through RLS and explicit user_id filter
 */
export const fetchUserFavoritesFromDb = async (userId) => {
    if (!supabase || !userId) return [];

    try {
        const { data, error } = await supabase
            .from('user_favorites')
            .select('movie_data')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching favorites from Supabase:', error.message);
            return [];
        }

        return (data || []).map(row => row.movie_data);
    } catch (err) {
        console.error('Unexpected error fetching user favorites:', err);
        return [];
    }
};

/**
 * Save a movie to user's favorites in Supabase database
 */
export const addUserFavoriteToDb = async (userId, movie) => {
    if (!supabase || !userId || !movie) return false;

    try {
        const { error } = await supabase
            .from('user_favorites')
            .upsert({
                user_id: userId,
                movie_id: String(movie.id),
                movie_data: movie,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,movie_id'
            });

        if (error) {
            console.error('Error adding favorite to Supabase:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error adding favorite:', err);
        return false;
    }
};

/**
 * Remove a movie from user's favorites in Supabase database
 */
export const removeUserFavoriteFromDb = async (userId, movieId) => {
    if (!supabase || !userId || !movieId) return false;

    try {
        const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', userId)
            .eq('movie_id', String(movieId));

        if (error) {
            console.error('Error removing favorite from Supabase:', error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Unexpected error removing favorite:', err);
        return false;
    }
};
