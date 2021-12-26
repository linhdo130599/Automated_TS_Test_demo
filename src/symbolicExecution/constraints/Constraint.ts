import {IConstraint} from "./IConstraint";
import {Z3Convert} from "../z3convert/Z3Convert";
import {Expression} from "ts-morph";

export abstract class Constraint implements IConstraint {
    private _expression: Expression;


    constructor(expression: Expression) {
        this._expression = expression;
    }

    abstract toZ3Text(): string;

    getExpression(): Expression {
        return this._expression;
    }

    setExpression(value: Expression) {
        this._expression = value;
    }
}
