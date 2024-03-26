const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Wishlist = require('./../models/Wishlist');

router.post('/wishlist', async (req, res) => {
    // Extract information from the request body
    const { userID, locationName, lat, lng } = req.body;

    // Simple validation
    if (!userID || !locationName || !lat || !lng) {
        return res.status(400).json({
            status: "FAILED",
            message: "Missing information for new wishlist item"
        });
    }

    try {
        // Check if the userID is valid
        if (!mongoose.Types.ObjectId.isValid(userID)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Create a new wishlist item
        const newWishlistItem = new Wishlist({
            locationName,
            lat,
            lng,
            userID
        });

        // Save the wishlist item to the database
        const savedWishlistItem = await newWishlistItem.save();

        // Respond with the saved item
        res.status(201).json({
            status: "SUCCESS",
            data: savedWishlistItem
        });
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        console.error('MongoDB Error:', error.message);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while adding item to wishlist"
        });
    }
});

module.exports = router;