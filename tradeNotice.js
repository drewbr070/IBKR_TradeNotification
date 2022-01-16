const Redis = require("ioredis");
const redis = new Redis();
const channel = "drewtradingbro-transact";

const shareKeys = ["action", "position", "ticker", "void", "price", "account"];
const optionKeys = [
  "action",
  "position",
  "ticker",
  "expiry",
  "strike",
  "right",
  "exchange",
  "void",
  "price",
  "account",
];

// post transaction to redis
function redisPost(mail) {
  const json = contractType(mail);
  redis.publish(channel, json);
  console.log("Published %s to %s", json, channel);
}
// parse the mail subject to evaluate which contract dictionary to apply
function contractType(mail) {
  const v = mail.subject.split(" ");
  try {
    if (v[5] === "PUT" || v[5] === "CALL") {
      return jsonPayload("Option", optionKeys, v);
    } else {
      return jsonPayload("Stock", shareKeys, v);
    }
  } catch (ex) {
    console.log(ex.message);
  }
}
// prepare a json payload with the contact information
function jsonPayload(type, keys, v) {
  var obj = {};
  var obj = keys.map(function (k) {
    obj[String(k)] = v[keys.indexOf(k)];
    return obj;
  });
  obj = obj[0];
  obj.position = filterInt(obj.position);
  if (!obj.position > 0) throw new Error('Could not parse integer for "postion" key.');
  obj.price = parseFloat(obj.price);
  if (isNaN(obj.price) || obj.price < 0) throw new Error('Could not parse flaot for "price" key.');
  obj.type = type;
  return (json = JSON.stringify(obj));
}

function filterInt(value) {
  if (/^[+]?(\d+|Infinity)$/.test(value) && Number(value) != 0) {
    return Number(value);
  } else {
    return NaN;
  }
}

module.exports = redisPost;
