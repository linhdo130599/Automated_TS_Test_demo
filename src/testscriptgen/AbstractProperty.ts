import {Expression} from "ts-morph";

export class AbstractProperty {
    private _name: string;
    private _value: string;
    private _level: number;
    private _type: string;
    // private _expression: Expression;

    constructor(name: string, value: string, level: number, type?: string) {
        this._name = name;
        this._value = value;
        this._level = level;
        this._type = type;
    }

    getName(): string {
        return this._name;
    }

    setName(value: string) {
        this._name = value;
    }


    getValue(): string {
        return this._value;
    }

    setValue(value: string) {
        this._value = value;
    }


    getLevel(): number {
        return this._level;
    }

    setLevel(value: number) {
        this._level = value;
    }


    getType(): string {
        return this._type;
    }

    setType(value: string) {
        this._type = value;
    }

    toString(): string {
        return "Name: " + this._name + " - Value: " + this._value;
    }


    // getExpression(): Expression {
    //     return this._expression;
    // }
    //
    // setExpression(value: Expression) {
    //     this._expression = value;
    // }
}
