const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendEmail } = require('../controllers/mailController');
const queueNames = require('../common-modules/messageQueueNames');

// This callback function will process messages received from the queue.
function sendUserCreatedEmail(message) {
    try {
        const messageContent = JSON.parse(message);
        console.log('Processing message for email sending:', messageContent);
        var mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: messageContent.email,
            subject: "Je hebt een account!",
            text: `Hallo ${messageContent.username}, je hebt een account aangemaakt!`
        };

        console.log('mailOptions.to:', mailOptions.to);

        sendEmail(mailOptions);
    } catch (error) {
        console.error('Failed to process message for email sending:', error);
    }
}

function sendScoresMail(message) {
    // send an email to each email in the list with their score
    const messageContent = JSON.parse(message);
    for (let email of messageContent.emails) {
        var mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Je hebt een score!",
            text: `Hallo, je hebt een score van ${messageContent.shots[0].score} behaald!`
        };

        console.log('mailOptions.to:', mailOptions.to);

        sendEmail(mailOptions);
    }
}


function start() {
    setInterval(() => {
        consumeMessageFromQueue('userCreate', sendUserCreatedEmail);
        consumeMessageFromQueue('sendScoresMail', sendScoresMail);
        console.log('Consuming messages from the queue:', queueNames.userCreate);
    }, 10000);
}

module.exports = { start };