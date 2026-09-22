const concept = `
// reserved words: css properties values, colors, etc
document.body.innerHTML = "..."; // on root pure js?

.test {
    console.log(this);
    const myColor = blue;

    color: myColor; // shared scope
    pointer-events: none;

    h1 {
        background: green;
    }
}
    

.test2 {
    let c = red;
    solo let c2 = randomColor();

    background: c; // all instances have the same color
    color: c2; // for solo variables -> each instance has a different color
}`;
const jazz = `.test {
    console.log(this);

    color: red;
    pointer-events: none;

    for(const index in this.children) {
        console.log(index, this.children[index]);
    }


    h1 {
        background: green;
    }
}`;


function tokenize(source) {
    const tokens = [];
    const operators = "+-*/%=!<>&|^~?:";
    
    let i = 0;

    while (i < source.length) {
        const char = source[i];

        if (/\s/.test(char)) {
            let value = "";

            while (i < source.length && /\s/.test(source[i])) {
                value += source[i++];
            }

            tokens.push({
                type: "whitespace",
                value
            });

            continue;
        }

        if ("{}():;.".includes(char)) {
            tokens.push({
                type: "special",
                value: char
            });

            i++;
            continue;
        }

        if (/[a-zA-Z_$]/.test(char)) {
            let value = "";

            while (/[a-zA-Z0-9_$]/.test(source[i])) {
                value += source[i++];
            }

            tokens.push({
                type: "word",
                value
            });

            continue;
        }

        if (operators.includes(char)) {
            tokens.push({
                type: "operator",
                value: char
            });

            i++;
            continue;
        }

        tokens.push({
            type: "unknown",
            value: char
        });

        i++;
    }

    return tokens;
}


const tags = [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "span",
    "div",
    "section",
    "article",
    "header",
    "footer",
    "main",
    "nav",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "button",
    "form",
]


function parse(tokens) {
    let position = 0;

    const current = () => tokens[position];

    const peek = (offset = 0) => tokens[position + offset];
    const peekWhile = (callback) => {
        let i = position;
        while (i < tokens.length && callback(tokens[i])) {
            i++;
        }
        return tokens[i];
    }
    const peekAfterWhite = () => peekWhile(token => token.type != "whitespace");

    const next = () => tokens[position++];
    const nextAcc = (offset = 0) => {
        position += offset;
        return tokens[position];
    }
    const nextWhile = (callback) => {
        while (current() && callback(current())) {
            next();
        }
    };
    const nextAfterWhite = () => nextWhile(token => token.type != "whitespace");
    const isSelector = () => [".", "#", "&"].some(k => current().value.startsWith(k)) ||
        (current().type == "word" && tags.includes(current().value));
    function parseRoot() {
        const root = {
            type: "Root",
            body: []
        };

        while (current()) {

            root.body.push(onRoot());
            //root.body.push(parseRule());
        }

        return root;
    }

    function onRoot() {
        const data = {

        }

        
        while (current()) {
            if(current().type == "whitespace") {
                next();
                continue;
            }

            if(isSelector()) {
                return parseJazzNode();
            }
        }
    }

    function selector() {
        const selector = [];

        while (current() && current().value !== "{") {
            if(current().type == "whitespace" && (!selector.at(-1) || selector.at(-1).type == "whitespace")) {
                next();
                continue;
            }

            if(current().type == "whitespace") {
                selector.push({
                    type: "whitespace",
                    value: " "
                });
                next();
                continue;
            }

            selector.push(next());
        }

        if (!current()) {
            throw new Error(`Expected "{" got ${current().value} instead`);
        }

        if(selector.at(-1).type == "whitespace") {
            selector.pop();
        }
        next();

        return selector;
    }

    function cssPropertyValue() {
        const data = [];

        while (current() && ![";", "}", "\n"].includes(current().value)) {
            data.push(next());
        }

        if (current()?.value === ";") {
            next();
        }

        return data;
        
    }
    function cssProperty() {
        if (current()?.type !== "word") {
            return false;
        }

        let i = position;
        let name = "";

        while (tokens[i]) {
            const token = tokens[i];

            if (token.type === "word") {
                name += token.value;
                i++;
                continue;
            }

            if (token.value === "-") {
                name += "-";
                i++;
                continue;
            }
            
            if (token.type === "whitespace") {
                while (tokens[i]?.type === "whitespace") {
                    i++;
                }

                if (tokens[i]?.value === ":") {
                    break;
                }

                return false;
            }


            if(token.value === ":") {
                break;
            }

            return false;
        }

        return {
            name,
            offset: i + 1 - position
        }
    }
    function parseJazzNode(obj = {}) {
        obj.isJazzNode = true;
        obj.selector = selector();
        obj.data = [];
        
        let depth = 1;

        while (current()) {

            if(!obj.data.at(-1)?.isJazzCode && current().type == "whitespace") {
                next();
                continue;
            }

            if(current().value == "{") {
                depth++;
                if(obj.data.at(-1)?.isJazzCode) {
                    obj.data.at(-1).data.push(next());
                } else {
                    obj.data.push(next());
                }
                continue;
            }

            if(current().value == "}") {
                depth--;
                if(obj.data.at(-1)?.isJazzCode) {
                    obj.data.at(-1).data.push(next());
                } else {
                    obj.data.push(next());
                }

                if(depth == 0) {
                    break;
                }
                continue;
            }

            const prop = cssProperty();
            if (prop?.offset) {
                const {name, offset} = prop;
                const cssProP = {
                    isCssProperty: true,
                    name,
                };
                nextAcc(offset);
                cssProP.value = cssPropertyValue();
                
                obj.data.push(cssProP);
                continue;
            }

            if(peek(-1).type !== "word" && isSelector()) {
                obj.data.push(parseJazzNode());
                continue;
            }

            if(!obj.data.at(-1)?.isJazzCode) {
                obj.data.push({
                    isJazzCode: true,
                    data: [next()]
                });
            } else {
                obj.data.at(-1).data.push(next());
            }
        }
        
        if (depth != 0) {
            throw new Error(`Expected '}' got '${current()?.value}' instead`);
        } else {
            obj.data.pop();
        }


        return obj;
    }

    return parseRoot();
}


let css = "";
let js = "";

const setJazzNode = (node, inRoot) => {
    const scope = {};
    const selector = node.selector.map(s => s.value).join("");
    css += selector + " {\n";
    js = `${!js?"document":"__jazzElement"}.querySelectorAll("${selector}").forEach(__jazzElement => {\n`;

    node.data.forEach(e => setObject(e, scope));

    css += "}\n";
    js += "})\n";
}
const setJazzProperty = (node, scope) => {
    const {name} = node;
    if(name == "this") console.warn("The 'this' keyword is not expected on CSS assignments");
    if(name == "parent") console.warn("The 'parent' keyword is not expected on CSS assignments");

    const value = node.value.map(e => e.value).join("");

    css += `${name}: ${value};\n`;
}
const setJazzCode = (node, scope) => {
    node.data.forEach(e => {
        if(e.value == "this") js += "__jazzElement";
        else if(e.value == "parent") js += "__jazzElement.parentElement";
        else js += e.value
    });
}

const setObject = (node, inRoot = true) => {
    if(node.isJazzNode) {
        return setJazzNode(node, inRoot);
    }

    if(node.isCssProperty) {
        return setJazzProperty(node);
    }

    if(node.isJazzCode) {
        return setJazzCode(node);
    }

}
const tempGen = (jazz) => {
    return {
        ...jazz,
        body: jazz.body.map(e => setObject(e, true))
    }
}



import fs from 'fs';
const jazzTokens = tokenize(jazz);
console.log(tempGen(parse(jazzTokens)));

if(1)
fs.writeFileSync('tokens2026.json', JSON.stringify(parse(jazzTokens), null, 4));