import {ISymbolicVariable} from "./variables/ISymbolicVariable";
import {Expression} from "ts-morph";
import {SymbolicVariable} from "./variables/SymbolicVariable";
import {SymbolicExpression} from "./expressions/SymbolicExpression";
import {Utils} from "../utils/Utils";
import {InitializedSymbolicExpression} from "./expressions/InitializedSymbolicExpression";
import {NotDeclaredSymVar} from "./variables/NotDeclaredSymVar";
import {ExternalFunctionSymVar} from "./variables/ExternalFunctionSymVar";
import {ExpressionConstraint, PropertyAccessExpressionType} from "./constraints/ExpressionConstraint";
import {StaticMethodSymVar} from "./variables/StaticMethodSymVar";
import {isInstanceOf} from "typedjson/js/typedjson/helpers";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";

export class SymbolicTable {
    private _elements: Array<ISymbolicVariable>;


    constructor() {
        this.init();
    }

    init(): void {
        this._elements = new Array<ISymbolicVariable>();
    }

    findNewVariableAndCreate(expression: Expression): Array<ISymbolicVariable> {
        return [];
    }

    findByName(name: string): ISymbolicVariable {
        let symbolicVariable: ISymbolicVariable;
        for (var i = 0; i < this._elements.length ; i++) {
            if (this._elements[i].getName() == name ) {
                symbolicVariable = this._elements[i];
                break;
            }
        }
        if (symbolicVariable == null) {
            //TODO tao moi 1 bien symbolic va them vao mang
        }
        return symbolicVariable;
    }

    findByNameAndCreate(name: string, type: string, expression?: Expression, typeOfExpression?: number): ISymbolicVariable {
        let symbolicVariable: ISymbolicVariable;
        for (var i = 0; i < this._elements.length ; i++) {
            if (this._elements[i].getName() == name ) {
                symbolicVariable = this._elements[i];
                break;
            }
        }
        if (symbolicVariable == null) {
            let newVar = null;
            // let variableInitialName = Utils.convertObjectPropertyAccessStringToNewSymVarName(name);
            let variableInitialName = Utils.convertObjectPropertyAccessStringToNewSymVarName(name);
            let newSymbolicName = SymbolicVariable.PREFIX_SYMBOLIC_VALUE + variableInitialName;
            if (expression && typeOfExpression) {
                if (typeOfExpression === PropertyAccessExpressionType.EXTERNAL_FUNCTION) {
                    newVar = new ExternalFunctionSymVar(name, new InitializedSymbolicExpression(newSymbolicName,type), variableInitialName, type, expression);
                } else {
                    newVar = new StaticMethodSymVar(name, new InitializedSymbolicExpression(newSymbolicName,type), variableInitialName, type, expression);
                }
            } else {
                // variableInitialName = Utils.formatExpressionToString(expression);
                newVar = new NotDeclaredSymVar(name, new InitializedSymbolicExpression(newSymbolicName,type), variableInitialName, type, expression);
            }
            // let newVar = Utils.createSymVarByType(typeElement, name, new InitializedSymbolicExpression(variableInitialName));
            // this._elements.push(newVar);
            // return newVar;
            // let newVar = Utils.createSymVarByType(type, name, new InitializedSymbolicExpression(variableInitialName));
            this._elements.push(newVar);
            return newVar;
        }

        return symbolicVariable;
    }


    findByExpressionTextAndCreate(expression: Expression): ISymbolicVariable {
        let name = expression.getText();
        let type = expression.getType().getText();
        let symbolicVariable: ISymbolicVariable;
        for (var i = 0; i < this._elements.length ; i++) {
            if (this._elements[i].getName() == name ) {
                symbolicVariable = this._elements[i];
                break;
            }
        }
        if (symbolicVariable == null) {
            // let variableInitialName = Utils.convertAccessExpressionToBasicVariable(expression);
            // xoa tham so cua loi goi ham
            let formatName = TestscriptGeneration.formatExpressionToString(expression);
            let variableInitialName = Utils.convertObjectPropertyAccessStringToNewSymVarName(formatName);
            let newSymbolicName = SymbolicVariable.PREFIX_SYMBOLIC_VALUE + variableInitialName;
            let typeOfExpression = ExpressionConstraint.checkPropertyAccessExpressionType(expression);
            let newVar = null;
            if (typeOfExpression === PropertyAccessExpressionType.EXTERNAL_FUNCTION) {
                newVar = new ExternalFunctionSymVar(formatName, new InitializedSymbolicExpression(newSymbolicName,type), variableInitialName, type, expression);
            } else if (typeOfExpression === PropertyAccessExpressionType.STATIC_METHOD){
                newVar = new StaticMethodSymVar(formatName, new InitializedSymbolicExpression(newSymbolicName,type), variableInitialName, type, expression);
            } else {
                newVar = new NotDeclaredSymVar(formatName, new InitializedSymbolicExpression(newSymbolicName, type), variableInitialName, type, expression);
            }
            this._elements.push(newVar);
            return newVar;
        }

        return symbolicVariable;
    }

    // updateValue(name: string, value: SymbolicExpression): void {
    //     for (var i = 0; i < this._elements.length ; i++) {
    //         if (this._elements[i].getName() == name ) {
    //             this._elements[i].setValue(value);
    //             break;
    //         }
    //     }
    // }

    updateValues(names: Array<string>, value: SymbolicExpression): void {
        for (var i = 0; i < this._elements.length ; i++) {
            if (names.includes(this._elements[i].getName())) {
                this._elements[i].setValue(value);
                break;
            }
        }
    }

    updateValuesByExpression(expressions: Array<Expression>, value: SymbolicExpression): void {
        expressions.forEach(expression => {
            let symVar = this.findByExpressionTextAndCreate(expression);
            symVar.setValue(value);
        });
        // let names = expressions.map(e => e.getText());
        // for (var i = 0; i < this._elements.length ; i++) {
        //     if (names.includes(this._elements[i].getName())) {
        //         this._elements[i].setValue(value);
        //         break;
        //     }
        // }
    }

    push(variable: ISymbolicVariable): void {
        this._elements.push(variable);
    }

    deleteScopeLevelAt(level: number) : void {
        this._elements = this._elements.filter(s => s.getScopeLevel() != level);
        // for (var i = elements.length - 1; i >= 0; i--)
        //     if (elements[i].getScopeLevel() == level)
        //         elements.splice(0, i);
    }

    getElements(): Array<ISymbolicVariable> {
        return this._elements;
    }

    setElements(value: Array<ISymbolicVariable>) {
        this._elements = value;
    }

    getExternalFunctions(): Array<ExternalFunctionSymVar> {
        let array = new Array<ExternalFunctionSymVar>()
        this._elements.forEach(e => {
            if (e instanceof ExternalFunctionSymVar) {
                array.push(e);
            }
        })
        return array;
    }

    getStaticMethods(): Array<StaticMethodSymVar> {
        let array = new Array<StaticMethodSymVar>()
        this._elements.forEach(e => {
            if (e instanceof StaticMethodSymVar) {
                array.push(e);
            }
        })
        return array;
    }
}
