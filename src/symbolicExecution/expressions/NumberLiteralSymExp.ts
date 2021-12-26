import {LiteralSymbolicExpression} from "./LiteralSymbolicExpression";

export class NumberLiteralSymExp extends LiteralSymbolicExpression{
    private _text: number;

    constructor(text: number) {
        super();
        this._text = text;
    }

    toZ3Text(): string {
        return String(this._text);

    }

    isNull(): boolean {
        return false;
    }

    getType(): string {
        return "number";
    }

    getText() {
        return this._text;
    }

    setText(value) {
        this._text = value;
    }
}
