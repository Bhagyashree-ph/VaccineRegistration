const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Adjust the number of salt rounds as needed
const { validationResult } = require('express-validator');


// Connect to your MongoDB instance (replace 'your_mongodb_uri' with your MongoDB connection URI)
mongoose.connect('mongodb+srv://bhagyashreeph12:Bhagya12123@cluster0.1tuizwc.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Mongoose models for users and slots
const User = mongoose.model('User', {
    name: String,
    phone: String,
    password: String,
    age: Number,
    pincode: String,
    aadharNo: String,
    // Add other user fields as needed
});

const Slot = mongoose.model('Slot', {
    user: String, // User's phone number
    dose: Number, // 1 for first dose, 2 for second dose
    date: String,
    time: String,
});

const users = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML, CSS, and JavaScript files
app.use(express.static(__dirname));

// Registration endpoint (POST request)
app.post('/register', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, phone, password, age, pincode, aadharNo } = req.body;

    try {
        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({ name, phone, password: hashedPassword, age, pincode, aadharNo });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'User registration failed' });
    }
});


    
// Add a user for demonstration purposes
users.push({
    name: 'Demo User',
    phone: '1234567890',
    password: 'password123', // Hashed password in a real-world scenario
});

// Handle user login
// Login endpoint (POST request)
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone, password });
        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});


const Appointment = mongoose.model('Appointment', {
    user: String,
    dose: Number,
    date: String,
    time: String,
});

const VaccinationStatus = mongoose.model('VaccinationStatus', {
    user: String,
    doses: {
        dose1: String,
        dose2: String,
    },
});

app.post('/schedule', async (req, res) => {
    const { user, dose, date, time } = req.body;

    // You should implement validation and authorization checks here
    if (!user || !dose || !date || !time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const appointment = new Appointment({ user, dose, date, time });
        await appointment.save();
        res.status(201).json({ message: 'Appointment scheduled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to schedule the appointment' });
    }
});

app.put('/update', async (req, res) => {
    const { user, dose, date, time } = req.body;

    // You should implement validation and authorization checks here
    if (!user || !dose || !date || !time) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const updatedAppointment = await Appointment.findOneAndUpdate(
            { user, date, time },
            { dose },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the appointment' });
    }
});

app.put('/vaccinated', async (req, res) => {
    const { user, dose, date } = req.body;

    // You should implement validation and authorization checks here
    if (!user || !dose || !date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        let vaccinationRecord = await VaccinationStatus.findOne({ user });

        if (!vaccinationRecord) {
            vaccinationRecord = new VaccinationStatus({
                user,
                doses: {},
            });
        }

        vaccinationRecord.doses[`dose${dose}`] = date;
        await vaccinationRecord.save();

        res.status(200).json({ message: 'Marked as vaccinated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark as vaccinated' });
    }
});



// Get total users endpoint (GET request)
app.get('/getTotalUsers', async (req, res) => {
    if (adminLoggedIn) {
        try {
            const totalUsers = await User.countDocuments();
            res.status(200).json({ totalUsers });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve total users' });
        }
    } else {
        res.status(403).json({ error: 'Admin login required' });
    }
});;

module.exports = app;
// Filter users by age endpoint (GET request)
app.get('/filterUsersByAge', async (req, res) => {
    if (adminLoggedIn) {
        const { minAge, maxAge } = req.query;

        if (!minAge || !maxAge) {
            return res.status(400).json({ error: 'Age range is required.' });
        }

        try {
            const filteredUsers = await User.find({ age: { $gte: minAge, $lte: maxAge } });
            res.status(200).json({ filteredUsers });
        } catch (error) {
            res.status(500).json({ error: 'Failed to filter users by age' });
        }
    } else {
        res.status(403).json({ error: 'Admin login required' });
    }
});

// Filter users by pincode endpoint (GET request)
app.get('/filterUsersByPincode', async (req, res) => {
    if (adminLoggedIn) {
        const pincode = req.query.pincode;

        if (!pincode) {
            return res.status(400).json({ error: 'Pincode is required.' });
        }

        try {
            const filteredUsers = await User.find({ pincode });
            res.status(200).json({ filteredUsers });
        } catch (error) {
            res.status(500).json({ error: 'Failed to filter users by pincode' });
        }
    } else {
        res.status(403).json({ error: 'Admin login required' });
    }
});

// Get registered slots endpoint (GET request)
app.get('/getRegisteredSlots', async (req, res) => {
    if (adminLoggedIn) {
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({ error: 'Date is required.' });
        }

        try {
            const registeredSlots = await Slot.find({ date });
            res.status(200).json({ registeredSlots });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve registered slots' });
        }
    } else {
        res.status(403).json({ error: 'Admin login required' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
