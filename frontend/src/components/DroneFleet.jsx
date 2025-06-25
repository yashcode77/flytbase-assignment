import React from 'react';
import { Drone, Battery, MapPin, Settings, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function DroneFleet() {
    const drones = [
        {
            id: 1,
            name: 'DJI Phantom 4 Pro',
            model: 'Phantom 4 Pro',
            status: 'available',
            batteryLevel: 85,
            location: 'Hangar A',
            lastMaintenance: '2024-01-15',
            totalFlightHours: 120
        },
        {
            id: 2,
            name: 'Autel EVO II',
            model: 'EVO II Pro',
            status: 'in_mission',
            batteryLevel: 45,
            location: 'Mission Zone',
            lastMaintenance: '2024-01-10',
            totalFlightHours: 95
        },
        {
            id: 3,
            name: 'Skydio 2',
            model: 'Skydio 2',
            status: 'maintenance',
            batteryLevel: 20,
            location: 'Service Bay',
            lastMaintenance: '2024-01-20',
            totalFlightHours: 78
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            in_mission: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            offline: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const getBatteryColor = (level) => {
        if (level > 60) return 'text-green-600 dark:text-green-400';
        if (level > 30) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Drone Fleet</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage and monitor your drone fleet</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={16} />
                    Add Drone
                </button>
            </div>

            {/* Fleet Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Drones</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Drone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <div className="h-6 w-6 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Mission</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">3</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <div className="h-6 w-6 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1</p>
                        </div>
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <div className="h-6 w-6 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Drone List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Fleet Status</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Drone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Battery</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Flight Hours</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {drones.map((drone) => (
                                <tr key={drone.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{drone.name}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{drone.model}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(drone.status)}`}>
                                            {drone.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Battery className={`h-4 w-4 ${getBatteryColor(drone.batteryLevel)}`} />
                                            <span className={`text-sm font-medium ${getBatteryColor(drone.batteryLevel)}`}>
                                                {drone.batteryLevel}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-900 dark:text-gray-100">{drone.location}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {drone.totalFlightHours}h
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                <Eye size={16} />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                <Edit size={16} />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Plus size={16} className="text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add New Drone</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Settings size={16} className="text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Schedule Maintenance</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                            <Drone size={16} className="text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Fleet Overview</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 