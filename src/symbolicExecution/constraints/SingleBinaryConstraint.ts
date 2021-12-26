import {Constraint} from "./Constraint";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {BinaryExpression, Expression} from "ts-morph";
import {wrapText} from "../z3convert/Z3Utils";
import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";
import {SymbolicTable} from "../SymbolicTable";
import {Utils} from "../../utils/Utils";
import {ExpressionConstraint} from "./ExpressionConstraint";

export class SingleBinaryConstraint extends Constraint {
    public static logger: Logger = factory.getLogger("SingleBinaryConstraint");
    public static readonly  CONSTRAINT_OPERATOR = [">", ">=", "<", "<=", "==", "===", "!=", "!=="];
    private _operator: string;
    private _left: SymbolicExpression;
    private _right: SymbolicExpression;

    constructor(expression: Expression, operator: string, left: SymbolicExpression, right: SymbolicExpression) {
        super(expression);
        this._operator = operator;
        this._left = left;
        this._right = right;
    }

    toZ3Text(): string {
        switch (this._operator) {
            case ">":
            case "<":
            case ">=":
            case "<=": {
                return wrapText("".concat(this._operator," ",this._left.toZ3Text()," ", this._right.toZ3Text()));
            }
            case "==":
            case "===": {
                return wrapText("".concat("="," ",this._left.toZ3Text()," ", this._right.toZ3Text()));
            }
            case "!=":
            case "!==":
                return wrapText("not "+ wrapText("".concat("="," ",this._left.toZ3Text()," ", this._right.toZ3Text())));
            default:
                SingleBinaryConstraint.logger.error("Don't support this operator: " + this._operator + " in expression: " + this.getExpression().getText());
        }
    }

    static tranfer(expression: Expression, table: SymbolicTable) : SingleBinaryConstraint {
        if (expression instanceof BinaryExpression) {
            if (Utils.isComparableExpression(expression)) {
                let operator = expression.getOperatorToken().getText();
                let left = expression.getLeft();
                let right = expression.getRight();
                let leftSymbolic = ExpressionConstraint.tranfer(left, table);
                let rightSymbolic = ExpressionConstraint.tranfer(right, table);
                return new SingleBinaryConstraint(expression, operator, leftSymbolic, rightSymbolic);
            } else {
                this.logger.error("Expression is not single binary constraint: " + expression.getText());
            }
        } else {
            this.logger.error("Transfer invalid expression: " + expression.getText() + " is not binary expression");
        }
    }

    getOperator(): string {
        return this._operator;
    }

    setOperator(value: string) {
        this._operator = value;
    }

    getLeft(): SymbolicExpression {
        return this._left;
    }

    setLeft(value: SymbolicExpression) {
        this._left = value;
    }

    getRight(): SymbolicExpression {
        return this._right;
    }

    setRight(value: SymbolicExpression) {
        this._right = value;
    }
}
