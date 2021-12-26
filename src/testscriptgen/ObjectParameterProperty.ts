import {AbstractProperty} from "./AbstractProperty";
import {Expression} from "ts-morph";

export class ObjectParameterProperty extends AbstractProperty{
    private _expression: Expression;


    constructor(name: string, value: string, level: number, type: string, expression: Expression) {
        super(name, value, level, type);
        this._expression = expression;
    }

    getExpression(): Expression {
        return this._expression;
    }

    setExpression(value: Expression) {
        this._expression = value;
    }
}
