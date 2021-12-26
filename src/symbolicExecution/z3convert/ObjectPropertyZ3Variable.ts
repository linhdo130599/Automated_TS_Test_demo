import {LiteralParameterZ3Variable} from "./LiteralParameterZ3Variable";
import {Expression} from "ts-morph";
import {AbstractZ3Variable} from "./AbstractZ3Variable";

export class ObjectPropertyZ3Variable extends AbstractZ3Variable {
    private _expression: Expression;


    constructor(name: string, type: string, oldName: string, expression: Expression) {
        super(name, type, oldName);
        this._expression = expression;
    }

    getExpression(): Expression {
        return this._expression;
    }

    setExpression(value: Expression) {
        this._expression = value;
    }
}
