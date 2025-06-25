import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const navigationItems = [
    {
        title: 'Missions',
        description: 'Create and manage drone missions',
        icon: '🚁',
        path: '/missions',
        color: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800'
    },
    {
        title: 'Reports',
        description: 'View mission reports and analytics',
        icon: '📊',
        path: '/reports',
        color: 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800'
    },
    {
        title: 'Drone Fleet',
        description: 'Manage your drone fleet',
        icon: '🛸',
        path: '/drones',
        color: 'bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800'
    },
    {
        title: 'Analytics',
        description: 'View detailed analytics and insights',
        icon: '📈',
        path: '/analytics',
        color: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-700 dark:hover:bg-orange-800'
    }
];

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to Drone Mission Management</h2>
                <p className="text-gray-600 dark:text-gray-300">Manage your drone missions, view reports, and monitor your fleet from one central dashboard.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {navigationItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-shadow cursor-pointer flex flex-col justify-between dark:shadow-gray-900/20"
                        onClick={() => navigate(item.path)}
                    >
                        <div>
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
                        </div>
                        <Button className={`w-full mt-2 ${item.color} text-white`}>
                            Go to {item.title}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
} 