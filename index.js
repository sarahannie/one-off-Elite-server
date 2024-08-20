require('dotenv').config();
const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Set up CORS with the specified options
const corsOptions = {
    origin: '*',
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define a Mongoose schema and model for storing appointment data
const appointmentSchema = new mongoose.Schema({
    gname: String,
    gmail: String,
    phone: String,
    address: String,
    service: String,
    message: String,
    whereHeard: String,
    adequateInsurance: String,
    retirementPlan: String,
    reasonForInsurance: String,
    productEducation: String,
    retirementChoice: String,
    taxPreference: String,
    maritalStatus: String,
    employmentStatus: String,
    additionalInfo: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Configure Nodemailer using environment variables
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service
    auth: {
        user: process.env.EMAIL_USER, // Use the email user from the .env file
        pass: process.env.EMAIL_PASS  // Use the email password from the .env file
    }
});

app.post('/send-email', async (req, res) => {
    const {
        gname, gmail, phone, address, service, message,
        whereHeard, adequateInsurance, retirementPlan, reasonForInsurance,
        productEducation, retirementChoice, taxPreference, maritalStatus,
        employmentStatus, additionalInfo
    } = req.body;

    // Save the appointment data to MongoDB
    const newAppointment = new Appointment({
        gname, gmail, phone, address, service, message,
        whereHeard, adequateInsurance, retirementPlan, reasonForInsurance,
        productEducation, retirementChoice, taxPreference, maritalStatus,
        employmentStatus, additionalInfo
    });

    try {
        await newAppointment.save(); // Save to MongoDB

        // Construct the email content
        const mailOptions = {
            from: gmail,
            to: 'sarahndianekwu@gmail.com', 
            subject: 'New Appointment Request',
            text: `
                Name: ${gname}
                Email: ${gmail}
                Phone: ${phone}
                Address: ${address}
                Service: ${service}
                Message: ${message}
                Where Heard: ${whereHeard}
                Adequate Insurance: ${adequateInsurance}
                Retirement Plan: ${retirementPlan}
                Reason for Insurance: ${reasonForInsurance}
                Product Education: ${productEducation}
                Retirement Choice: ${retirementChoice}
                Tax Preference: ${taxPreference}
                Marital Status: ${maritalStatus}
                Employment Status: ${employmentStatus}
                Additional Info: ${additionalInfo}
            `
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).send('Appointment has been successfully booked! We will get in touch soon 😊.');
            }
        });

    } catch (error) {
        console.log('Error saving appointment:', error);
        res.status(500).send('Error booking appointment');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
