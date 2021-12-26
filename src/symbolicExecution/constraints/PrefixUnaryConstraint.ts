import {Constraint} from "./Constraint";
import {wrapText} from "../z3convert/Z3Utils";
import {Expression} from "ts-morph";

export class PrefixUnaryConstraint extends Constraint{
    private _constraint: Constraint;

    constructor(expression: Expression, constraint: Constraint) {
        super(expression);
        this._constraint = constraint;
    }

    toZ3Text(): string {
        return wrapText("".concat("not ", this._constraint.toZ3Text()));
    }

    getConstraint(): Constraint {
        return this._constraint;
    }

    setConstraint(value: Constraint) {
        this._constraint = value;
    }
}
