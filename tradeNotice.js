

class TradeNotice {
    constructor(mail) {
        this.mail = mail;
    };

    prnt() {
        console.info("My new function ran and recieved: " + this.mail.subject)
    };
};






module.exports = TradeNotice;
