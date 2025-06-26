import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import { ClipLoader } from 'react-spinners';

const schema = z.object({
    name: z.string().min(2, 'Mission name must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    latitude: z.number().min(-90).max(90, 'Latitude must be between -90 and 90'),
    longitude: z.number().min(-180).max(180, 'Longitude must be between -180 and 180'),
    altitude: z.number().min(0).max(1000, 'Altitude must be between 0 and 1000 meters'),
    missionType: z.enum(['surveillance', 'mapping', 'inspection', 'delivery']),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    scheduledAt: z.string().optional(),
    droneId: z.string().optional(),
});

export default function MissionForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true); // New state for initial load
    const [availableDrones, setAvailableDrones] = useState([]);
    const [dronesLoading, setDronesLoading] = useState(false);
    const isEditing = Boolean(id);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const [showDroneDropdown, setShowDroneDropdown] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
        control,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            missionType: 'surveillance',
            priority: 'medium',
            altitude: 100,
        },
    });

    useEffect(() => {
        const initializeForm = async () => {
            try {
                // Always fetch available drones
                await fetchAvailableDrones();

                // If editing, fetch mission details
                if (isEditing) {
                    await fetchMission();
                }
            } catch (error) {
                console.error('Error initializing form:', error);
            } finally {
                setInitializing(false); // Set to false when everything is done
            }
        };

        initializeForm();
    }, [id, isEditing]);

    const fetchAvailableDrones = async () => {
        setDronesLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/drones/available/list', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const drones = await response.json();
                setAvailableDrones(drones);
            } else {
                toast.error('Failed to fetch available drones');
            }
        } catch (error) {
            console.error('Error fetching drones:', error);
            toast.error('Error fetching available drones');
        } finally {
            setDronesLoading(false);
        }
    };

    const fetchMission = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/missions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const mission = await response.json();

                // Populate form with existing data
                setValue('name', mission.name);
                setValue('description', mission.description);
                setValue('latitude', mission.coordinates.latitude);
                setValue('longitude', mission.coordinates.longitude);
                setValue('altitude', mission.coordinates.altitude);
                setValue('missionType', mission.missionType);
                setValue('priority', mission.priority);
                setValue('droneId', mission.droneId || '');

                if (mission.scheduledAt) {
                    const scheduledDate = new Date(mission.scheduledAt);
                    const localDateTime = new Date(scheduledDate.getTime() - scheduledDate.getTimezoneOffset() * 60000);
                    setValue('scheduledAt', localDateTime.toISOString().slice(0, 16));
                }
            } else {
                toast.error('Failed to fetch mission details');
                navigate('/missions');
            }
        } catch (error) {
            toast.error('Error fetching mission details');
            navigate('/missions');
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const missionData = {
                ...data,
                coordinates: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    altitude: data.altitude,
                },
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
            };

            // Remove empty droneId
            if (!missionData.droneId) {
                delete missionData.droneId;
            }

            const url = isEditing ? `/api/missions/${id}` : '/api/missions';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(missionData),
            });

            if (response.ok) {
                toast.success(isEditing ? 'Mission updated successfully!' : 'Mission created successfully!');
                navigate('/missions');
            } else {
                const error = await response.json();
                toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} mission`);
            }
        } catch (error) {
            toast.error(`Error ${isEditing ? 'updating' : 'creating'} mission`);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state when initializing (fetching mission details for editing or loading drones)
    if (initializing) {
        return (
            <div className="max-w-4xl mx-auto">
                {/* Header - Always visible */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {isEditing ? 'Edit Mission' : 'Create New Mission'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        {isEditing ? 'Update mission details and configuration.' : 'Set up a new drone mission with all necessary details.'}
                    </p>
                </div>

                {/* Loading State */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-12">
                    <div className="flex flex-col justify-center items-center">
                        <ClipLoader size={32} color="#2563eb" />
                        <span className="mt-4 text-blue-700 dark:text-blue-300 text-lg">
                            {isEditing ? 'Loading mission details...' : 'Loading form...'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header - Always visible */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {isEditing ? 'Edit Mission' : 'Create New Mission'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    {isEditing ? 'Update mission details and configuration.' : 'Set up a new drone mission with all necessary details.'}
                </p>
            </div>

            {/* Form - Only show when not initializing */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mission Name *
                            </label>
                            <Input
                                type="text"
                                {...register('name')}
                                className="mb-1"
                                placeholder="Enter mission name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mission Type *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center"
                                    onClick={() => setShowTypeDropdown(v => !v)}
                                >
                                    {watch('missionType') ? watch('missionType').charAt(0).toUpperCase() + watch('missionType').slice(1) : 'Select mission type'}
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showTypeDropdown && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                        {['surveillance', 'mapping', 'inspection', 'delivery'].map(type => (
                                            <li
                                                key={type}
                                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer"
                                                onClick={() => { setValue('missionType', type); setShowTypeDropdown(false); }}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {errors.missionType && <p className="text-red-500 text-sm mt-1">{errors.missionType.message}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 mb-1 resize-none"
                            placeholder="Describe the mission objectives and requirements"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority *
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center"
                                    onClick={() => setShowPriorityDropdown(v => !v)}
                                >
                                    {watch('priority') ? watch('priority').charAt(0).toUpperCase() + watch('priority').slice(1) : 'Select priority'}
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {showPriorityDropdown && (
                                    <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                                        {['low', 'medium', 'high', 'critical'].map(priority => (
                                            <li
                                                key={priority}
                                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer"
                                                onClick={() => { setValue('priority', priority); setShowPriorityDropdown(false); }}
                                            >
                                                {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Scheduled Date
                            </label>
                            <Input
                                type="datetime-local"
                                {...register('scheduledAt')}
                                className="mb-1"
                            />
                            {errors.scheduledAt && <p className="text-red-500 text-sm mt-1">{errors.scheduledAt.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Location & Flight Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Latitude *
                            </label>
                            <Input
                                type="number"
                                step="any"
                                {...register('latitude', { valueAsNumber: true })}
                                placeholder="e.g., 40.7128"
                                className="mb-1"
                            />
                            {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Longitude *
                            </label>
                            <Input
                                type="number"
                                step="any"
                                {...register('longitude', { valueAsNumber: true })}
                                placeholder="e.g., -74.0060"
                                className="mb-1"
                            />
                            {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Altitude (meters) *
                            </label>
                            <Input
                                type="number"
                                {...register('altitude', { valueAsNumber: true })}
                                placeholder="e.g., 100"
                                className="mb-1"
                            />
                            {errors.altitude && <p className="text-red-500 text-sm mt-1">{errors.altitude.message}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assign Drone (Optional)
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setShowDroneDropdown(v => !v)}
                            >
                                {watch('droneId') ?
                                    (availableDrones.find(d => d._id === watch('droneId'))?.name || 'Selected drone not found') :
                                    'Select a drone (optional)'
                                }
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showDroneDropdown && (
                                <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                    <li
                                        className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer text-gray-500 dark:text-gray-400"
                                        onClick={() => { setValue('droneId', ''); setShowDroneDropdown(false); }}
                                    >
                                        No drone assigned
                                    </li>
                                    {availableDrones.length === 0 ? (
                                        <li className="px-4 py-2 text-gray-500 dark:text-gray-400">
                                            No available drones
                                        </li>
                                    ) : (
                                        availableDrones.map(drone => (
                                            <li
                                                key={drone._id}
                                                className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer"
                                                onClick={() => { setValue('droneId', drone._id); setShowDroneDropdown(false); }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">{drone.name}</span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {drone.batteryLevel}%
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {drone.model}
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                        {errors.droneId && <p className="text-red-500 text-sm mt-1">{errors.droneId.message}</p>}
                    </div>
                </div>

                {/* Survey Area Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        Survey Area
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Polygon - add at least 3 points)</span>
                    </h2>
                    <SurveyAreaField control={control} register={register} />
                </div>

                {/* Flight Path Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        Flight Path & Waypoints
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Add waypoints in order)</span>
                    </h2>
                    <FlightPathField control={control} register={register} />
                </div>

                {/* Data Collection Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700 mt-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                        Data Collection Parameters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Data Collection Frequency (seconds)
                            </label>
                            <Input
                                type="number"
                                min={1}
                                {...register('dataCollection.frequency', { valueAsNumber: true })}
                                placeholder="e.g., 5"
                                className="mb-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sensors to Use
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {['camera', 'thermal', 'lidar', 'multispectral', 'other'].map(sensor => (
                                    <label key={sensor} className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <input
                                            type="checkbox"
                                            value={sensor}
                                            {...register('dataCollection.sensors')}
                                            className="accent-blue-600"
                                        />
                                        {sensor.charAt(0).toUpperCase() + sensor.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/missions')}
                        disabled={loading}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <ClipLoader size={16} color="#ffffff" className="mr-2" />
                                {isEditing ? 'Updating Mission...' : 'Creating Mission...'}
                            </span>
                        ) : (
                            isEditing ? 'Update Mission' : 'Create Mission'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function SurveyAreaField({ control, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'surveyArea',
    });
    return (
        <div>
            <div className="space-y-2 mb-4">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <Input
                            type="number"
                            step="any"
                            {...register(`surveyArea.${idx}.latitude`, { valueAsNumber: true })}
                            placeholder="Latitude"
                            className="w-32"
                        />
                        <Input
                            type="number"
                            step="any"
                            {...register(`surveyArea.${idx}.longitude`, { valueAsNumber: true })}
                            placeholder="Longitude"
                            className="w-32"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => remove(idx)} className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20">Remove</Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" onClick={() => append({ latitude: '', longitude: '' })}>
                Add Point
            </Button>
        </div>
    );
}

function FlightPathField({ control, register }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'flightPath',
    });
    return (
        <div>
            <div className="space-y-2 mb-4">
                {fields.map((field, idx) => (
                    <div key={field.id} className="flex gap-2 items-center">
                        <Input
                            type="number"
                            step="any"
                            {...register(`flightPath.${idx}.latitude`, { valueAsNumber: true })}
                            placeholder="Latitude"
                            className="w-28"
                        />
                        <Input
                            type="number"
                            step="any"
                            {...register(`flightPath.${idx}.longitude`, { valueAsNumber: true })}
                            placeholder="Longitude"
                            className="w-28"
                        />
                        <Input
                            type="number"
                            step="any"
                            {...register(`flightPath.${idx}.altitude`, { valueAsNumber: true })}
                            placeholder="Altitude"
                            className="w-24"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => remove(idx)} className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20">Remove</Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" onClick={() => append({ latitude: '', longitude: '', altitude: '' })}>
                Add Waypoint
            </Button>
        </div>
    );
}