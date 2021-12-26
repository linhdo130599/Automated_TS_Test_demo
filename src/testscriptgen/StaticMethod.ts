import {AbstractProperty} from "./AbstractProperty";
import {Expression} from "ts-morph";

export class StaticMethod extends AbstractProperty {
    private _path: string;
    private _expression: Expression;


    constructor(name: string, value: string, level: number, type: string, path: string) {
        super(name, value, level, type);
        this._path = path;
    }

    getPath(): string {
        return this._path;
    }

    setPath(value: string) {
        this._path = value;
    }


    getExpression(): Expression {
        return this._expression;
    }

    setExpression(value: Expression) {
        this._expression = value;
    }
}
