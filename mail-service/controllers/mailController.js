const nodemailer = require('nodemailer');

// Function to send an email
function sendEmail(mailOptions) {
    var env_mail = process.env.SENDER_EMAIL;
    var env_password = process.env.SENDER_PASSWORD;
    // Configure the transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: env_mail,
            pass: env_password
        }
    });

    console.log('mailOptions:', mailOptions);

    // Sending the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

module.exports = { sendEmail };


