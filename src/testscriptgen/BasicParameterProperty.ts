import {AbstractProperty} from "./AbstractProperty";
import {Identifier} from "ts-morph";

export class BasicParameterProperty extends AbstractProperty {
    // private _expression: Identifier;

    constructor(name: string, value: string, level: number, type: string) {
        super(name, value, level, type);
        // this._expression = expression;
    }

    // getExpression(): Identifier {
    //     return this._expression;
    // }
    //
    // setExpression(value: Identifier) {
    //     this._expression = value;
    // }
}
