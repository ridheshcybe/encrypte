"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const crypto_1 = require("crypto");
function generate() {
    let randomIndex;
    let randomBytes;
    const getNextRandomValue = () => {
        (void 0 === randomIndex || randomIndex >= randomBytes.length) &&
            ((randomIndex = 0), (randomBytes = (0, crypto_1.randomBytes)(256)));
        var n = randomBytes[randomIndex];
        return (randomIndex += 1), n;
    };
    let pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
    var password = "";
    for (var i = 0; i < 20; i++) {
        password +=
            pool[(() => {
                var rand = getNextRandomValue();
                while (rand >= 256 - (256 % pool.length)) {
                    rand = getNextRandomValue();
                }
                return rand % pool.length;
            })()];
    }
    return password;
}
exports.generate = generate;
exports.default = generate;
