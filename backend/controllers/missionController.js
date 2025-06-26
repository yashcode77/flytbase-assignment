const Mission = require('../models/Mission');

// Get all missions
const getAllMissions = async (req, res) => {
    try {
        const missions = await Mission.find({ createdBy: req.user.id })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(missions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single mission
const getMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Check if user owns this mission
        if (mission.createdBy._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(mission);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Mission not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Create mission
const createMission = async (req, res) => {
    try {
        const {
            name,
            description,
            coordinates,
            missionType,
            priority,
            scheduledAt,
            droneId,
            surveyArea,
            flightPath,
            dataCollection
        } = req.body;

        // Validation
        if (!name || !description || !coordinates || !missionType || !priority) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!coordinates.latitude || !coordinates.longitude || !coordinates.altitude) {
            return res.status(400).json({ message: 'Please provide valid coordinates' });
        }

        if (surveyArea && (!Array.isArray(surveyArea) || surveyArea.length < 3)) {
            return res.status(400).json({ message: 'Survey area must have at least 3 points' });
        }

        if (flightPath && !Array.isArray(flightPath)) {
            return res.status(400).json({ message: 'Flight path must be an array' });
        }

        const newMission = new Mission({
            name,
            description,
            coordinates,
            missionType,
            priority,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            droneId,
            createdBy: req.user.id,
            status: 'pending',
            surveyArea,
            flightPath,
            dataCollection
        });

        const mission = await newMission.save();
        await mission.populate('createdBy', 'name email');

        res.status(201).json(mission);
    } catch (error) {
        console.error('Mission creation error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update mission
const updateMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);

        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Check if user owns this mission
        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow updates if mission is pending
        if (mission.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot update mission that is not pending' });
        }

        const {
            name: updateName,
            description: updateDescription,
            coordinates: updateCoordinates,
            missionType: updateMissionType,
            priority: updatePriority,
            scheduledAt: updateScheduledAt,
            droneId: updateDroneId,
            surveyArea: updateSurveyArea,
            flightPath: updateFlightPath,
            dataCollection: updateDataCollection
        } = req.body;

        // Update fields
        if (updateName) mission.name = updateName;
        if (updateDescription) mission.description = updateDescription;
        if (updateCoordinates) mission.coordinates = updateCoordinates;
        if (updateMissionType) mission.missionType = updateMissionType;
        if (updatePriority) mission.priority = updatePriority;
        if (updateScheduledAt !== undefined) mission.scheduledAt = updateScheduledAt ? new Date(updateScheduledAt) : null;
        if (updateDroneId !== undefined) mission.droneId = updateDroneId;
        if (updateSurveyArea) mission.surveyArea = updateSurveyArea;
        if (updateFlightPath) mission.flightPath = updateFlightPath;
        if (updateDataCollection) mission.dataCollection = updateDataCollection;

        const updatedMission = await mission.save();
        await updatedMission.populate('createdBy', 'name email');

        res.json(updatedMission);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Mission not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Update mission status
const updateMissionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['pending', 'active', 'completed', 'failed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const mission = await Mission.findById(req.params.id);

        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Check if user owns this mission
        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Status transition validation
        const validTransitions = {
            pending: ['active', 'cancelled'],
            active: ['completed', 'failed', 'cancelled'],
            completed: [],
            failed: [],
            cancelled: []
        };

        if (!validTransitions[mission.status].includes(status)) {
            return res.status(400).json({
                message: `Cannot transition from ${mission.status} to ${status}`
            });
        }

        // Update status and add timestamps
        mission.status = status;

        if (status === 'active' && !mission.startedAt) {
            mission.startedAt = new Date();
        }

        if (status === 'completed' || status === 'failed') {
            mission.completedAt = new Date();
            if (mission.startedAt) {
                mission.duration = Math.round((mission.completedAt - mission.startedAt) / (1000 * 60));
            }
        }

        const updatedMission = await mission.save();
        await updatedMission.populate('createdBy', 'name email');

        res.json(updatedMission);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Mission not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete mission
const deleteMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);

        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }

        // Check if user owns this mission
        if (mission.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Only allow deletion if mission is pending or cancelled
        if (!['pending', 'cancelled'].includes(mission.status)) {
            return res.status(400).json({
                message: 'Cannot delete mission that is not pending or cancelled'
            });
        }

        await mission.deleteOne();
        res.json({ message: 'Mission deleted' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Mission not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllMissions,
    getMission,
    createMission,
    updateMission,
    updateMissionStatus,
    deleteMission
}; 