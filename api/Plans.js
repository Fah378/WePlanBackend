// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');

// //mongodb Plans model
// const Plans = require('./../models/Plans');
// const User = require('./../models/User');

// //Password handler 
// const bcrypt = require('bcrypt');

// //Plans
// router.post('/plans', async (req, res) => {
//     console.log('Request Body:', req.body);

//     let { tripName, province, category, startDate, endDate, isPublic, tripMembers, userID } = req.body; // Use userId instead of user
//     console.log('Variables Before Assignments:', { tripName, province, category, startDate, endDate, isPublic, tripMembers, userID });

//     tripName = tripName.trim();
//     province = province.trim();
//     category = category.trim();
    
//     try {
//         console.log('Finding user with userId:', userID);
//         const user = await User.findById(userID);
//         console.log('User found:', user);

//         console.log('Variables After Assignments:', { tripName, province, category, startDate, endDate, isPublic, tripMembers, user });

//         if (!user) {
//             return res.status(400).json({
//                 status: "FAILED",
//                 message: "User not found!"
//             });
//         }

//         // Your validation logic

//         if (tripName == "" || province == "" || category == "" || startDate == "" || endDate == "" || tripMembers == "" || !user) {
//             return res.json({
//                 status: "FAILED",
//                 message: "Empty input fields or invalid user!"
//             });
//         } else if (!/^[a-zA-Z0-9ก-๙ ]*$/.test(tripName)){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid Trip name entered"
//             })
//         } else if (!/^[ก-๙ ]*$/.test(province)){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid province entered"
//             })
//         } else if (!/^[a-zA-Zก-๙ ]*$/.test(category)){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid category entered"
//             })
//         } else if (isNaN(new Date(startDate).getTime())){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid start date entered"
//             })
//         } else if (isNaN(new Date(endDate).getTime())){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid end date entered"
//             })
//         } else if (!/^[0-9]*$/.test(tripMembers)){
//             return res.json({
//                 status: "FAILED",
//                 message: "Invalid Trip members entered"
//             })
//         }

//         //Checking if tripName already exists
//         Plans.find({tripName}).then(result => {
//             if(result.length) {
//                 // A plan already exists
//                 res.json({
//                     status: "FAILED",
//                     message: "This trip name has been used"
//                 })
//             } else {
//                 const newPlans = new Plans({
//                     tripName,
//                     province,
//                     category,
//                     startDate,
//                     endDate,
//                     isPublic,
//                     tripMembers,
//                     user: {
//                         _id: user._id,
//                         username: user.username,
//                     }
//                 });

//                 newPlans.save().then(result => {
//                     res.json({
//                         status: "SUCCESS",
//                         message: "Create new plan successful",
//                         data: result,
//                     })
//                 })
//                 .catch(err => {
//                     res.json({
//                         status: "FAILED",
//                         message: "An error occurred while saving new plan!"
//                     }) 
//                 })
//             }
//         }).catch(err => {
//             console.log(err);
//             res.json({
//                 status: "FAILED",
//                 message: "An error occurred while checking for existing plans!"
//             })
//         })
//     } catch (error) {
//         console.error('Error finding user:', error);
//         res.status(500).json({
//             status: "FAILED",
//             message: "An error occurred!"
//         });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Plans = require('./../models/Plans');
const User = require('./../models/User');
const bcrypt = require('bcrypt');

router.post('/plans', async (req, res) => {
    console.log('Request Body:', req.body);

    let { tripName, province, category, startDate, endDate, isPublic, tripMembers, userID } = req.body;
    console.log('Variables Before Assignments:', { tripName, province, category, startDate, endDate, isPublic, tripMembers, userID });

    tripName = tripName.trim();
    province = province.trim();
    category = category.trim();
    
    try {
        console.log('Finding user with userId:', userID);

        const user = await User.findById(userID);
        console.log('User found:', user);

        console.log('Variables After Assignments:', { tripName, province, category, startDate, endDate, isPublic, tripMembers, user });

        if (!user) {
            return res.status(400).json({
                status: "FAILED",
                message: "User not found!"
            });
        }

        // Validation logic...
        if (tripName == "" || province == "" || category == "" || startDate == "" || endDate == "" || tripMembers == "" || !user) {
            return res.json({
                status: "FAILED",
                message: "Empty input fields or invalid user!"
            });
        } else if (!/^[a-zA-Z0-9ก-๙ ]*$/.test(tripName)){
            return res.json({
                status: "FAILED",
                message: "Invalid Trip name entered"
            })
        } else if (!/^[ก-๙ ]*$/.test(province)){
            return res.json({
                status: "FAILED",
                message: "Invalid province entered"
            })
        } else if (!/^[a-zA-Zก-๙ ]*$/.test(category)){
            return res.json({
                status: "FAILED",
                message: "Invalid category entered"
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
        const existingPlan = await Plans.findOne({ tripName });
        if (existingPlan) {
            return res.json({
                status: "FAILED",
                message: "This trip name has been used"
            });
        }

        const newPlan = new Plans({
            tripName,
            province,
            category,
            startDate,
            endDate,
            isPublic,
            tripMembers,
            userID,
            user: {
                _id: user._id,
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
        console.error('Error finding user:', error);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred!"
        });
    }
});

router.get('/plans/:user_id', async (req, res) => {
    // Retrieve user_id from request parameters
    const user_id = req.params.user_id;

    // Validate user_id as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        // Find plans associated with the user ID
        const plans = await Plans.find({ userID: user_id });

        if (!plans) {
            return res.status(404).json({ error: 'No plans found for the specified user ID' });
        }

        // Extract trip names from the found plans
        const tripDetails = plans.map(plan => ({
            tripName: plan.tripName,
            startDate: plan.startDate,
            endDate: plan.endDate,
            province: plan.province,
            category: plan.category
        }));


        res.status(200).json({ tripDetails });
    } catch (error) {
        console.error('Error getting trip details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }    
});

module.exports = router;