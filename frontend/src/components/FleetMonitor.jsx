import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Battery,
    Wifi,
    MapPin,
    Clock,
    Activity,
    Bell,
    BellOff,
    RefreshCw,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FleetMonitor({ drones }) {
    const [alerts, setAlerts] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Generate alerts based on drone status
    useEffect(() => {
        if (!isMonitoring) return;

        const newAlerts = [];

        drones.forEach(drone => {
            // Low battery alert
            if (drone.batteryLevel < 20 && drone.status !== 'maintenance') {
                newAlerts.push({
                    id: `battery-${drone._id || drone.id}`,
                    type: 'warning',
                    title: 'Low Battery Alert',
                    message: `${drone.name} battery level is ${drone.batteryLevel}%`,
                    drone: drone,
                    timestamp: new Date(),
                    priority: drone.batteryLevel < 10 ? 'high' : 'medium'
                });
            }

            // Offline alert
            if (drone.signalStrength === 0 && drone.status !== 'maintenance') {
                newAlerts.push({
                    id: `signal-${drone._id || drone.id}`,
                    type: 'error',
                    title: 'Signal Lost',
                    message: `${drone.name} is offline`,
                    drone: drone,
                    timestamp: new Date(),
                    priority: 'high'
                });
            }

            // Maintenance due alert
            if (drone.nextMaintenance) {
                const maintenanceDate = new Date(drone.nextMaintenance);
                const daysUntilMaintenance = Math.ceil((maintenanceDate - new Date()) / (1000 * 60 * 60 * 24));

                if (daysUntilMaintenance <= 7 && daysUntilMaintenance > 0) {
                    newAlerts.push({
                        id: `maintenance-${drone._id || drone.id}`,
                        type: 'info',
                        title: 'Maintenance Due',
                        message: `${drone.name} maintenance due in ${daysUntilMaintenance} days`,
                        drone: drone,
                        timestamp: new Date(),
                        priority: 'medium'
                    });
                }
            }

            // Critical battery alert
            if (drone.batteryLevel < 10 && drone.status !== 'maintenance') {
                newAlerts.push({
                    id: `critical-battery-${drone._id || drone.id}`,
                    type: 'error',
                    title: 'Critical Battery Alert',
                    message: `${drone.name} battery level is critically low at ${drone.batteryLevel}%`,
                    drone: drone,
                    timestamp: new Date(),
                    priority: 'high'
                });
            }
        });

        setAlerts(newAlerts);
        setLastUpdate(new Date());
    }, [drones, isMonitoring]);

    // Auto-dismiss alerts after 30 seconds
    useEffect(() => {
        if (!isMonitoring) return;

        const interval = setInterval(() => {
            setAlerts(prev => prev.filter(alert =>
                new Date() - alert.timestamp < 30000
            ));
        }, 5000);

        return () => clearInterval(interval);
    }, [isMonitoring]);

    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'info':
                return <Activity className="h-5 w-5 text-blue-500" />;
            default:
                return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const getAlertColor = (type) => {
        switch (type) {
            case 'warning':
                return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
            case 'error':
                return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
            case 'info':
                return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
            default:
                return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
        }
    };

    const dismissAlert = (alertId) => {
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    };

    const getStatusSummary = () => {
        const summary = {
            healthy: drones.filter(d => d.batteryLevel > 50 && d.signalStrength > 80).length,
            warning: drones.filter(d => (d.batteryLevel <= 50 && d.batteryLevel > 20) || d.signalStrength <= 80).length,
            critical: drones.filter(d => d.batteryLevel <= 20 || d.signalStrength === 0).length
        };
        return summary;
    };

    const statusSummary = getStatusSummary();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Fleet Monitor</h2>
                    <p className="text-gray-600 dark:text-gray-300">Real-time fleet status and alerts</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        Last update: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => setIsMonitoring(!isMonitoring)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isMonitoring
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                    >
                        {isMonitoring ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        {isMonitoring ? 'Monitoring' : 'Paused'}
                    </button>
                </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Healthy</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{statusSummary.healthy}</p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Warning</p>
                            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statusSummary.warning}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{statusSummary.critical}</p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                            <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Live Alerts</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {alerts.length} active alerts
                            </span>
                            {alerts.length > 0 && (
                                <button
                                    onClick={() => setAlerts([])}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Dismiss all
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {alerts.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">All systems operational</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No active alerts at this time</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                                >
                                    {getAlertIcon(alert.type)}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {alert.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {alert.message}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <span>Drone: {alert.drone.name}</span>
                                                    <span>Priority: {alert.priority}</span>
                                                    <span>{alert.timestamp.toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => dismissAlert(alert.id)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Real-time Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Battery Status</h3>
                    <div className="space-y-3">
                        {drones.map(drone => (
                            <div key={drone._id || drone.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${drone.batteryLevel > 60 ? 'bg-green-500' :
                                        drone.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {drone.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Battery className={`h-4 w-4 ${drone.batteryLevel > 60 ? 'text-green-500' :
                                        drone.batteryLevel > 30 ? 'text-yellow-500' : 'text-red-500'
                                        }`} />
                                    <span className={`text-sm font-semibold ${drone.batteryLevel > 60 ? 'text-green-600 dark:text-green-400' :
                                        drone.batteryLevel > 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {drone.batteryLevel}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Signal Strength</h3>
                    <div className="space-y-3">
                        {drones.map(drone => (
                            <div key={drone._id || drone.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${drone.signalStrength > 80 ? 'bg-green-500' :
                                        drone.signalStrength > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}></div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {drone.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {drone.signalStrength > 0 ? (
                                        <Wifi className={`h-4 w-4 ${drone.signalStrength > 80 ? 'text-green-500' :
                                            drone.signalStrength > 50 ? 'text-yellow-500' : 'text-red-500'
                                            }`} />
                                    ) : (
                                        <Wifi className="h-4 w-4 text-gray-400" />
                                    )}
                                    <span className={`text-sm font-semibold ${drone.signalStrength > 80 ? 'text-green-600 dark:text-green-400' :
                                        drone.signalStrength > 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {drone.signalStrength}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 