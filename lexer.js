module.exports = class Lexer {
    constructor(input) {
    this.input = input;
    this.position = 0;
    }

    getNextToken() {
        // Expressões regulares para identificar tokens
        const patternsA = [
            { type: 'NUMBER', regex: /\d+/ },
            { type: 'IDENTIFIER', regex: /[a-zA-Z_]\w*/ },
            { type: 'PLUS', regex: /\+/ },
            { type: 'MINUS', regex: /-/ },
            { type: 'MULTIPLY', regex: /\*/ },
            { type: 'DIVIDE', regex: /\// },
            { type: 'WHITESPACE', regex: /\s+/ },
        ];

        const patterns = [
            { type: 'SELECTOR', regex: /[a-zA-Z0-9_\-\[\]=:"'#.]+/ },
            { type: 'PROPERTY', regex: /[a-zA-Z-]+(?=\s*:)/ },
            { type: 'VALUE', regex: /[^;\{\}]+/ },
            { type: 'COMMENT', regex: /\/\*[\s\S]*?\*\// },
            { type: 'PUNCTUATION', regex: /[;:{}]/ },
            { type: 'NUMBER', regex: /\d+(\.\d+)?/ },
            { type: 'COLOR', regex: /#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/ },
            { type: 'FUNCTION', regex: /[a-zA-Z_]\w*\(/ },
            { type: 'IDENTIFIER', regex: /[a-zA-Z_]\w*/ },
            { type: 'MEDIA_QUERY', regex: /@media/ },
            { type: 'IMPORT', regex: /@import/ },
            { type: 'WHITESPACE', regex: /\s+/ },
            { type: 'EOF', regex: /$/ },
        ];

        // Ignorar espaços em branco
        this.input = this.input.trimLeft();

        // Testar padrões
        for (const { type, regex } of patterns) {
            const match = this.input.match(regex);

            if (match && match.index === 0) {
                const value = match[0];
                this.position += value.length;
                this.input = this.input.slice(value.length);

                return { type, value };
            }
        }

        // Token inválidoconst errorPosition = this.position;
        const errorPosition = this.position;
        const snippetStart = Math.max(0, errorPosition - 20);  // Começa 20 caracteres antes da posição do erro
        const snippetEnd = Math.min(this.input.length, errorPosition + 20);  // Termina 20 caracteres após a posição do erro
        const snippet = this.input.substring(snippetStart, snippetEnd);
        throw new Error(`Token inválido em ${errorPosition}. Trecho do código: "${snippet}"`);
    }
}