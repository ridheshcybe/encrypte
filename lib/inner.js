"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crypt = void 0;
const sizes = [16, 24, 32];
const rounds = [
    [10, 12, 14],
    [12, 12, 14],
    [14, 14, 14]
];
const rowshifts = [
    [0, 1, 2, 3],
    [0, 1, 2, 3],
    [0, 1, 3, 4]
];
const Sbox = new Array(99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22);
const ShiftRowTab = Array(3);
for (let i = 0; i < 3; i++) {
    ShiftRowTab[i] = Array(sizes[i]);
    for (let j = sizes[i]; j >= 0; j--)
        ShiftRowTab[i][j] = (j + (rowshifts[i][j & 3] << 2)) % sizes[i];
}
const Sbox_Inv = new Array(256);
for (let i = 0; i < 256; i++)
    Sbox_Inv[Sbox[i]] = i;
const ShiftRowTab_Inv = Array(3);
for (let i = 0; i < 3; i++) {
    ShiftRowTab_Inv[i] = Array(sizes[i]);
    for (let j = sizes[i]; j >= 0; j--)
        ShiftRowTab_Inv[i][ShiftRowTab[i][j]] = j;
}
const xtime = new Array(256);
for (let i = 0; i < 128; i++) {
    xtime[i] = i << 1;
    xtime[128 + i] = (i << 1) ^ 0x1b;
}
const expandKey = function (key) {
    const kl = key.length;
    let Rcon = 1;
    const ks = 15 << 5;
    const keyA = key.slice();
    for (let i = kl; i < ks; i += 4) {
        let temp = keyA.slice(i - 4, i);
        if (i % kl == 0) {
            temp = [Sbox[temp[1]] ^ Rcon, Sbox[temp[2]], Sbox[temp[3]], Sbox[temp[0]]];
            if ((Rcon <<= 1) >= 256) {
                Rcon ^= 0x11b;
            }
        }
        else if ((kl > 24) && (i % kl == 16)) {
            temp = [Sbox[temp[0]], Sbox[temp[1]], Sbox[temp[2]], Sbox[temp[3]]];
        }
        for (let j = 0; j < 4; j++) {
            keyA[i + j] = keyA[i + j - kl] ^ temp[j];
        }
    }
    return keyA;
};
const subBytes = function (state, sbox) {
    for (let i = state.length - 1; i >= 0; i--) {
        state[i] = sbox[state[i]];
    }
};
const addRoundKey = function (state, rkey) {
    for (let i = state.length - 1; i >= 0; i--) {
        state[i] ^= rkey[i];
    }
};
const shiftRows = function (state, shifttab) {
    const h = state.slice(0);
    for (let i = state.length - 1; i >= 0; i--) {
        state[i] = h[shifttab[i]];
    }
};
const mixColumns = function (state) {
    for (let i = state.length - 4; i >= 0; i -= 4) {
        const s0 = state[i + 0];
        const s1 = state[i + 1];
        const s2 = state[i + 2];
        const s3 = state[i + 3];
        const h = s0 ^ s1 ^ s2 ^ s3;
        state[i + 0] ^= h ^ xtime[s0 ^ s1];
        state[i + 1] ^= h ^ xtime[s1 ^ s2];
        state[i + 2] ^= h ^ xtime[s2 ^ s3];
        state[i + 3] ^= h ^ xtime[s3 ^ s0];
    }
};
const mixColumns_Inv = function (state) {
    for (let i = state.length - 4; i >= 0; i -= 4) {
        const s0 = state[i + 0];
        const s1 = state[i + 1];
        const s2 = state[i + 2];
        const s3 = state[i + 3];
        const h = s0 ^ s1 ^ s2 ^ s3;
        const xh = xtime[h];
        const h1 = xtime[xtime[xh ^ s0 ^ s2]] ^ h;
        const h2 = xtime[xtime[xh ^ s1 ^ s3]] ^ h;
        state[i + 0] ^= h1 ^ xtime[s0 ^ s1];
        state[i + 1] ^= h2 ^ xtime[s1 ^ s2];
        state[i + 2] ^= h1 ^ xtime[s2 ^ s3];
        state[i + 3] ^= h2 ^ xtime[s3 ^ s0];
    }
};
const cryptR = function (block, key, encrypt) {
    const bB = block.length;
    const kB = key.length;
    let bBi = 0;
    let kBi = 0;
    switch (bB) {
        case 32: bBi++;
        case 24: bBi++;
        case 16: break;
        default: return new Error(`Rijndael: Unsupported block size: ${block.length}`);
    }
    switch (kB) {
        case 32: kBi++;
        case 24: kBi++;
        case 16: break;
        default: return new Error(`Rijndael: Unsupported key size: ${key.length}`);
    }
    const r = rounds[bBi][kBi];
    key = expandKey(key);
    const end = r * bB;
    if (encrypt) {
        addRoundKey(block, key.slice(0, bB));
        const SRT = ShiftRowTab[bBi];
        ;
        let i = 0;
        for (i = bB; i < end; i += bB) {
            subBytes(block, Sbox);
            shiftRows(block, SRT);
            mixColumns(block);
            addRoundKey(block, key.slice(i, i + bB));
        }
        subBytes(block, Sbox);
        shiftRows(block, SRT);
        addRoundKey(block, key.slice(i, i + bB));
    }
    else {
        addRoundKey(block, key.slice(end, end + bB));
        const SRT = ShiftRowTab_Inv[bBi];
        shiftRows(block, SRT);
        subBytes(block, Sbox_Inv);
        for (let i = end - bB; i >= bB; i -= bB) {
            addRoundKey(block, key.slice(i, i + bB));
            mixColumns_Inv(block);
            shiftRows(block, SRT);
            subBytes(block, Sbox_Inv);
        }
        addRoundKey(block, key.slice(0, bB));
    }
};
const rijndaelCipher = function (block, key, encrypt) {
    if (encrypt) {
        cryptR(block, key, true);
    }
    else {
        cryptR(block, key, false);
    }
    return block;
};
function crypt(encrypt, Text, Key, IV) {
    if (!Text)
        return new Error("Text cannot be empty");
    if (!encrypt) {
        if (!Text.includes("(IVSPLIT)"))
            return new Error("IV SHOULD BE INCLUDED");
        [Text, IV] = Text.split("(IVSPLIT)");
    }
    const text = Text.split("").map(e => (e).charCodeAt(0));
    const key = Key.split("").map(e => e.charCodeAt(0));
    if (!IV)
        return new Error('JS-Rijndael crypt: IV is required for mode cbc');
    if (IV.length != 32)
        return new Error('JS-Rijndael crypt: IV must be 32 bytes long for 256 encryption Got:' + JSON.stringify({ Len: IV.length, iv: IV }));
    let iv = IV.slice().split("").map(e => (e).charCodeAt(0));
    const chunkS = 32;
    const chunks = Math.ceil(text.length / chunkS);
    while (text.length < chunks * chunkS) {
        text.push(0);
    }
    const out = [];
    if (encrypt) {
        for (let i = 0; i < chunks; i++) {
            for (let j = 0; j < chunkS; j++) {
                iv[j] = text[(i * chunkS) + j] ^ iv[j];
            }
            rijndaelCipher(iv, key, true);
            for (let j = 0; j < chunkS; j++) {
                out.push(iv[j]);
            }
        }
    }
    else {
        for (let i = 0; i < chunks; i++) {
            const temp = iv;
            iv = new Array(chunkS);
            for (let j = 0; j < chunkS; j++) {
                iv[j] = text[(i * chunkS) + j];
            }
            const decr = iv.slice(0);
            rijndaelCipher(decr, key, false);
            for (let j = 0; j < chunkS; j++) {
                out.push(temp[j] ^ decr[j]);
            }
        }
        let last;
        do {
            last = out.pop();
        } while (last == 0);
        out.push(last);
    }
    const outte = out.map(e => String.fromCharCode(e)).join("");
    const trueout = (encrypt) ? `${outte}(IVSPLIT)${IV}` : outte;
    return trueout;
}
exports.crypt = crypt;
;
class AesCtr {
    pass;
    constructor(password) {
        if (!password)
            throw new Error('No password');
        if (typeof password !== "string")
            throw new Error('Not string password');
        this.pass = password;
    }
    encrypt(plaintext, IV) {
        return crypt(true, plaintext, this.pass, IV);
    }
    decrypt(ciphertext, IV) {
        return crypt(false, ciphertext, this.pass, IV);
    }
}
exports.default = AesCtr;
