import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
    name: z.string().min(2, 'Name is required').optional(),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function AuthForm({ mode = 'login' }) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');
        try {
            const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });
            const result = await res.json();
            if (!res.ok) {
                setServerError(result.message || 'Something went wrong');
                toast.error(result.message || 'Something went wrong');
            } else {
                toast.success(mode === 'register' ? 'Registration successful!' : 'Login successful!');
                // Redirect or update UI as needed
            }
        } catch (err) {
            setServerError('Network error');
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="max-w-md mx-auto bg-white/90 rounded-xl shadow-lg p-8 mt-12 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                {mode === 'register' ? 'Create an Account' : 'Sign In'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {mode === 'register' && (
                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: mode === 'register' })}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Your Name"
                            autoComplete="name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                )}
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Password"
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                {serverError && <div className="text-red-600 text-center text-sm">{serverError}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (mode === 'register' ? 'Registering...' : 'Signing in...') : (mode === 'register' ? 'Register' : 'Sign In')}
                </Button>
            </form>
            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-300" />
            </div>
            <Button onClick={handleGoogle} variant="outline" className="w-full flex items-center justify-center gap-2 bg-white border-gray-300 hover:bg-gray-50">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
            </Button>
            <div className="mt-6 text-center">
                {mode === 'login' ? (
                    <span className="text-gray-700">Don't have an account?{' '}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => navigate('/register')}
                        >
                            Sign up
                        </button>
                    </span>
                ) : (
                    <span className="text-gray-700">Already have an account?{' '}
                        <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium"
                            onClick={() => navigate('/login')}
                        >
                            Sign in
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
} 