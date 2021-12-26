import {SymbolicVariable} from "./SymbolicVariable";
import {Expression} from "ts-morph";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {NotDeclaredSymVar} from "./NotDeclaredSymVar";

export class StaticMethodSymVar extends NotDeclaredSymVar {
    // private _expression: Expression;
    //
    //
    // constructor(name: string, value: SymbolicExpression, newName: string, type: string, expression: Expression) {
    //     super(name, value, newName, type);
    //     this._expression = expression;
    // }
    //
    // getExpression(): Expression {
    //     return this._expression;
    // }
    //
    // setExpression(value: Expression) {
    //     this._expression = value;
    // }
}
