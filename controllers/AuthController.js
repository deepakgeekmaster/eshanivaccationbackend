const User = require('../models/User');
const passport = require("../passport");

exports.signup = async (req, res) => {
    const { email, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const user = new User({ email, phone, password });
        await user.save();
        req.session.userId = user._id; 

        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/' }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(400).json({ error: 'Google authentication failed' });
        }

        let existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            const newUser = new User({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                googleId: user.id,  
                profilePic: user.profilePic,
                phone: user.phone || '', 
                password: '',  
            });
            existingUser = await newUser.save();
        }

        req.login(existingUser, (err) => {
            if (err) {
                return next(err);
            }
            req.session.userId = existingUser._id; 

            return res.redirect('http://eshanivacationhome.com'); 
        });
    })(req, res, next);
};

exports.getUserProfile = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: 'Internal server error' });
    }
};

