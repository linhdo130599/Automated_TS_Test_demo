import {LiteralSymbolicExpression} from "./LiteralSymbolicExpression";
import {factory} from "../../ConfigLog4j";

export class BooleanLiteralSymExp extends LiteralSymbolicExpression{
    public static logger = factory.getLogger("BooleanLiteral");
    private _text: string;

    constructor(text: string) {
        super();
        this._text = text;
    }

    toZ3Text() {
        if (this._text === "true") {
            return "true";
        } else if (this._text === "false") {
            return "false";
        } else {
            BooleanLiteralSymExp.logger.error("BooleanLiteralSymExp has an invalid text: " + this._text);
        }
    }

    isNull(): boolean {
        return false;
    }

    getText(): string {
        return this._text;
    }

    setText(value: string) {
        this._text = value;
    }

    getType(): string {
        return "boolean";
    }
}
