'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StrapiUserFullType, LoginRequest, LoginResponse, MeResponse, ApiError } from '@/types';

interface AuthContextType {
    user: StrapiUserFullType | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<StrapiUserFullType | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    useEffect(() => {
        // Check for existing token in localStorage on mount
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('auth_token');
            if (savedToken) {
                setToken(savedToken);
                fetchUserProfile(savedToken);
            } else {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUserProfile = async (authToken: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }

            const data: MeResponse = await response.json();
            setUser(data.data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // Clear invalid token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                // Clear cookie
                document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            }
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        try {

            const response = await fetch(`${BACKEND_URL}/api/v1/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });


            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data: LoginResponse = await response.json();
            const authToken = data.data.jwt;

            // Save token to localStorage and cookie
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', authToken);
                // Set cookie with proper attributes for middleware
                document.cookie = `auth_token=${authToken}; path=/; max-age=86400; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
            }
            setToken(authToken);

            // Fetch user profile
            await fetchUserProfile(authToken);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            // Clear cookie
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isLoading,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
