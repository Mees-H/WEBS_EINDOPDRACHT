const { consumeMessageFromQueue } = require('../common-modules/messageQueueService');
const { sendEmail } = require('../controllers/mailController');
const queueNames = require('../common-modules/messageQueueNames');

// This callback function will process messages received from the queue.
async function sendUserCreatedEmail(message) {
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

async function sendScoresMail(message) {
    // send an email to each email in the list with their score
    const messageContent = JSON.parse(message);
    if (messageContent.emails && messageContent.emails.length > 0) {
        // Group shots by shooterId
        const shotsByShooter = messageContent.shots.reduce((acc, shot) => {
            acc[shot.shooterId] = acc[shot.shooterId] || [];
            acc[shot.shooterId].push(shot);
            return acc;
        }, {});

        // Find the highest score for each shooter
        const highestScoresByShooter = {};
        for (let shooterId in shotsByShooter) {
            highestScoresByShooter[shooterId] = shotsByShooter[shooterId].reduce((highestScore, shot) => {
                return shot.score > highestScore.score ? shot : highestScore;
            });
        }

        // Send an email to each shooter with their highest score
        for (let i = 0; i < messageContent.emails.length; i++) {
            let email = messageContent.emails[i];
            let shooterId = messageContent.shots[i].shooterId;
            let highestScoreShot = highestScoresByShooter[shooterId];

            let score = highestScoreShot.score;
            let subject = "Je hebt een score!";
            let text = `Hallo, je hebt een score van ${score} behaald!`;
            if (highestScoreShot === getHighestScoreShot(messageContent.shots)) {
                subject = "Gefeliciteerd! Je hebt de hoogste score!";
                text = `Hallo, je hebt de hoogste score van ${score} behaald!`;
            }
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: subject,
                html: `<p>${text}</p></br><p>Target foto:</p><img src="${messageContent.target.imageUrl}" alt="target image" style="width: 200px; height: 200px;"/> </br> <p>Sharpshooter foto:</p><img src="${highestScoreShot.imageUrl}" alt="shot image" style="width: 200px; height: 200px;"/>`
            };

            console.log('mailOptions.to:', mailOptions.to);

            sendEmail(mailOptions);
        }
    }

    let htmlContent = ['Hallo, je target is beoordeeld! Bekijk de scores van de sharpshooters:'];

    for (let shots of messageContent.shots) {
        htmlContent.push(`<p>Sharpshooter score: ${shots.score}</p></br><p>Sharpshooter foto:</p><img src="${shots.imageUrl}" alt="shot image" style="width: 200px; height: 200px;"/></br>`);
    }
    console.log("Owner Email:", messageContent.ownerEmail);
    console.log("Shots:", messageContent.shots);   
    if (messageContent.ownerEmail) {
        const mailOptionsTarget = {
            from: process.env.SENDER_EMAIL,
            to: messageContent.ownerEmail,
            subject: "Je target is beoordeeld!",
            html: htmlContent.join(''),
        };
        console.log('mailOptions.to:', mailOptionsTarget.to);
        sendEmail(mailOptionsTarget);
    }
}

// get the highest score of the shots
function getHighestScoreShot(shots) {
    let highestScoreShot = null;
    let highestScore = 0;
    for (let shot of shots) {
        // the lower the score the better, make a formula for that
        if (shot.score === 0) {
            continue;
        }
        if (shot.score > highestScore) {
            highestScore = shot.score;
            highestScoreShot = shot;
        }
    }
    return highestScoreShot;
}

function start() {
    setInterval(() => {
        consumeMessageFromQueue('userCreate', sendUserCreatedEmail);
        consumeMessageFromQueue('sendScoresMail', sendScoresMail);
        console.log('Consuming messages from the queue:', queueNames.userCreate);
    }, 10000);
}

module.exports = { start };