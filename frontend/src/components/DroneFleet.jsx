import React, { useState, useEffect } from 'react';
import {
    Drone,
    Battery,
    MapPin,
    Settings,
    Plus,
    Eye,
    Edit,
    Trash2,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    Signal,
    Wifi,
    WifiOff,
    Calendar,
    BarChart3,
    Filter,
    Search,
    Download,
    Upload,
    Zap,
    Shield,
    Target,
    Navigation,
    Monitor,
    Grid3X3
} from 'lucide-react';
import toast from 'react-hot-toast';
import DroneModal from './DroneModal';
import FleetMonitor from './FleetMonitor';
import droneService from '../services/droneService';

export default function DroneFleet() {
    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'monitor'

    // Load drones from API
    const loadDrones = async () => {
        try {
            setLoading(true);
            const data = await droneService.getAllDrones();

            // Transform API data to match frontend expectations
            const transformedDrones = data.map(drone => ({
                ...drone,
                // Add computed fields for frontend
                signalStrength: drone.signalStrength || 95,
                altitude: drone.altitude || 0,
                speed: drone.speed || 0,
                lastSeen: drone.lastSeen ? new Date(drone.lastSeen) : new Date(),
                missionCount: drone.missionCount || 0,
                efficiency: drone.efficiency || 90,
                coordinates: drone.currentLocation || { lat: 37.7749, lng: -122.4194 },
                location: drone.location || 'Hangar A'
            }));

            setDrones(transformedDrones);
        } catch (error) {
            console.error('Failed to load drones:', error);
            toast.error('Failed to load drone fleet data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDrones();
    }, []);

    // Simulate real-time updates for drones in mission
    useEffect(() => {
        const interval = setInterval(() => {
            setDrones(prevDrones =>
                prevDrones.map(drone => {
                    // Only simulate updates for drones in mission
                    if (drone.status === 'in_mission' && drone.batteryLevel > 0) {
                        const newBatteryLevel = Math.max(0, drone.batteryLevel - Math.random() * 2);
                        return {
                            ...drone,
                            batteryLevel: Math.round(newBatteryLevel),
                            lastSeen: new Date(),
                            // Update altitude and speed for drones in mission
                            altitude: drone.altitude + (Math.random() - 0.5) * 10,
                            speed: Math.max(0, drone.speed + (Math.random() - 0.5) * 5)
                        };
                    }
                    return drone;
                })
            );
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Calculate fleet statistics
    const fleetStats = {
        total: drones.length,
        available: drones.filter(d => d.status === 'available').length,
        inMission: drones.filter(d => d.status === 'in_mission').length,
        maintenance: drones.filter(d => d.status === 'maintenance').length,
        lowBattery: drones.filter(d => d.status === 'low_battery').length,
        offline: drones.filter(d => d.status === 'offline').length,
        avgBattery: Math.round(drones.reduce((sum, d) => sum + d.batteryLevel, 0) / drones.length) || 0,
        totalFlightHours: drones.reduce((sum, d) => sum + d.totalFlightHours, 0),
        avgEfficiency: Math.round(drones.reduce((sum, d) => sum + d.efficiency, 0) / drones.length) || 0
    };

    const getStatusColor = (status) => {
        const colors = {
            available: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
            in_mission: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
            maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
            low_battery: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
            offline: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800'
        };
        return colors[status] || colors.offline;
    };

    const getBatteryColor = (level) => {
        if (level > 60) return 'text-green-600 dark:text-green-400';
        if (level > 30) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getBatteryBarColor = (level) => {
        if (level > 60) return 'bg-green-500';
        if (level > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getSignalColor = (strength) => {
        if (strength > 80) return 'text-green-600 dark:text-green-400';
        if (strength > 50) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const formatLastSeen = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const handleRefresh = async () => {
        await loadDrones();
        toast.success('Fleet data refreshed');
    };

    const handleAddDrone = () => {
        setShowAddModal(true);
    };

    const handleEditDrone = (drone) => {
        setSelectedDrone(drone);
        setShowEditModal(true);
    };

    const handleDeleteDrone = async (drone) => {
        if (drone.status === 'in_mission') {
            toast.error('Cannot delete drone currently on mission');
            return;
        }

        try {
            await droneService.deleteDrone(drone._id);
            toast.success('Drone deleted successfully');
            await loadDrones(); // Reload the list
        } catch (error) {
            console.error('Failed to delete drone:', error);
            toast.error('Failed to delete drone');
        }
    };

    const handleSaveDrone = async (droneData) => {
        try {
            if (selectedDrone) {
                // Update existing drone
                await droneService.updateDrone(selectedDrone._id, droneData);
                toast.success('Drone updated successfully');
            } else {
                // Add new drone
                await droneService.createDrone(droneData);
                toast.success('Drone added successfully');
            }

            await loadDrones(); // Reload the list
            handleCloseModal();
        } catch (error) {
            console.error('Failed to save drone:', error);
            toast.error('Failed to save drone');
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedDrone(null);
    };

    const filteredDrones = drones
        .filter(drone =>
            drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            drone.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(drone => statusFilter === 'all' || drone.status === statusFilter)
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'status': return a.status.localeCompare(b.status);
                case 'battery': return b.batteryLevel - a.batteryLevel;
                case 'flightHours': return b.totalFlightHours - a.totalFlightHours;
                default: return 0;
            }
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Drone Fleet Management</h1>
                    <p className="text-gray-600 dark:text-gray-300">Monitor and manage your organization's drone inventory</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <button
                        onClick={handleAddDrone}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={16} />
                        Add Drone
                    </button>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center">
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('dashboard')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'dashboard'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <Grid3X3 size={16} />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setViewMode('monitor')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'monitor'
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <Monitor size={16} />
                            Live Monitor
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'monitor' ? (
                <FleetMonitor drones={drones} />
            ) : (
                <>
                    {/* Fleet Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">Total Fleet</p>
                                    <p className="text-3xl font-bold">{fleetStats.total}</p>
                                    <p className="text-blue-100 text-sm">Active drones</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Drone className="h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">Available</p>
                                    <p className="text-3xl font-bold">{fleetStats.available}</p>
                                    <p className="text-green-100 text-sm">Ready for missions</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">In Mission</p>
                                    <p className="text-3xl font-bold">{fleetStats.inMission}</p>
                                    <p className="text-purple-100 text-sm">Currently deployed</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Target className="h-8 w-8" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium">Avg Battery</p>
                                    <p className="text-3xl font-bold">{fleetStats.avgBattery}%</p>
                                    <p className="text-orange-100 text-sm">Fleet health</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Battery className="h-8 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <BarChart3 size={20} />
                                Fleet Performance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Total Flight Hours</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{fleetStats.totalFlightHours}h</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Average Efficiency</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{fleetStats.avgEfficiency}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Maintenance Required</span>
                                    <span className="font-semibold text-red-600 dark:text-red-400">{fleetStats.maintenance}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Low Battery</span>
                                    <span className="font-semibold text-orange-600 dark:text-orange-400">{fleetStats.lowBattery}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Activity size={20} />
                                Status Distribution
                            </h3>
                            <div className="space-y-3">
                                {Object.entries({
                                    'Available': { count: fleetStats.available, color: 'bg-green-500' },
                                    'In Mission': { count: fleetStats.inMission, color: 'bg-blue-500' },
                                    'Maintenance': { count: fleetStats.maintenance, color: 'bg-yellow-500' },
                                    'Low Battery': { count: fleetStats.lowBattery, color: 'bg-orange-500' }
                                }).map(([status, data]) => (
                                    <div key={status} className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${data.color}`}></div>
                                        <span className="text-gray-600 dark:text-gray-400 flex-1">{status}</span>
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">{data.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <Zap size={20} />
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleAddDrone}
                                    className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Plus size={16} className="text-blue-600 dark:text-blue-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Add New Drone</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <Settings size={16} className="text-green-600 dark:text-green-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Schedule Maintenance</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <Download size={16} className="text-purple-600 dark:text-purple-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Fleet Data</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search drones..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="in_mission">In Mission</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="low_battery">Low Battery</option>
                                    <option value="offline">Offline</option>
                                </select>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="status">Sort by Status</option>
                                    <option value="battery">Sort by Battery</option>
                                    <option value="flightHours">Sort by Flight Hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Drone Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredDrones.map((drone) => (
                            <div key={drone._id || drone.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{drone.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{drone.model}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">#{drone.serialNumber}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(drone.status)}`}>
                                            {drone.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Status Indicators */}
                                <div className="p-6 space-y-4">
                                    {/* Battery */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Battery</span>
                                            <span className={`text-sm font-semibold ${getBatteryColor(drone.batteryLevel)}`}>
                                                {drone.batteryLevel}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getBatteryBarColor(drone.batteryLevel)}`}
                                                style={{ width: `${drone.batteryLevel}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Signal Strength */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Signal</span>
                                        <div className="flex items-center gap-2">
                                            {drone.signalStrength > 0 ? (
                                                <Wifi className={`h-4 w-4 ${getSignalColor(drone.signalStrength)}`} />
                                            ) : (
                                                <WifiOff className="h-4 w-4 text-gray-400" />
                                            )}
                                            <span className={`text-sm font-semibold ${getSignalColor(drone.signalStrength)}`}>
                                                {drone.signalStrength}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-900 dark:text-gray-100">{drone.location}</span>
                                        </div>
                                    </div>

                                    {/* Flight Hours */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Flight Hours</span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{drone.totalFlightHours}h</span>
                                    </div>

                                    {/* Last Seen */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Seen</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{formatLastSeen(drone.lastSeen)}</span>
                                    </div>

                                    {/* Mission Info (if in mission) */}
                                    {drone.status === 'in_mission' && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-blue-700 dark:text-blue-300">Current Mission</span>
                                                <span className="text-blue-700 dark:text-blue-300 font-semibold">Active</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                <span>Altitude: {Math.round(drone.altitude)}m</span>
                                                <span>Speed: {Math.round(drone.speed)} km/h</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditDrone(drone)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Eye size={14} />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditDrone(drone)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Edit size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDrone(drone)}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredDrones.length === 0 && (
                        <div className="text-center py-12">
                            <Drone className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No drones found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by adding your first drone to the fleet.'
                                }
                            </p>
                            {!searchTerm && statusFilter === 'all' && (
                                <div className="mt-6">
                                    <button
                                        onClick={handleAddDrone}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                                        Add Drone
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <DroneModal
                isOpen={showAddModal}
                onClose={handleCloseModal}
                onSave={handleSaveDrone}
            />

            <DroneModal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                drone={selectedDrone}
                onSave={handleSaveDrone}
            />
        </div>
    );
} 