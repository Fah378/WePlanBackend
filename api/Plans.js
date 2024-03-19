const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plans = require('./../models/Plans');
const User = require('./../models/User');
const bcrypt = require('bcrypt');

router.post('/plans', async (req, res) => {
    console.log('Request Body:', req.body);

    let { tripName, description, startDate, endDate, isPublic, tripMembers, userID } = req.body;
    console.log('Variables Before Assignments:', { tripName, description, startDate, endDate, isPublic, tripMembers, userID });

    tripName = tripName.trim();
    description = description.trim();
    
    try {
        console.log('Finding user with userID:', userID);

        const user = await User.findById(userID);
        console.log('User found:', user);

        console.log('Variables After Assignments:', { tripName, description, startDate, endDate, isPublic, tripMembers, userID });

        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User not found!"
            });
        }

        // Validation logic...
        if (tripName == "" || startDate == "" || endDate == "" || tripMembers == "" || !user) {
            return res.json({
                status: "FAILED",
                message: "Empty input fields or invalid user!"
            });
        } else if (!/^[a-zA-Z0-9ก-๙ ]*$/.test(tripName)){
            return res.json({
                status: "FAILED",
                message: "Invalid Trip name entered"
            })
        } else if (isNaN(new Date(startDate).getTime())){
            return res.json({
                status: "FAILED",
                message: "Invalid start date entered"
            })
        } else if (isNaN(new Date(endDate).getTime())){
            return res.json({
                status: "FAILED",
                message: "Invalid end date entered"
            })
        } else if (!/^[0-9]*$/.test(tripMembers)){
            return res.json({
                status: "FAILED",
                message: "Invalid Trip members entered"
            })
        }

        //Checking if tripName already exists
        // const existingPlan = await Plans.findOne({ tripName });
        // if (existingPlan) {
        //     return res.json({
        //         status: "FAILED",
        //         message: "This trip name has been used"
        //     });
        // }

        const newPlan = new Plans({
            tripName,
            description,
            startDate,
            endDate,
            isPublic,
            tripMembers,
            userID,
            user: {
                userID: user.userID,
                username: user.username,
            }
        });

        const savedPlan = await newPlan.save();
        res.json({
            status: "SUCCESS",
            message: "Create new plan successful",
            data: savedPlan,
        });
    } catch (error) {
        console.error('Error creating the plan', error);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred!"
        });
    }
});

router.get('/plans/:useruserID', async (req, res) => {
    // Retrieve useruserID from request parameters
    const useruserID = req.params.useruserID;

    // Validate useruserID as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(useruserID)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        // Find plans associated with the user ID
        const plans = await Plans.find({ userID: useruserID });

        if (!plans) {
            return res.status(404).json({ error: 'No plans found for the specified user ID' });
        }

        // Extract trip names from the found plans
        const tripDetails = plans.map(plan => ({
            tripName: plan.tripName,
            startDate: plan.startDate,
            endDate: plan.endDate,
            description: plan.description
        }));


        res.status(200).json({ tripDetails });
    } catch (error) {
        console.error('Error getting trip details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }    
});

module.exports = router;