// const mongoose = require('mongoose');
// const express = require('express');
// const router = express.Router();
//const bcrypt = require('bcrypt');
//const User = require('./../models/User');


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//mongodb user model
const User = require('./../models/User');

//Password handler 
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', (req, res) => {
    let {name, username, email, password} = req.body;
    name = name.trim();
    username = username.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || username == "" || email == "" || password == "") {
        res.json({
            status: "FAILED",
            message: "Empty input fields!"
        });
    } else if (!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })
    } else if (!/^[a-zA-Z0-9 ]*$/.test(username)){
        res.json({
            status: "FAILED",
            message: "Invalid username entered"
        })
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        })
    } else if (password.length < 8) {
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        })
    } else {
        //Checking if user already exists
        User.find({email}).then(result => {
            if(result.length) {
                // A user already exist
                res.json({
                    status: "FAILED",
                    message: "User with the provided email already exists"
                })
            } else {
                //Try to create new user

                //Password handler
                const saltRounds= 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        name,
                        username,
                        email,
                        password: hashedPassword
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "SUCCESS",
                            message: "Signup successful",
                            data: result,
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: "FAILED",
                            message: "An error occurred while saving user account!"
                        }) 
                    })
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while hashing password!"
                    })
                })
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!"
            })
        })
    }
})

router.get('/signup/:user_id', async (req, res) => {
    const user_id = req.params.user_id;

    // Validate user_id as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        // Find user data (exclude password)
        const userData = await User.findOne({ '_id': new mongoose.Types.ObjectId(user_id) }, { password: 0 }).exec();

        if (!userData) {
            return res.status(404).json({ error: 'No user found for the specified user ID' });
        }

        res.status(200).json({ username: userData.username });
    } catch (error) {
        console.error('Error getting username:', error);
        res.status(500).json({ error: 'Internal server error' });
    }    
});


//module.exports = router;

//Login
router.post('/login', (req, res) => {
    let {email, password} = req.body;
    email = email.trim();
    password = password.trim();

    if(email == "" || password == ""){
        res.json({
            status: "FAILED",
            message: "Empty credentials supplied"
        })
    } else{
        //Check if user exist
        User.find({email})
        .then(data => {
            if(data.length){
                //User exists

                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        //Password match
                        res.json({
                            status: "SUCCESS",
                            message: "Login Successful",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "FAILED",
                            message: "Invalid password entered!"
                        })
                    }
                })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occured while comparing password"
                    })
                })
            } else {
                res.json({
                    status: "FAILED",
                    message: "Invalid credentials entered!"
                })
            }
        })
        .catch(err => {
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user"
            })
        })
    }
})

module.exports = router;