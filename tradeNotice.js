
const shareKeys = ["action", "position", "tckr", "void", "price", "account"];
const optionKeys = ["action", "position", "tckr", "expiry", "position", "call_put", "exchange", "void", "price", "account"];

function redisPost(mail) {
    const json = contractType(mail);
    console.log(json);
};

function contractType(mail) {
    const v = mail.subject.split(' ');
    if (v[5] === 'PUT' || v[5] === 'CALL') {
        return jsonPayload("Option", optionKeys, v);
    }
    else {
        return jsonPayload("Share", shareKeys, v);
    }
}

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







