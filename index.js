const jazz = require("./jazz");

/* 
    do JAZZ lexing
    do selector lexing

    JAZZ color: #ff5a8f
    from color-mix(in lch, #f0db4f, #2862e9)
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

    .test {
        color: yellow;

        .google {
            background: red;
        }
    }
}

.classsel   {
    border: 2px dotted grey;
    background: purple;

    .pip {
        background: black;

        div:hover {
            backgroung: blue;
        }

        p {
            border: red solid 20px;
        }
    }
}
`;

console.clear();
console.log("\n".repeat(20));

const jazzCompiler = new jazz(jazzCode);
const compiledCode = jazzCompiler.compile();

const util = require('util')

//console.log("Tokens: ", jazzCompiler.tokens);

//console.log("Parsed: ", util.inspect(compiledCode, {showHidden: false, depth: null, colors: true}));

const fs = require('fs');
const CircularJSON = require('circular-json');

const jsonContent = CircularJSON.stringify(compiledCode, null, 4);
const jsonContent2 = CircularJSON.stringify(jazzCompiler.tokens, null, 4);

// Escrevendo no arquivo
fs.writeFileSync('output.json', jsonContent);
fs.writeFileSync('tokens.json', jsonContent2);
