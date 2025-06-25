import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = () => {
            const token = searchParams.get('token');
            const userParam = searchParams.get('user');
            const error = searchParams.get('error');

            console.log('AuthCallback received:', { token: !!token, userParam: !!userParam, error });

            if (error) {
                console.error('OAuth error:', error);
                toast.error('Authentication failed. Please try again.');
                navigate('/login');
                return;
            }

            if (token && userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    console.log('Parsed user data:', user);

                    // Store token and user data
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    // Dispatch custom event to trigger App.jsx re-render
                    window.dispatchEvent(new Event('authStateChanged'));

                    toast.success('Successfully signed in with Google!');
                    navigate('/');
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    toast.error('Authentication failed. Please try again.');
                    navigate('/login');
                }
            } else {
                console.error('Missing token or user data');
                toast.error('Authentication failed. Please try again.');
                navigate('/login');
            }
        };

        handleAuthCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">Completing authentication...</p>
            </div>
        </div>
    );
} 