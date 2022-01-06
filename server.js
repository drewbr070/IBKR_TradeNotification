require('dotenv').config({ path: './config.env' });

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const twilio_client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const moment = require('moment');
const nodemailer = require('nodemailer');
const { Message } = require('twilio/lib/twiml/MessagingResponse');


// Express App 
const app = express();

// Basic Express App Setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/client'));
app.use(express.json());

// Handlers
app.listen(process.env.PORT, () => {
    console.info('Listening on port ' + process.env.PORT);
});
// Route for handling web client - should be able to ditch it at some point!
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html')
});

// Handle call from IMAP to trigger a new incoming Email
app.post('/new-email', (req, res) => {
    console.log('from app.post....');
    console.log(typeof (req.body));
    // parstToSMS(req.body);
    res.sendStatus(200);
});

/***
 * This is commented out but tested and will send SMS to number spedified in the config file
 */

// function sendSMS(smsbody) {
//     twilio_client.messages.create({
//         to: process.env.PHONE_NUMBER,
//         from: process.env.TWILIO_NUMBER,
//         body: smsbody,
//     },
//         (err, message) => {
//             if (err)
//                 console.log("Error sending SMS:" + err);
//         });
// }

// function parstToSMS(emailObject) {
//     const maxChars = 1500; //Changed to 1500 because of Twilio's injection into free accounts - move it up to 1600 later'
//     const formattedDate = moment(emailObject.date).format('ddd,MMM Do YYYY,h:m A');
//     let messageBody = emailObject.message;

//     const smsBodyHeader = 'New email from:${emailObject.from}, at ${formattedDate}.\nSub$ {emailObject.subject}\nAttachments: ${emailObject.attachments}\n';
//     let sms = smsBodyHeader + messageBody;

//     // Helpers
//     let availableChars = maxChars - smsBodyHeader.length;
//     const continueMsg = "\nContinued in Next SMS. - Number ";

//     if (messageBody.length > availableChars) {
//         console.info("HUGE EMAIL DETECTED - splitting up to save us.");
//         let counter = 1;
//         availableChars -= (continueMsg.length + 2); // + 2 fro the SMS Number place holder
//         while (messageBody.length > 0) {
//             console.info('Sending remaing chunks of size:' + availableChars);
//             if (counter == 1) {
//                 sms = smsBodyHeader + messageBody.substring(0, availableChars) + continueMsg + counter;
//                 availableChars += smsBodyHeader.length // No mmore headers in susequent SMSes
//             }
//             else if (messageBody.length <= availableChars)
//                 sms = messageBody;
//             else
//                 sms = messageBody.substring(0, availableChars) + continueMsg + counter;
//             messageBody = messageBody.substring(0, availableChars, messageBody.length);
//             sendSMS(sms);
//             counter += 1;
//         }
//     } else {
//         sendSMS(sms);
//     }
//     console.info('Done Sending!.');
// }


