import {SymbolicVariable} from "./SymbolicVariable";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {Expression} from "ts-morph";

export class NotDeclaredSymVar extends SymbolicVariable {
    private _newName: string;
    private _type: string;
    private _expression: Expression;


    constructor(name: string, value: SymbolicExpression, newName: string, type: string, expression: Expression) {
        super(name, value);
        this._newName = newName;
        this._type = type;
        this._expression = expression;
    }

    getNewName(): string {
        return this._newName;
    }

    setNewName(value: string) {
        this._newName = value;
    }

    getType(): string {
        return this._type;
    }

    setType(value: string) {
        this._type = value;
    }

    getExpression(): Expression {
        return this._expression;
    }

    setExpression(value: Expression) {
        this._expression = value;
    }
}
