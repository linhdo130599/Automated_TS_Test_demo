import {Constraint} from "./Constraint";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {BinaryExpression, Expression} from "ts-morph";
import {wrapText} from "../z3convert/Z3Utils";
import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";
import {SymbolicTable} from "../SymbolicTable";
import {Utils} from "../../utils/Utils";
import {ExpressionConstraint} from "./ExpressionConstraint";

export class MultipleConstraint extends Constraint {
    public static logger: Logger = factory.getLogger("MultipleConstraint");
    public static readonly  MULTIPLE_CONSTRAINT_OPERATOR = ["&&", "||"];
    private _operator: string;
    private _left: Constraint;
    private _right: Constraint;


    constructor(expression: Expression, operator: string, left: Constraint, right: Constraint) {
        super(expression);
        this._operator = operator;
        this._left = left;
        this._right = right;
    }

    toZ3Text(): string {
        switch (this._operator) {
            case "&&": {
                return wrapText("".concat("and "," ",this._left.toZ3Text()," ", this._right.toZ3Text()));
            } case "||": {
                return wrapText("".concat("or "," ",this._left.toZ3Text()," ", this._right.toZ3Text()));
            }
            default: {
                MultipleConstraint.logger.error("Don't support this operator: " + this._operator + " in expression: " + this.getExpression().getText());
            }
        }
    }

    // static transfer(expression: Expression, table: SymbolicTable) : MultipleConstraint {
    //     if (expression instanceof BinaryExpression) {
    //         if (Utils.isMultipleCondition(expression)) {
    //             let operator = expression.getOperatorToken().getText();
    //             let left = expression.getLeft();
    //             let right = expression.getRight();
    //             let leftSymbolic = ;
    //             let rightSymbolic = ExpressionConstraint.tranfer(right, table);
    //             return new SingleBinaryConstraint(expression, operator, leftSymbolic, rightSymbolic);
    //         } else {
    //             this.logger.error("Expression is not multiple constraint: " + expression.getText());
    //         }
    //     } else {
    //         this.logger.error("Transfer invalid expression: " + expression.getText() + " is not binary expression");
    //     }
    // }

    getOperator(): string {
        return this._operator;
    }

    setOperator(value: string) {
        this._operator = value;
    }

    getLeft(): Constraint {
        return this._left;
    }

    setLeft(value: Constraint) {
        this._left = value;
    }

    getRight(): Constraint {
        return this._right;
    }

    setRight(value: Constraint) {
        this._right = value;
    }
}
