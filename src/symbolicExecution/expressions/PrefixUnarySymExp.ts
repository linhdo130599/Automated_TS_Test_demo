import {SymbolicExpression} from "./SymbolicExpression";
import {wrapText} from "../z3convert/Z3Utils";

export class PrefixUnarySymExp extends SymbolicExpression {
    private _expression: SymbolicExpression;
    private _operator: string;

    constructor(expression: SymbolicExpression, operator: string) {
        super();
        this._expression = expression;
        this._operator = operator;
    }

    isNull(): boolean {
        return !this._expression.isNull();
    }

    getType(): string {
        return "boolean";
    }

    getExpression(): SymbolicExpression {
        return this._expression;
    }

    setExpression(value: SymbolicExpression) {
        this._expression = value;
    }

    toZ3Text(): string {
        if (this._operator === "!") {
            return wrapText("not " + this._expression.toZ3Text());
        } else if (this._operator === "-") {
            // return "-" + this._expression.toZ3Text();
            return wrapText("- 0 " + this._expression.toZ3Text());
        }
    }


    getOperator(): string {
        return this._operator;
    }

    setOperator(value: string) {
        this._operator = value;
    }
}
