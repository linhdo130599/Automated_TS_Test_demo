import {SymbolicExpression} from "./SymbolicExpression";
import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";
import {wrapText} from "../z3convert/Z3Utils";
import {ISymbolicExpression} from "./ISymbolicExpression";

export class BinarySymbolicExpression extends SymbolicExpression {
    public static logger: Logger = factory.getLogger("BinarySymbolicExpression");
    private _operator: string;
    private _left: ISymbolicExpression;
    private _right: ISymbolicExpression;


    constructor(operator: string, left: ISymbolicExpression, right: ISymbolicExpression) {
        super();
        this._operator = operator;
        this._left = left;
        this._right = right;
    }

    toZ3Text(): string {
        switch (this._operator) {
            case "+":
            case "-":
            case "*":
            case "/":
                return wrapText("".concat(this._operator, " ", this._left.toZ3Text(), " ", this._right.toZ3Text()));
            default:
                BinarySymbolicExpression.logger.error(`Don't support operator: ${this._operator} in BinarySymExp!`);
        }
    }
    isNull(): boolean {
        return this._left.isNull() == true || this._right.isNull() || true;
    }

    getOperator(): string {
        return this._operator;
    }

    setOperator(value: string) {
        this._operator = value;
    }

    getLeft(): ISymbolicExpression {
        return this._left;
    }

    setLeft(value: ISymbolicExpression) {
        this._left = value;
    }

    getRight(): ISymbolicExpression {
        return this._right;
    }

    setRight(value: ISymbolicExpression) {
        this._right = value;
    }

    getType(): string {
        return this._left.getType();
    }
}
