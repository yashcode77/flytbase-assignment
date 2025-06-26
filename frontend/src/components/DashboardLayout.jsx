import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, LayoutDashboard, ListChecks, BarChart, Drone, Moon, Sun } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Missions', path: '/missions', icon: <ListChecks size={20} /> },
    { label: 'Reports', path: '/reports', icon: <BarChart size={20} /> },
    { label: 'Drone Fleet', path: '/drones', icon: <Drone size={20} /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart size={20} /> },
];

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Dispatch custom event to trigger App.jsx re-render
        window.dispatchEvent(new Event('authStateChanged'));

        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between flex-shrink-0">
                <div>
                    <div className="h-16 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">FlytBase</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle dark mode"
                            onClick={() => setDarkMode((d) => !d)}
                            className="ml-2"
                        >
                            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700 dark:text-gray-200" />}
                        </Button>
                    </div>
                    <nav className="py-6 px-4 space-y-2">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-blue-300 ${isActive(item.path) ? 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300' : ''
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-4 border-t-0 border-gray-100">
                    <Button variant="outline" className="w-full flex gap-2 justify-center items-center" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0">
                {/* Topbar */}
                <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center px-8 justify-between flex-shrink-0">
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        {navItems.find(i => isActive(i.path))?.label || 'Dashboard'}
                    </div>
                </header>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div style={{ color: 'red', fontSize: 32 }}></div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
} 