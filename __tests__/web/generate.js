const mod = require("../../web/generate").default;

// web crypto implementation
globalThis.crypto = {};
globalThis.crypto.getRandomValues = ()=>[Math.floor(Math.random() * 100)];

it('random', () => {
    expect(mod()).not.toBe(mod());
})

it('string', ()=>{
    expect(typeof mod()).toBe("string");
})