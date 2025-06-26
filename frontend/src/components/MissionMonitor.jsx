import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';
import {
    Play,
    Pause,
    Square,
    MapPin,
    Clock,
    Target,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const MissionMonitor = () => {
    const { id: missionId } = useParams();
    const [map, setMap] = useState(null);
    const [mission, setMission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [flightPath, setFlightPath] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [missionStatus, setMissionStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
    const [markers, setMarkers] = useState([]);
    const [polyline, setPolyline] = useState(null);
    const mapRef = useRef(null);
    const intervalRef = useRef(null);

    console.log('MissionMonitor component rendered with missionId:', missionId);

    // Mock mission data - replace with actual API calls
    const mockMission = {
        id: missionId || 'mission-001',
        name: 'Facility Inspection - Building A',
        status: 'in_progress',
        progress: 65,
        estimatedTimeRemaining: 1800, // 30 minutes in seconds
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        waypoints: [
            { lat: 37.7749, lng: -122.4194, name: 'Start Point' },
            { lat: 37.7755, lng: -122.4180, name: 'Checkpoint 1' },
            { lat: 37.7760, lng: -122.4165, name: 'Checkpoint 2' },
            { lat: 37.7765, lng: -122.4150, name: 'Checkpoint 3' },
            { lat: 37.7770, lng: -122.4135, name: 'End Point' }
        ],
        currentPosition: { lat: 37.7760, lng: -122.4165 },
        drone: {
            id: 'drone-001',
            name: 'DJI Mavic Pro',
            battery: 78,
            altitude: 120,
            speed: 15
        }
    };

    // Load mission data first
    useEffect(() => {
        const loadMission = async () => {
            console.log('Loading mission data...');
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMission(mockMission);
                setMissionStatus(mockMission.status);
                setProgress(mockMission.progress);
                setEstimatedTimeRemaining(mockMission.estimatedTimeRemaining);
                setCurrentPosition(mockMission.currentPosition);
                setFlightPath(mockMission.waypoints);
                console.log('Mission data loaded successfully');
            } catch (error) {
                console.error('Error loading mission:', error);
                toast.error('Failed to load mission data');
            }
        };

        loadMission();
    }, [missionId]);

    // Initialize Google Maps after mission data is loaded
    useEffect(() => {
        if (!mission) {
            console.log('Mission not loaded yet, waiting...');
            return;
        }

        let retryCount = 0;
        const maxRetries = 50; // 5 seconds max

        const initMap = async () => {
            console.log('Starting map initialization...');

            // Wait for the DOM element to be available
            if (!mapRef.current) {
                retryCount++;
                if (retryCount > maxRetries) {
                    console.error('Map ref never became available after', maxRetries, 'retries');
                    toast.error('Failed to initialize map container');
                    setIsLoading(false);
                    return;
                }
                console.log('Map ref not ready, retrying... (attempt', retryCount, ')');
                setTimeout(initMap, 100);
                return;
            }

            console.log('Map ref is ready:', mapRef.current);

            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            console.log('Environment variables:', import.meta.env);
            console.log('API Key:', apiKey);
            console.log('API Key type:', typeof apiKey);
            console.log('API Key length:', apiKey ? apiKey.length : 0);
            console.log('Map ref element:', mapRef.current);

            // Check each condition separately
            console.log('API key check results:');
            console.log('- !apiKey:', !apiKey);
            console.log('- apiKey === "YOUR_GOOGLE_MAPS_API_KEY":', apiKey === 'YOUR_GOOGLE_MAPS_API_KEY');
            console.log('- apiKey === "undefined":', apiKey === 'undefined');

            if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY' || apiKey === 'undefined') {
                console.warn('Google Maps API key not configured. Using fallback interface.');
                console.warn('Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
                setIsLoading(false);
                return;
            }

            console.log('API key is valid, proceeding with Google Maps initialization...');

            const loader = new Loader({
                apiKey: apiKey,
                version: 'weekly',
                libraries: ['geometry']
            });

            try {
                const google = await loader.load();
                console.log('Google Maps loaded successfully:', google);

                const mapInstance = new google.maps.Map(mapRef.current, {
                    center: { lat: 37.7749, lng: -122.4194 },
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.SATELLITE,
                    styles: [
                        {
                            featureType: 'all', 
                            elementType: 'labels.text.fill',
                            stylers: [{ color: '#ffffff' }]
                        },
                        {
                            featureType: 'all',
                            elementType: 'labels.text.stroke',
                            stylers: [{ color: '#000000' }, { lightness: 13 }]
                        },
                        {
                            featureType: 'administrative',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#000000' }]
                        },
                        {
                            featureType: 'administrative',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#144b53' }, { lightness: 14 }, { weight: 1.4 }]
                        },
                        {
                            featureType: 'landscape',
                            elementType: 'all',
                            stylers: [{ color: '#08304b' }]
                        },
                        {
                            featureType: 'poi',
                            elementType: 'geometry',
                            stylers: [{ color: '#0c4152' }, { lightness: 5 }]
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#000000' }]
                        },
                        {
                            featureType: 'road.highway',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#0b434f' }, { lightness: 25 }]
                        },
                        {
                            featureType: 'road.arterial',
                            elementType: 'geometry.fill',
                            stylers: [{ color: '#000000' }]
                        },
                        {
                            featureType: 'road.arterial',
                            elementType: 'geometry.stroke',
                            stylers: [{ color: '#0b3d51' }, { lightness: 16 }]
                        },
                        {
                            featureType: 'road.local',
                            elementType: 'geometry',
                            stylers: [{ color: '#000000' }]
                        },
                        {
                            featureType: 'transit',
                            elementType: 'all',
                            stylers: [{ color: '#146474' }]
                        },
                        {
                            featureType: 'water',
                            elementType: 'all',
                            stylers: [{ color: '#021019' }]
                        }
                    ]
                });

                console.log('Map instance created:', mapInstance);
                setMap(mapInstance);
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading Google Maps:', error);
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
                toast.error(`Failed to load map: ${error.message}`);
                setIsLoading(false);
            }
        };

        initMap();
    }, [mission]); // Changed dependency to mission instead of empty array

    // Initialize markers and flight path
    useEffect(() => {
        if (!map || !flightPath.length) return;

        const google = window.google;

        // Clear existing markers and polyline
        markers.forEach(marker => marker.setMap(null));
        if (polyline) polyline.setMap(null);

        // Create waypoint markers
        const newMarkers = flightPath.map((waypoint, index) => {
            const marker = new google.maps.Marker({
                position: { lat: waypoint.lat, lng: waypoint.lng },
                map: map,
                title: waypoint.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: index === 0 ? '#4ade80' : index === flightPath.length - 1 ? '#ef4444' : '#3b82f6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                },
                label: {
                    text: (index + 1).toString(),
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
                content: `
          <div class="p-2">
            <h3 class="font-semibold text-gray-900">${waypoint.name}</h3>
            <p class="text-sm text-gray-600">Waypoint ${index + 1}</p>
            <p class="text-sm text-gray-600">Lat: ${waypoint.lat.toFixed(4)}</p>
            <p class="text-sm text-gray-600">Lng: ${waypoint.lng.toFixed(4)}</p>
          </div>
        `
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });

            return marker;
        });

        // Create flight path polyline
        const pathCoordinates = flightPath.map(waypoint => ({
            lat: waypoint.lat,
            lng: waypoint.lng
        }));

        const newPolyline = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            icons: [{
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                },
                offset: '50%',
                repeat: '100px'
            }]
        });

        newPolyline.setMap(map);
        setMarkers(newMarkers);
        setPolyline(newPolyline);

        // Fit map to show all waypoints
        const bounds = new google.maps.LatLngBounds();
        flightPath.forEach(waypoint => {
            bounds.extend({ lat: waypoint.lat, lng: waypoint.lng });
        });
        map.fitBounds(bounds);

    }, [map, flightPath]);

    // Update current position marker
    useEffect(() => {
        if (!map || !currentPosition) return;

        const google = window.google;

        // Remove existing current position marker
        if (window.currentPositionMarker) {
            window.currentPositionMarker.setMap(null);
        }

        // Create current position marker
        window.currentPositionMarker = new google.maps.Marker({
            position: currentPosition,
            map: map,
            title: 'Current Position',
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#f59e0b',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            },
            label: {
                text: 'DRONE',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 'bold'
            }
        });

    }, [map, currentPosition]);

    // Simulate real-time updates
    useEffect(() => {
        if (missionStatus !== 'in_progress') return;

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                const newProgress = Math.min(prev + Math.random() * 2, 100);
                if (newProgress >= 100) {
                    setMissionStatus('completed');
                    toast.success('Mission completed successfully!');
                }
                return newProgress;
            });

            setEstimatedTimeRemaining(prev => Math.max(prev - 1, 0));

            // Simulate position updates
            if (flightPath.length > 1) {
                const currentIndex = Math.floor((progress / 100) * (flightPath.length - 1));
                const nextIndex = Math.min(currentIndex + 1, flightPath.length - 1);

                const current = flightPath[currentIndex];
                const next = flightPath[nextIndex];

                const progressInSegment = (progress % (100 / (flightPath.length - 1))) / (100 / (flightPath.length - 1));

                const newLat = current.lat + (next.lat - current.lat) * progressInSegment;
                const newLng = current.lng + (next.lng - current.lng) * progressInSegment;

                setCurrentPosition({ lat: newLat, lng: newLng });
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [missionStatus, progress, flightPath]);

    // Mission control actions
    const handlePauseMission = () => {
        setMissionStatus('paused');
        toast.success('Mission paused');
    };

    const handleResumeMission = () => {
        setMissionStatus('in_progress');
        toast.success('Mission resumed');
    };

    const handleAbortMission = () => {
        setMissionStatus('aborted');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        toast.error('Mission aborted');
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-500';
            case 'in_progress': return 'text-blue-500';
            case 'paused': return 'text-yellow-500';
            case 'aborted': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-5 h-5" />;
            case 'in_progress': return <Loader2 className="w-5 h-5 animate-spin" />;
            case 'paused': return <Pause className="w-5 h-5" />;
            case 'aborted': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-gray-600">Loading mission monitor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Mission Monitor
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {mission?.name || 'Loading mission...'}
                        </p>
                        {!map && (
                            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Google Maps API key not configured. This is a demonstration interface with mock data.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(missionStatus)}
                            <span className={`font-medium ${getStatusColor(missionStatus)}`}>
                                {missionStatus.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                                {formatTime(estimatedTimeRemaining)} remaining
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex">
                {/* Map Container - Always rendered */}
                <div className="flex-1 relative">
                    <div ref={mapRef} className="w-full h-full" />

                    {/* Fallback overlay when map is not available */}
                    {!map && (
                        <div className="absolute inset-0 bg-gray-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Flight Path Visualization</h3>
                                    <p className="text-gray-500 mb-4">Google Maps integration would display here</p>

                                    {/* Mock Flight Path */}
                                    <div className="relative w-64 h-48 mx-auto bg-white rounded-lg shadow-md p-4">
                                        <div className="absolute inset-4 border-2 border-dashed border-blue-300 rounded"></div>

                                        {/* Waypoint markers */}
                                        {flightPath.map((waypoint, index) => {
                                            const x = 20 + (index / (flightPath.length - 1)) * 200;
                                            const y = 20 + Math.sin(index * 0.5) * 60;

                                            return (
                                                <div
                                                    key={index}
                                                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
                                                    style={{
                                                        left: `${x}px`,
                                                        top: `${y}px`,
                                                        backgroundColor: index === 0 ? '#4ade80' :
                                                            index === flightPath.length - 1 ? '#ef4444' : '#3b82f6'
                                                    }}
                                                >
                                                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                            );
                                        })}

                                        {/* Current position */}
                                        {currentPosition && (
                                            <div
                                                className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                                                style={{
                                                    left: `${20 + (progress / 100) * 200}px`,
                                                    top: `${20 + Math.sin((progress / 100) * Math.PI) * 60}px`,
                                                    backgroundColor: '#f59e0b'
                                                }}
                                            >
                                                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                                                    DRONE
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Map Controls Overlay */}
                    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Mission Progress</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Drone Info Overlay */}
                    {mission?.drone && (
                        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Drone Status</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Battery</span>
                                    <span className={`font-medium ${mission.drone.battery > 20 ? 'text-green-600' : 'text-red-600'}`}>
                                        {mission.drone.battery}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Altitude</span>
                                    <span className="font-medium">{mission.drone.altitude}m</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Speed</span>
                                    <span className="font-medium">{mission.drone.speed} m/s</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Control Panel */}
                <div className="w-80 bg-white border-l border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Mission Control</h2>

                    {/* Mission Actions */}
                    <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-2 gap-3">
                            {missionStatus === 'in_progress' ? (
                                <button
                                    onClick={handlePauseMission}
                                    className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Pause className="w-4 h-4" />
                                    <span>Pause</span>
                                </button>
                            ) : missionStatus === 'paused' ? (
                                <button
                                    onClick={handleResumeMission}
                                    className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Play className="w-4 h-4" />
                                    <span>Resume</span>
                                </button>
                            ) : null}

                            <button
                                onClick={handleAbortMission}
                                disabled={missionStatus === 'completed' || missionStatus === 'aborted'}
                                className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                <Square className="w-4 h-4" />
                                <span>Abort</span>
                            </button>
                        </div>
                    </div>

                    {/* Mission Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-900">Mission Details</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Mission ID</span>
                                <span className="text-sm font-medium">{mission?.id}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Start Time</span>
                                <span className="text-sm font-medium">
                                    {mission?.startTime?.toLocaleTimeString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Waypoints</span>
                                <span className="text-sm font-medium">{flightPath.length}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Position</span>
                                <span className="text-sm font-medium">
                                    {currentPosition ?
                                        `${currentPosition.lat.toFixed(4)}, ${currentPosition.lng.toFixed(4)}` :
                                        'N/A'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Flight Path Summary */}
                    <div className="mt-8">
                        <h3 className="font-semibold text-gray-900 mb-4">Flight Path</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {flightPath.map((waypoint, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                                >
                                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-green-500' :
                                        index === flightPath.length - 1 ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{waypoint.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissionMonitor; 