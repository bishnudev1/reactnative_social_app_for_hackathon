const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../utils/Schema');
const Profile = require('../utils/ProfileSchema');
const { jwtkey } = require('../keys');

router.use(cors());

router.get('/get-users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

router.get('/get-profiles', async (req, res) => {
    const profiles = await Profile.find();
    res.send(profiles);
});

router.post('/register', async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        res.status(422).json({ warning: "fill the all details" });
    }
    const isExist = await User.findOne({ email: email });

    if (isExist) {
        res.status(422).json({ warning: 'user email already exists' });
    }

    try {
        const newuser = new User({ name, email, password, cpassword });
        res.status(201);
        await newuser.save();
    } catch (error) {
        console.log(error);
    }

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ warning: "fill the all details" });
    }

    const isExist = await User.findOne({ email: email });
    if (isExist) {
        if (isExist.email === email && isExist.password === password) {
            res.status(201)
            console.log(isExist._id);
            const token = jwt.sign({ userId: isExist._id }, jwtkey);
            console.log(token);
            res.send({ token });
        }
        else {
            res.status(422).json({ wrong: 'Wrong crediantials' });
        }
    }
    else {
        res.status(422).json({ wrong: 'User does not exist' });
    }
});

router.post('/add-profile', (req, res) => {
    const { name, job, work, residence } = req.body;

    if (!name || !job || !work || !residence) {
        res.status(422).json({ warning: "fill the all details" });
    }

    const newProfile = new Profile({ name, job, work, residence });
    newProfile.save().then(() => {
        res.status(201).json({ sucess: "profile added successfully" });
    }).catch(() => {
        res.status(404).json({ error: "failed to add your profile" });
    })
});


module.exports = router;