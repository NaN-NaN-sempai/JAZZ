class statefullStyle {
    static list = [];

    constructor(parent, str, state = false) {
        this.parent = parent;
        this.str = str;
        this.state = state;

        if(parent){
            if(!parent.statefullStyleList) parent.statefullStyleList = [];
            parent.statefullStyleList.push(this);
            this.constructor.list.push(this);
        }
        if(this.state) this.compile();
    }

    endPoints(){
        let endPointList = [];

        const searchTree = (obj) => {
            if(obj.parents.length) endPointList.push(obj);

            if(obj.dependents.length) obj.dependents.forEach(searchTree);
        }

        searchTree(this.parent);

        return endPointList;
    }
    compile() { 
        this.parent.parents.forEach(e => {
            e.compile();
        })
    }
    setState(bool) {
        if(bool == this.state) return;

        this.state = bool;
        this.compile();
    }
    toggle() {
        this.state = !this.state;
        this.compile();
    }
}

class StyleClass {
    static list = [];

    constructor(str, dependencies = [], parents = []) {
        if(!Array.isArray(parents)) parents = [parents];
        this.parents = [...parents];
        this.constructor.list.push(this);
        this.str = str;
        this.dependencies = dependencies;
        this.dependents = [];

        dependencies.forEach(dep => dep.dependents.push(this));
    }


    statefull = (str, bool) => new statefullStyle(this, str, bool);

    compile(selector) {
        let replace = "&self";
        let reg = new RegExp("\\b"+replace+"\\b", "g"); 

        let str = this.str.replace(/(\r\n|\n|\r)/gm, "").trimEnd().trimStart();

        this.dependencies.forEach(style => {
            str = str + style.compile();  
        });
        
        this.statefullStyleList?.forEach(style => {
            if(style.state) str = str + style.str;  
        });
        
        return str
    }
}

class JAZZ {
    static list = [];
    static styles = StyleClass.list;
    static statefullStyles = statefullStyle.list;

    constructor (el = [], style) {
        if(!Array.isArray(el) && !(el instanceof NodeList)) el = [el];
        this.el = [...el];

        this.constructor.list.push(this); 

        if(style instanceof StyleClass) {
            style.parents.push(this);
            this.style = style;
        }
        else this.style = new StyleClass(style, undefined, this);

        console.log(this.el);
        this.el.forEach(e => this.setDataset(e));
        this.compile();
    }

    id = () => this.constructor.list.indexOf(this);
    selector = () => [...new Set(this.el.map(e => `${e.tagName}[data-css-id-${this.id()}="${this.id()}"]`))].join(",");
    setDataset(DOM){ DOM.dataset["cssId-" + this.id()] = this.id() }

    statefullStyle = (str, bool) => new statefullStyle(this.style, str, bool);

    compileCss() {
        let str = this.style.compile();

        if(!str.startsWith("{")) str = "{" + str;

        if(!str.endsWith("}")) str = str + "}";

        return str
            .replaceAll("-[", "{")
            .replaceAll("]-", "}");
    }

    compile() { 
        console.log(this.selector());
        let exists = document.querySelector('style[data-css-id-'+this.id()+'="'+this.id()+'"]');

        let style = document.createElement("style");
            style.innerHTML = `${this.selector()}${this.compileCss()}`;
            this.setDataset(style);

        document.head.append(style);

        if(exists) exists.remove();
    }
}