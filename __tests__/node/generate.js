const mod = require("../../app/generate").default;

it('random', () => {
    expect(mod()).not.toBe(mod());
})

it('string', ()=>{
    expect(typeof mod()).toBe("string");
})