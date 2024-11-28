const express = require('express');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config()

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

// Set up SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465, // Use 465 for SSL
    secure: true, // Use true for 465, false for 587
    auth: {
        user: process.env.USER, // Your email
        pass: process.env.PASS, // Your email password
    },
});

app.post('/send-email', (req, res) => {
    const { name, email,phone, message } = req.body;

    const mailOptions = {
        from: process.env.FROM,
        to: process.env.TO, // Receiver's email
        subject: `Message from Visitor on SKMCH`,
        text: "Name: "+name+"\nEmail: "+email+"\nPhone:"+phone+"\nMessage: "+message+"\n\nDate: "+new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })+"\nTime: "+new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.status(200).send('Email sent: ' + info.response);
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
