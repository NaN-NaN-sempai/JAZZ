class Jazz {
    static tokenize(code) {
        const tokenRules = [
            { type: "space", pattern: /^[^\S\r\n]+/ },
            { type: "newline", pattern: /^(?:\r\n|\r|\n)+/ },
            { type: "identifier", pattern: /^[a-zA-Z_$][\w$]*/ },

            { type: "curly", block: true, pattern: /^[{}]/ },
            { type: "parens", block: true, pattern: /^[()]/ },
            { type: "bracket", block: true, pattern: /^[\[\]]/ },

            { type: "comment", method: "block", pattern: /^\/\*[^]*?\*\// },
            { type: "comment", method: "line", pattern: /^\/\/[^\r\n]*/ },

            { type: "hyphen", pattern: /^-+/ },
            { type: "number", pattern: /^\d+/ },
            { type: "semicolon", pattern: /^;/ },
            { type: "colon", pattern: /^:/ },
            { type: "dot", pattern: /^\./ },
            { type: "comma", pattern: /^,/ },
            { type: "hash", pattern: /^#/ },
        ];
        let checkLists = {
            "DOM events": [
                // Mouse
                "click", "dblclick", "mousedown", "mouseup", "mousemove",
                "mouseenter", "mouseleave", "mouseover", "mouseout", "contextmenu",
                "wheel", "auxclick",

                // Keyboard
                "keydown", "keyup", "keypress",

                // Touch
                "touchstart", "touchend", "touchmove", "touchcancel",

                // Pointer
                "pointerdown", "pointerup", "pointermove",
                "pointerover", "pointerout", "pointerenter", "pointerleave",
                "pointercancel", "gotpointercapture", "lostpointercapture",

                // Drag & Drop
                "dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop",

                // Focus
                "focus", "blur", "focusin", "focusout",

                // Form
                "input", "change", "submit", "reset", "invalid",

                // Clipboard
                "copy", "cut", "paste",

                // Selection
                "select", "selectstart",

                // Media
                "play", "pause", "ended", "volumechange", "timeupdate", "seeking", "seeked",

                // Window / Document
                "load", "unload", "resize", "scroll", "beforeunload", "error",

                // Animation / Transition
                "animationstart", "animationend", "animationiteration",
                "transitionstart", "transitionend", "transitionrun", "transitioncancel"
            ],
            "CSS pseudo-classes": [
                // interactive
                "hover", "active", "focus", "focus-visible", "focus-within",

                // state
                "enabled", "disabled", "checked", "indeterminate", "default",
                "valid", "invalid", "in-range", "out-of-range", "required", "optional",
                "read-only", "read-write", "placeholder-shown", "autofill",

                // structure
                "root", "empty", "first-child", "last-child", "only-child",
                "first-of-type", "last-of-type", "only-of-type",
                "nth-child", "nth-last-child", "nth-of-type", "nth-last-of-type",

                // link
                "link", "visited", "target", "target-within",

                // correspondence
                "not", "is", "where", "has", "lang", "dir",

                // content
                "host", "host-context", "scope",

                // others
                "fullscreen", "picture-in-picture", "modal", "defined"
            ],
            "CSS units": [
                // length
                "px", "cm", "mm", "Q", "in", "pt", "pc",
                "em", "rem", "ex", "ch", "lh", "rlh",
                "vw", "vh", "vmin", "vmax", "svw", "svh", "lvw", "lvh", "dvw", "dvh",
                "%",

                // angle
                "deg", "grad", "rad", "turn",

                // time
                "s", "ms",

                // frequency
                "Hz", "kHz",

                // resolution
                "dpi", "dpcm", "dppx", "x",

                // flexible length
                "fr"
            ],
            "CSS color-names": [
                "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure",
                "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood",
                "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan",
                "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
                "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon",
                "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet",
                "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue",
                "firebrick", "floralwhite", "forestgreen", "fuchsia",
                "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey",
                "honeydew", "hotpink",
                "indianred", "indigo", "ivory",
                "khaki",
                "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
                "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon",
                "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen",
                "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
                "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream",
                "mistyrose", "moccasin",
                "navajowhite", "navy",
                "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid",
                "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple",
                "rebeccapurple", "red", "rosybrown", "royalblue",
                "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue",
                "tan", "teal", "thistle", "tomato", "turquoise",
                "violet",
                "wheat", "white", "whitesmoke",
                "yellow", "yellowgreen"
            ],
            "CSS functions": [
                // color
                "rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "color",

                // Math / layout
                "calc", "min", "max", "clamp", "var", "env", "attr",

                // Gradients
                "linear-gradient", "radial-gradient", "conic-gradient", "repeating-linear-gradient",
                "repeating-radial-gradient",

                // Image / media
                "url", "image", "cross-fade", "element", "paint",

                // Filter / effects
                "blur", "brightness", "contrast", "drop-shadow", "grayscale", "hue-rotate",
                "invert", "opacity", "saturate", "sepia", "url",

                // Trasform
                "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ",
                "translate", "translateX", "translateY", "translateZ", "skew", "skewX", "skewY",
                "matrix", "matrix3d", "perspective",

                // Clip / shape
                "circle", "ellipse", "inset", "polygon", "path",

                // Others
                "steps", "cubic-bezier", "frames"
            ]
        };
        const isInChecklist = str => {
            for (const list of Object.entries(checkLists)) {
                if (list[1].includes(str)) return {
                    type: list[0],
                    value: str,
                    width: str.length
                };
            }

            return null;
        }
        const blockList = {
            open: ["(", "[", "{", "<"],
            close: [")", "]", "}", ">"]
        };

        const getToken = (str) => {
            for (const rule of tokenRules) {
                const match = str.match(rule.pattern);


                if (match) {
                    let checkList = isInChecklist(match[0]);
                    if (checkList != null) return checkList;

                    let token = {
                        ...rule,
                        value: match[0],
                        width: match[0].length
                    };
                    delete token.pattern;

                    if (rule.block) {
                        delete token.block;
                        token.method = blockList.open.includes(match[0]) ? "open" : "close";
                    }

                    return token
                }
            }

            return {
                type: "unknown",
                value: str[0],
                width: 1
            };
        }

        const tokenList = (str, arr = []) => {
            const token = getToken(str);


            if (!["newline", "space"].includes(token.type)) {
                //console.log(token);
            }


            if (str.length >= token.width) {
                return tokenList(str.slice(token.width), [...arr, token]);
            } else {
                return arr;
            }
        }

        return tokenList(code);


        return;

        /* 

        const flags = ["inRoot"];
        const tokens = [];

        const pushFlag = (flag) => flags[flags.length] = flag;
        const popFlag = (flag) => {
            const last = flags[flags.length - 1];
            if (last !== flag)
                throw new Error(`Expected to close ${last}, got ${flag}`);
            flags.length--;
        };

        const addAction = (token) => {
            const last = tokens[tokens.length - 1];

            if (last?.name == token.name)
                last.text += token.text;
            else
                tokens.push({ ...token });
        };
        
        let escape = false;
        let lastToken = null;

        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const charToken = toTokenChar(char);
            let { type, char: text } = charToken;
            const state = flags[flags.length - 1];

            lastToken = charToken;
        }

        return tokens;
    }

    static stringify(tokens) {

        let aux = [];
        let lastAttr = null;

        const editLast = (str) => {
            aux[aux.length - 1] = str;
        }

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const { name, text } = token;
            let last = aux[aux.length - 1];

            if (["tag", "content"].includes(name)) {
                if(last) {
                    editLast(last.replace(`{attr}`, ""));
                }
                if(name == "tag")
                    aux.push(`<${text}{attr}>`);//{autoclose}
                else
                    editLast(last + `${text}`);
            } 

            else if (name == "selector") {
                const selector = {
                    "#": "id",
                    ".": "class",
                }

                lastAttr = selector[text];
                editLast(last.replace(`{attr}`, ` ${lastAttr}{attr}`));
            }

            else if (name == "selectorText" ) {
                if(lastAttr)
                    editLast(last.replace(`${lastAttr}`, `${lastAttr}="${text}"`));
            }

            else if (name == "attrKey") {
                lastAttr = text;
                editLast(last.replace(`{attr}`, ` ${text}{attr}`));
            }

            else if (name == "attrValue") { 
                if(lastAttr)
                    editLast(last.replace(`${lastAttr}`, `${lastAttr}="${text}"`));
            }

            else if (name == "slot") {
                editLast(last += `{{${text.slice(0, - 1)}}}`);
            }

            else if (name == "closeTag") {
                editLast(last.replace(`{attr}`, ""));
                aux.push(`</${text}>`);
            }
            
            
        }

        return aux.join(""); */
    }

    static structure(tokens) {
        const flags = ["inRoot"];
        const subflags = [];

        const pushFlag = (flag, substate = false) => {
            if(substate) return subflags[subflags.length] = flag;
            flags[flags.length] = flag;
        }
        const popFlag = (flag, substate = false) => {
            if(substate) {
                const last = subflags[subflags.length - 1];
                if (last !== flag)
                    throw new Error(`Expected to close subflag "${last}", got "${flag}" instead`);
                subflags.length--;
            } else {
                const last = flags[flags.length - 1];
                if (last !== flag)
                    throw new Error(`Expected to close flag "${last}", got "${flag}" instead`);
                flags.length--;
            }
        };

        const root = [];
        const getBySelector = (selector) => root.find(r => r.selector == selector);

        let lastToken = null;

        const anySpace = ["space", "newline"];

        let selector = "";
        const selectorTypes = ["dot", "hash", "identifier", "bracket", "colon", "hyphen", "CSS pseudo-classes"];
        const propTypes = ["identifier", "bracket", "hyphen", "CSS functions"];

        let prop = "";

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let { type, value, method } = token;
            const state = flags[flags.length - 1];
            const substate = subflags[subflags.length - 1];
            const anyspace = anySpace.includes(type);


            if (type == "comment") {
                continue;
            }


            if (state == "inRoot") {
                if (selectorTypes.includes(type)) {
                    pushFlag("inSelector");
                    selector = value;
                } else if (anyspace) {
                    /* ignore */
                } else throw new Error(`Unexpected token: "${value}", expecting a selector`);

            } else if (state == "inSelector") {
                if (selectorTypes.includes(type)) {
                    selector += value;
                } else  {
                    root.push({ selector });
                    popFlag("inSelector");
                    pushFlag("expectOpenBlock");
                }
           
            } else if (state == "expectOpenBlock") {
                if (type == "curly") {
                    if(method == "open") {
                        getBySelector(selector).properties = {};
                        popFlag("expectOpenBlock");
                        pushFlag("inBlock");
                        
                    }
                } else if (anyspace) {
                    /* ignore */
                } else throw new Error(`Unexpected token: "${value}", expecting block opening ("{")`);

            } else if (state == "inBlock") {
                if (propTypes.includes(type)) {
                    prop += value;
                    pushFlag("inProp");

                } else if (type == "curly" && method == "close") {
                    popFlag("inBlock");
                    selector = "";

                } else if (anyspace) {
                    /* ignore */
                } else throw new Error(`Unexpected token: "${value}", expecting a property name`);
            
            } else if (state == "inProp") {
                if (propTypes.includes(type) && substate !== "expectColon") {
                    prop += value;
                    
                } else if (anyspace && substate !== "expectColon") {
                    pushFlag("expectColon", 1);

                }  else if (type == "colon") {
                    getBySelector(selector).properties[prop] = "";
                    popFlag("inProp");
                    if(substate == "expectColon") popFlag("expectColon", 1);
                    pushFlag("inPropValue");

                } else throw new Error(`Unexpected token: "${value}", expecting a assignment (":")`);
            
            } else if (state == "inPropValue") {
                if (anyspace) {

                    if (!anySpace.includes(lastToken.type) && getBySelector(selector).properties[prop] != "") {
                        getBySelector(selector).properties[prop] += " ";
                    }

                } else if (type !== "semicolon") {
                    getBySelector(selector).properties[prop] += value;

                } else {
                    prop = "";
                    popFlag("inPropValue");
                }
            }


            
            lastToken = token;
        }

        return root;
    }

    static parse(code) {
        const tokens = LhsML.tokenize(code);
        return LhsML.stringify(tokens);
    }

}