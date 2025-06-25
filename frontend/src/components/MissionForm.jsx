import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

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
    const [fetching, setFetching] = useState(false);
    const [availableDrones, setAvailableDrones] = useState([]);
    const isEditing = Boolean(id);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            missionType: 'surveillance',
            priority: 'medium',
            altitude: 100,
        },
    });

    useEffect(() => {
        fetchAvailableDrones();
        if (isEditing) {
            fetchMission();
        }
    }, [id]);

    const fetchAvailableDrones = async () => {
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
            }
        } catch (error) {
            console.error('Error fetching drones:', error);
        }
    };

    const fetchMission = async () => {
        setFetching(true);
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
        } finally {
            setFetching(false);
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

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-700 dark:text-gray-200">Loading mission details...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {isEditing ? 'Edit Mission' : 'Create New Mission'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    {isEditing ? 'Update mission details and configuration.' : 'Set up a new drone mission with all necessary details.'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Basic Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mission Name *
                            </label>
                            <input
                                type="text"
                                {...register('name')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="Enter mission name"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mission Type *
                            </label>
                            <select
                                {...register('missionType')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value="surveillance">Surveillance</option>
                                <option value="mapping">Mapping</option>
                                <option value="inspection">Inspection</option>
                                <option value="delivery">Delivery</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description *
                        </label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            placeholder="Describe the mission objectives and requirements"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Priority *
                            </label>
                            <select
                                {...register('priority')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Scheduled Date
                            </label>
                            <input
                                type="datetime-local"
                                {...register('scheduledAt')}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
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
                            <input
                                type="number"
                                step="any"
                                {...register('latitude', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="e.g., 40.7128"
                            />
                            {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Longitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                {...register('longitude', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="e.g., -74.0060"
                            />
                            {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Altitude (meters) *
                            </label>
                            <input
                                type="number"
                                {...register('altitude', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                placeholder="e.g., 100"
                            />
                            {errors.altitude && <p className="text-red-500 text-sm mt-1">{errors.altitude.message}</p>}
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Assign Drone (Optional)
                        </label>
                        <select
                            {...register('droneId')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            <option value="">Select a drone</option>
                            {availableDrones.map(drone => (
                                <option key={drone._id} value={drone._id}>
                                    {drone.name} - {drone.model} (Battery: {drone.batteryLevel}%)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/missions')}
                        className="dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                    >
                        {loading
                            ? (isEditing ? 'Updating Mission...' : 'Creating Mission...')
                            : (isEditing ? 'Update Mission' : 'Create Mission')
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
} 