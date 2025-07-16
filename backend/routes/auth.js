const mongoose = require("mongoose");
const User = require('../models/User'); // Assuming User model is in ../models/User.js
const Portfolio = require('../models/Portfolio'); // Assuming Portfolio model is in ../models/Portfolio.js
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser'); // Assuming fetchuser middleware is in ../middleware/fetchuser.js

const JWT_SECRET = 'Bennyi$ag00dguy'; // It's recommended to store this in an environment variable

const router = require('express').Router(); // Initialize router here

// --- Mongoose Schemas (Included for completeness, assuming they are in separate files) ---
// Portfolio Schema (from models/Portfolio.js)
// const PortfolioSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//   name: { type: String, required: true },
//   email: { type: String },
//   phone: { type: String },
//   summary: { type: String },
//   skills: [String],
//   achievements: [String],
//   projects: [
//     {
//       title: String,
//       description: String,
//       link: String
//     }
//   ],
//   education: [
//     {
//       degree: String,
//       institution: String,
//       year: String
//     }
//   ],
//   experience: [
//     {
//       company: String,
//       title: String,
//       duration: String,
//       description: String
//     }
//   ],
//   createdAt: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model("Portfolio", PortfolioSchema);

// User Schema (from models/User.js)
// const UserSchema = new mongoose.Schema({
//   name:     { type: String, required: true },
//   email:    { type: String, required: true, unique: true }, // Added unique constraint for email
//   password: { type: String, required: true }, // Password should be required
//   createdAt:{ type: Date, default: Date.now }
// });
// module.exports = mongoose.model("User", UserSchema);

// fetchuser middleware (from middleware/fetchuser.js)
// const fetchuser = (req, res, next) => {
//     const token = req.header('auth-token');
//     if (!token) {
//         return res.status(401).send({ error: "Please authenticate using a valid token" });
//     }
//     try {
//         const data = jwt.verify(token, JWT_SECRET);
//         req.user = data.user;
//         next();
//     } catch (error) {
//         res.status(401).send({ error: "Please authenticate using a valid token" });
//     }
// };
// module.exports = fetchuser;


// Route 1: Create a new user - POST /api/auth/createuser
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must contain at least 5 characters').isLength({ min: 3 }),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if a user with the same email already exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry, a user with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        });

        // Create JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log("New user created, auth token:", authtoken); // Log token for debugging

        res.status(201).json({ authtoken }); // Use 201 for resource creation
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 2: Login a user - POST /api/auth/login
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        // Create JWT token
        const data = {
            user: {
                id: user.id
            }
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        console.log("User logged in, auth token:", authtoken); // Log token for debugging
        res.json({ authtoken });

    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 3: Get logged-in user details - POST /api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error getting user details:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 4: Save/Update user portfolio - POST /api/auth/portfolio
// This route will create a new portfolio or update an existing one for the authenticated user.
router.post('/portfolio', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from the authenticated token
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found in token' });
        }

        const portfolioData = { ...req.body }; // Get portfolio data from request body

        // Find a portfolio by userId and update it, or create if it doesn't exist (upsert)
        const portfolio = await Portfolio.findOneAndUpdate(
            { userId: userId }, // Query: find by userId
            { $set: portfolioData }, // Update: set the new portfolio data
            { new: true, upsert: true, runValidators: true } // Options: return new doc, create if not exists, run schema validators
        );

        res.status(200).json(portfolio); // Use 200 OK for updates/upserts
    } catch (err) {
        console.error("Error saving/updating portfolio:", err);
        res.status(500).send('Server error');
    }
});


// Route 5: Get portfolio details for the authenticated user - GET /api/auth/myportfolio
// This route requires authentication using the 'fetchuser' middleware.
router.get('/myportfolio', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from the authenticated token
        if (!userId) {
            return res.status(400).json({ error: 'User ID not found in token' });
        }

        const portfolio = await Portfolio.findOne({ userId: userId });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found for this user.' });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Error fetching authenticated user's portfolio:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 6: Get portfolio details by specific userId (publicly accessible) - GET /api/auth/portfolio/:userId
// This route does NOT require authentication.
router.get('/portfolio/:userId', async (req, res) => {
    try {
        const targetUserId = req.params.userId; // Get userId from URL parameters

        // Validate if targetUserId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ error: "Invalid User ID format." });
        }

        // Convert the string userId to a Mongoose ObjectId instance for the query
        const objectId = new mongoose.Types.ObjectId(targetUserId);

        const portfolio = await Portfolio.findOne({ userId: objectId });

        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found for the given user ID.' });
        }

        res.status(200).json(portfolio);
    } catch (error) {
        console.error("Error fetching portfolio by user ID:", error.message);
        // Ensure error responses are JSON, even for 500 errors
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});


router.get('/cron/ping', async (req, res) => {
    console.log("Cron ping received at", new Date().toISOString());

    // Optional: do some periodic task
    // await performScheduledTasks();

    res.status(200).send('Cron job ping received');
});


module.exports = router;
