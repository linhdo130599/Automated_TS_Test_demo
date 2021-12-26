import {Constraint} from "./Constraint";
import {endLineAndCharacter} from "tslint-sonarts/lib/utils/navigation";
import {factory} from "../../ConfigLog4j";
import {Z3Keyword} from "../z3convert/Z3Keyword";
import {Expression} from "ts-morph";

export class BooleanLiteralConstraint extends Constraint {
    public static logger = factory.getLogger("BooleanLiteralConstraint");
    private _text: string;


    constructor(expression: Expression, text: string) {
        super(expression);
        this._text = text;
    }

    toZ3Text(): string {
        if (this._text === "true" ) {
            return Z3Keyword.TRUE;
        } else if (this._text === "false") {
            return Z3Keyword.FALSE;
        }
        else {
            BooleanLiteralConstraint.logger.error("BooleanLiteralConstraint has an invalid value!");
        }
    }

    getText(): string {
        return this._text;
    }

    setText(value: string) {
        this._text = value;
    }
}
