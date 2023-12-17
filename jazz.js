const eventsCss = ['active', 'checked', 'default', 'disabled', 'empty', 'enabled', 'first', 'focus', 'hover', 'indeterminate', 'in-range', 'invalid', 'last', 'link', 'only-child', 'only-of-type', 'optional', 'out-of-range', 'read-only', 'read-write', 'required', 'root', 'target', 'valid', 'visited'];

const eventsJs = ['abort', 'afterprint', 'animationcancel', 'animationend', 'animationiteration', 'animationstart', 'appinstalled', 'audioend', 'audiostart', 'beforeinstallprompt', 'beforeprint', 'beforeunload', 'blocked', 'blur', 'cached', 'canplay', 'canplaythrough', 'change', 'chargingchange', 'chargingtimechange', 'checking', 'click', 'close', 'complete', 'contextmenu', 'cuechange', 'dblclick', 'devicechange', 'devicemotion', 'deviceorientation', 'deviceorientationabsolute', 'dischargingtimechange', 'DOMContentLoaded', 'downloading', 'drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended', 'error', 'fullscreenchange', 'fullscreenerror', 'gamepadconnected', 'gamepaddisconnected', 'gotpointercapture', 'hashchange', 'input', 'install', 'invalid', 'keydown', 'keypress', 'keyup', 'languagechange', 'levelchange', 'loadeddata', 'loadedmetadata', 'loadend', 'loadstart', 'message', 'messageerror', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'noupdate', 'obsolete', 'offline', 'online', 'open', 'orientationchange', 'pagehide', 'pageshow', 'paste', 'pause', 'pointercancel', 'pointerdown', 'pointerenter', 'pointerleave', 'pointerlockchange', 'pointerlockerror', 'pointermove', 'pointerout', 'pointerover', 'pointerup', 'play', 'playing', 'popstate', 'progress', 'ratechange', 'readystatechange', 'repeatEvent', 'reset', 'resize', 'resourcetimingbufferfull', 'result', 'resume', 'scroll', 'seeked', 'seeking', 'select', 'selectionchange', 'selectstart', 'show', 'slotchange', 'soundend', 'soundstart', 'speechend', 'speechstart', 'stalled', 'start', 'storage', 'submit', 'success', 'suspend', 'SVGAbort', 'SVGError', 'SVGLoad', 'SVGResize', 'SVGScroll', 'SVGUnload', 'SVGZoom', 'timeout', 'timeupdate', 'touchcancel', 'touchend', 'touchmove', 'touchstart', 'transitioncancel', 'transitionend', 'transitionrun', 'transitionstart', 'unload', 'updateready', 'upgradeneeded', 'userproximity', 'versionchange', 'visibilitychange', 'volumechange', 'waiting', 'wheel'];

const events = [...eventsCss, ...eventsJs];

class JazzCssLexer {
        constructor(input) {
        this.input = input;
        this.position = 0;
        this.tokens = [];
    }

    getNextToken() {
        const hexColor = /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/;
        const rgbColor = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*\d+(\.\d+)?)?\s*\)/;
        const hslColor = /hsla?\(\s*\d+(\.\d+)?\s*,\s*\d+(\.\d+)?%\s*,\s*\d+(\.\d+)?%\s*(,\s*\d+(\.\d+)?)?\s*\)/;
        const namedColor = /(?:aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)/;

        const patterns = [
            { type: 'JAZZ_KEYWORD', regex: /\b(?:jazz)\b/i },
            { type: 'BLOCK_OPEN', regex: /{/ },
            { type: 'BLOCK_CLOSE', regex: /}/ },
            { type: 'VALUE_OPEN', regex: /:/ },
            { type: 'VALUE_CLOSE', regex: /;/ },
            { type: 'COMMENT_SINGLE', regex: /\/\/.*/ },
            { type: 'COMMENT_MULTI', regex: /\/\*[\s\S]*?\*\// },
            
            //{ type: 'EVENT', regex: new RegExp(`:\\b(${events.join('|')})\\b`) },
            
            { type: 'SELECTOR', regex: /\s*([^\{\};]*[^\{\};:\s])\s*(?=\{)/ },

            { type: 'PROPERTY', regex: /[a-zA-Z-]+(?=\s*:)/ },
            { type: 'VALUE', regex: /[^;]+/ },
            
            { type: 'NUMBER', regex: /\d+(\.\d+)?/ },
            
            { type: 'COLOR', regex: new RegExp(`(?:${hexColor.source}|${rgbColor.source}|${hslColor.source}|${namedColor.source})`)},

            { type: 'FUNCTION', regex: /[a-zA-Z_]\w*\(/ },
            { type: 'IDENTIFIER', regex: /[a-zA-Z_]\w*/ },
            { type: 'MEDIA_QUERY', regex: /@media/ },
            { type: 'IMPORT', regex: /@import/ },
            { type: 'WHITESPACE', regex: /\s+/ },
        ];
        

        this.input = this.input.trimLeft();

        for (const { type, regex } of patterns) {
            const match = this.input.match(regex);

            if (match && match.index === 0) {
                const value = match[0];
                this.position += value.length;
                this.input = this.input.slice(value.length);

                // Ignorar espaços em branco após valores
                if (type !== 'WHITESPACE') {
                    this.input = this.input.trimLeft();
                }

                this.tokens.push({ type, value, index: this.tokens.length });
                return { type, value };
            }
        }

        // Token 'EOF'
        return { type: 'EOF', value: null };
    }

    tokenize() {
        let token;
        do {
            token = this.getNextToken();
        } while (token.type !== 'EOF');

        return this.tokens;
    }
}

class JazzCssParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.currentIndex = 0;
    }

    parse() {
        const statements = [];
        
        while (this.currentIndex < this.tokens.length) {
            const statement = this.parseStatement();
            

            if (statement) {
                statements.push(statement);
            }
        }

        return statements;
    }

    parseStatement() {
        let token = this.tokens[this.currentIndex];  

        console.log("\n");
        console.log("BEGIN PARSE STATEMENT: ", token);
        
        if (token.type === 'SELECTOR') {
            let returnObj = {
                selector: this.parseSelector().trimStart().trimEnd(),
                jazz: []
            };

            
            //const events = this.parseEvents();
            
            let block = this.parseBlock(returnObj);

            returnObj.properties = block.properties;
            returnObj.nested = block.nested;
            console.log(this.currentIndex);
/* 
            console.log("end: ",this.tokens[this.currentIndex], " of ", token);
            console.log("\n");   */
            
            console.log("\n");
            console.log("END PARSE STATEMENT: ", this.tokens[this.currentIndex], " of ", token.value);
            return returnObj;
        }

        // Avança para o próximo token se não for uma declaração válida
        this.currentIndex++;
        
        return null;
    }

    parseSelector() {
        const token = this.tokens[this.currentIndex];
        this.currentIndex++;
        return token.value;
    }

    parseEvents() {
        const eventsList= [];
        
        while (this.currentIndex < this.tokens.length) {
            const token = this.tokens[this.currentIndex];
            const { type } = token;
            
            
            if(type === 'EVENT'){
                eventsList.push(token.value);

            } else if(type === 'BLOCK_OPEN'){
                break;
            }

            this.currentIndex++;
        }

        return eventsList;
    }

    parseBlock(root) {
        const block = {
            nested: []
        };
        while (this.currentIndex < this.tokens.length) {
            const token = this.tokens[this.currentIndex];


            if (token.type === 'BLOCK_OPEN') {
                this.currentIndex++;
                block.properties = this.parseProperties(root, block);
            }

            this.currentIndex++;
            return block;
        }
        
        return block;
    }

    parseProperties(root, block) {
        const properties = [];

        while (this.currentIndex < this.tokens.length) {
            const token = this.tokens[this.currentIndex];
            const { type } = token;

            if (token.type === 'SELECTOR') console.log("\n");
            console.log("TOKEN: ",token);
            
            if (type === 'BLOCK_CLOSE') {
                console.log("BLOCK-CLOSE: ", this.currentIndex, " of ", root.selector);
                return properties;
            }
            
            if(token.type === 'SELECTOR') {
                console.log("BEG SEL: ", this.tokens[this.currentIndex]); 

                let nest = this.parseStatement();
                //nest.parent = root;
                block.nested.push(nest);
                console.log("END SEL: ", this.currentIndex, " of ", nest.selector); 
                console.log("\n"); 
                continue;     
            }

            if (['PROPERTY', 'JAZZ_KEYWORD'].includes(type)) {
                const key = token.value;
                this.currentIndex++; // Avança para o próximo token
                const value = this.parseValue();

                console.log({key, value}, " of ", root.selector );

                if(type === 'PROPERTY')
                    properties.push({
                        key,
                        value
                    });

                else if(type === 'JAZZ_KEYWORD')
                    root.jazz.push(value);

            } else {
                this.currentIndex++; // Avança para o próximo token
            }
        }
        return properties;
    }

    parseValue() {
        const token = this.tokens[this.currentIndex];
        this.currentIndex++;

        let blockOpen = false;
        let blockCounter = 0;
        let value = "";
        
        while (this.currentIndex < this.tokens.length) {
            const token = this.tokens[this.currentIndex];
            const { type } = token;
            
            if (type === 'VALUE_OPEN') {
                this.currentIndex++;
            }
            if (type === 'VALUE_CLOSE' && !blockOpen) {
                this.currentIndex++;
                return value;
            }
            if (type === "BLOCK_OPEN") {
                if(!blockOpen) blockOpen = true;
                blockCounter++;
            }
            if (type === "BLOCK_CLOSE") {
                blockCounter--;
                if(blockCounter == 0) blockOpen = false;
            }

            value += token.value;
            this.currentIndex++;
        }
        return value;
    }
}

module.exports = class JazzCompiler {
    constructor(code) {
        this.lexer = new JazzCssLexer(code);
        this.tokens = this.lexer.tokenize();
        this.parser = new JazzCssParser(this.tokens);
    }

    compile() {
        const parsedCode = this.parser.parse();
        //this.generateCode(parsedCode), 
        return parsedCode;
    }

    generateCode(parsedCode) {
        // Implemente a geração de código JavaScript e CSS aqui
        // Converta a estrutura de dados parseada em código JavaScript e CSS

        return {
            js: "",
            css: ""
        }
    }
}