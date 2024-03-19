const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plans = require('./../models/Plans');
const User = require('./../models/User');
const Details = require('./../models/Details');
const bcrypt = require('bcrypt');

router.post('/details', async (req, res) => {
    console.log('Request Body:', req.body);

    let { locationName, date, lat, lng, plansID } = req.body;
    console.log('Variables Before Assignments:', { locationName, date, lat, lng, plansID });

    locationName = locationName.trim();
    
    try {
        console.log('Finding plan with plansID:', plansID); 

        const plans = await Plans.findById(plansID);
        console.log('Plan found:', plans);

        console.log('Variables After Assignments:', { locationName, date, lat, lng, plansID });

        if (!plans) {
            return res.status(400).json({
                status: "FAILED",
                message: "Plan not found!"
            });
        }

        const newDetails = new Details({
            locationName, 
            date,
            lat,
            lng,
            plansID, 
            plans: {
                plansID: plans.plansID, 
                tripName: plans.tripName, 
            }
        });        

        const savedDetails = await newDetails.save();
        res.json({
            status: "SUCCESS",
            message: "Add new detail successful",
            data: savedDetails, 
        });        
    } catch (error) {
        console.error('Error adding new detail', error);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred!"
        });
    }
});

router.get('/seedetails/:plansplansID', async (req, res) => {
    // Retrieve plansplansID from request parameters
    const plansplansID = req.params.plansplansID;

    // Validate plansplansID as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(plansplansID)) {
        return res.status(400).json({ error: 'Invalid Plan ID' });
    }

    try {
        // Find details associated with the plans ID
        const details = await Details.find({ plansID: plansplansID });

        if (!details) {
            return res.status(404).json({ error: 'No details found for the specified plan ID' });
        }

        // Extract details from the found details
        const plansDetails = details.map(details => ({
            locationName: details.locationName,
            date: details.date,
            lat: details.lat,
            lng: details.lng
        }));

        res.status(200).json({ plansDetails });
    } catch (error) {
        console.error('Error getting details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }    
});

module.exports = router;