require('dotenv').config();
const cors = require('cors');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


const corsOptions = {
    origin: 'https://one-off-elite.vercel.app',
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type'],
}; 

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Nodemailer with environment variables
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service
    auth: {
        user: process.env.EMAIL_USER, // Use the email user from the .env file
        pass: process.env.EMAIL_PASS  // Use the email password from the .env file
    }
});

app.post('/send-email', (req, res) => {
    const { gname, gmail, phone, service, message } = req.body;

    const mailOptions = {
        from: gmail,
        to: 'sarahndianekwu@gmail.com', 
        subject: 'New Appointment Request',
        text: `Name: ${gname}\n Email: ${gmail}\n Phone: ${phone}\nService: ${service}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send(`Appointment has been Succesfully Booking😍\n we will get in touch soon😊`);
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});