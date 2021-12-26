import {LiteralSymbolicExpression} from "./LiteralSymbolicExpression";

export class StringLiteralSymExp extends LiteralSymbolicExpression{
    private _text: string;

    constructor(text: string) {
        super();
        this._text = text;
    }

    toZ3Text(): string {
        return this.wrapString(this._text);
    }

    isNull(): boolean {
        return false;
    }

    getType(): string {
        return "string";
    }

    wrapString(s: string): string {
        if (s.startsWith("\"") && s.endsWith("\"")){
            return s;
        } else {
            return "".concat("\"", s, "\"");
        }
    }

    getText() {
        return this._text;
    }

    setText(value) {
        this._text = value;
    }

}
