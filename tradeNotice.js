const Redis = require("ioredis");
const redis = new Redis();
const channel = 'drewtradingbro-transact';

const shareKeys = ["action", "position", "tckr", "void", "price", "account"];
const optionKeys = ["action", "position", "tckr", "expiry", "position", "call_put", "exchange", "void", "price", "account"];

// post transaction to redis
function redisPost(mail) {
    const json = contractType(mail);
    redis.publish(channel, json);
    console.log("Published %s to %s", json, channel);
};
// parse the mail subject to evaluate which contract dictionary to apply
function contractType(mail) {
    const v = mail.subject.split(' ');
    if (v[5] === 'PUT' || v[5] === 'CALL') {
        return jsonPayload("Option", optionKeys, v);
    }
    else {
        return jsonPayload("Share", shareKeys, v);
    }
}
// prepare a json payload with the contact information
function jsonPayload(type, keys, v) {
    var obj = {};
    var obj = keys.map(function (k) {
        obj[String(k)] = v[keys.indexOf(k)];
        return obj
    });
    obj = obj[0]
    obj.position = parseInt(obj.position);
    obj.price = parseFloat(obj.price);
    obj.type = type
    return json = JSON.stringify(obj);
}

module.exports = redisPost;


