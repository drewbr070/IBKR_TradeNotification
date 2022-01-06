require('dotenv').config({ path: './config.env' });

const request = require('request')
const notifier = require('mail-notifier');
const TradeNotice = require('./TradeNotice');
const tradeNotice = new TradeNotice();

const imap = {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASS,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 50000
};

notifier(imap).on('mail', mail => {
    const mailObject = {
        from: mail.from[0].address,
        name: mail.from[0].name,
        date: mail.recievedDate,
        subject: mail.subject ? mail.subject : 'No Subject',
        message: mail.text && mail.text.replace(/\s/g, '').length > 0 ? mail.text : 'No Message Body',
        // attachments: mail.attachments ? mail.attachments.map(value => value.fileName).join(' ') : 'None',
    };
    request.post(process.env.WEBHOOK_TARGET).form(mailObject);
    console.info("New Mail Recieved");
    if (mail.from[0].address === process.env.AUTH_SENDER &&
        mail.subject.endsWith(process.env.AUTH_ACCOUNT)) {
        tradeNotice(mail).prnt()
    }

}).start()











