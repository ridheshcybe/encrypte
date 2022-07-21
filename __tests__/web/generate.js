const mod = require("../../web/generate").default;

// web alternative
globalThis.crypto.getRandomValues = Math.random;

it('random', () => {
    expect(mod()).not.toBe(mod());
})

it('string', ()=>{
    expect(typeof mod()).toBe("string");
})