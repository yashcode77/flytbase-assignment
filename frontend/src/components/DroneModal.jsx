import React, { useState, useEffect } from 'react';
import { X, Save, Camera, Settings, Battery, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DroneModal({ isOpen, onClose, drone = null, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        serialNumber: '',
        maxAltitude: 120,
        maxSpeed: 50,
        batteryCapacity: 100,
        cameraResolution: '4K',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (drone) {
            setFormData({
                name: drone.name || '',
                model: drone.model || '',
                serialNumber: drone.serialNumber || '',
                maxAltitude: drone.maxAltitude || 120,
                maxSpeed: drone.maxSpeed || 50,
                batteryCapacity: drone.batteryCapacity || 100,
                cameraResolution: drone.cameraResolution || '4K',
                notes: drone.notes || ''
            });
        } else {
            setFormData({
                name: '',
                model: '',
                serialNumber: '',
                maxAltitude: 120,
                maxSpeed: 50,
                batteryCapacity: 100,
                cameraResolution: '4K',
                notes: ''
            });
        }
    }, [drone]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.model || !formData.serialNumber) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            // Prepare drone data for API
            const droneData = {
                name: formData.name,
                model: formData.model,
                serialNumber: formData.serialNumber,
                maxAltitude: parseInt(formData.maxAltitude),
                maxSpeed: parseInt(formData.maxSpeed),
                batteryCapacity: parseInt(formData.batteryCapacity),
                cameraResolution: formData.cameraResolution,
                notes: formData.notes
            };

            console.log('DroneModal: Sending drone data:', droneData);
            console.log('DroneModal: Is edit mode?', !!drone);

            // Call the parent's onSave function
            await onSave(droneData);
        } catch (error) {
            console.error('DroneModal: Failed to save drone:', error);
            toast.error(error.message || 'Failed to save drone');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {drone ? 'Edit Drone' : 'Add New Drone'}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {drone ? 'Update drone information' : 'Add a new drone to your fleet'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Drone Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., DJI Phantom 4 Pro"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Phantom 4 Pro"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Serial Number *
                            </label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., DJI-P4P-001"
                                required
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <Battery className="h-5 w-5" />
                            Specifications
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Max Altitude (m)
                                </label>
                                <input
                                    type="number"
                                    name="maxAltitude"
                                    value={formData.maxAltitude}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Max Speed (km/h)
                                </label>
                                <input
                                    type="number"
                                    name="maxSpeed"
                                    value={formData.maxSpeed}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Battery Capacity (mAh)
                                </label>
                                <input
                                    type="number"
                                    name="batteryCapacity"
                                    value={formData.batteryCapacity}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="10000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Camera Resolution
                            </label>
                            <select
                                name="cameraResolution"
                                value={formData.cameraResolution}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="4K">4K</option>
                                <option value="5.1K">5.1K</option>
                                <option value="6K">6K</option>
                                <option value="8K">8K</option>
                                <option value="1080p">1080p</option>
                            </select>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Additional Information
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Additional notes about this drone..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {loading ? 'Saving...' : (drone ? 'Update Drone' : 'Add Drone')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 