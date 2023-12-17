const jazz = require("./jazz");

/* 
    do JAZZ lexing
    do selector lexing
*/

const jazzCode = `
.myElement:mousemove {
    jazz: {
        set x = this.event.clientX + "px";
        set y = this.event.clientY + "px";

        clog("Mouse hovering: "+this.element.tagName+" in x: "+x+", y: "+y+"}"); // does console.log
    };

    border: 20px solid green;
    background: radial-gradient(50% at var(--x) var(--y), red, blue);
}
`;

console.clear();
console.log("\n".repeat(20));

const jazzCompiler = new jazz(jazzCode);
const compiledCode = jazzCompiler.compile();

const util = require('util')

console.log("Tokens: ", jazzCompiler.tokens);


console.log("Parsed: ", util.inspect(compiledCode, {showHidden: false, depth: null, colors: true}));