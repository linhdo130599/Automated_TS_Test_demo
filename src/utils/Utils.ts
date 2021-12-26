import {
    BinaryExpression, CallExpression, ElementAccessExpression,
    Expression, Identifier, NumericLiteral,
    ParenthesizedExpression,
    PropertyAccessExpression,
    UnaryExpression
} from "ts-morph";
import {factory} from "../ConfigLog4j";
import {SymbolicExpression} from "../symbolicExecution/expressions/SymbolicExpression";
import {BooleanSymbolicVaribale} from "../symbolicExecution/variables/BooleanSymbolicVaribale";
import {NumberSymbolicVariable} from "../symbolicExecution/variables/NumberSymbolicVariable";
import {StringSymbolicVariable} from "../symbolicExecution/variables/StringSymbolicVariable";
import {AnySymbolicVariable} from "../symbolicExecution/variables/AnySymbolicVariable";
import {SymbolicVariable} from "../symbolicExecution/variables/SymbolicVariable";
import {SingleBinaryConstraint} from "../symbolicExecution/constraints/SingleBinaryConstraint";
import * as fs from "fs";
import * as path from "path";

export class Utils {
    public static readonly logger = factory.getLogger("Utils");
    public static shortenParenthesizedExpression(expression: Expression): Expression {
        while (expression instanceof ParenthesizedExpression) {
            let tmp : ParenthesizedExpression = expression;
            expression = tmp.getExpression();
        }
        return expression;
    }

    //TODO can xu ly truong hop cac ky tu nam trong chuoi string
    public static isSingleCondition(expression: Expression): boolean {
        let rawContent = expression.getText();
        let multiple_signals : Array<string> = ["&&", "||"];
        for (var i = 0 ; i < multiple_signals.length ; i++) {
            if (rawContent.includes(multiple_signals[i]) == true) {
                return false;
            }
        }
        return true;
    }

    public static isMultipleCondition(expression: Expression): boolean {
        if (expression instanceof UnaryExpression) {
            return true;
        } if (expression instanceof BinaryExpression) {
            let binaryExp = expression as BinaryExpression;
            let operator: string = binaryExp.getOperatorToken().getText();
            if (operator == "&&" || operator == "||") {
                this.logger.info("Multiple condition operator: " + operator + " at expression: " + binaryExp.getText());
                return true;
            } else {
                this.logger.info("Not detect operator type in multiple condition: " + expression.getText());
                return false;
            }
        }
    }

    static createSymVarByType(type: string, name: string, value: SymbolicExpression): SymbolicVariable {
        switch (type) {
            case "boolean": {
                return new BooleanSymbolicVaribale(name, value);
            }
            case "number": {
                return new NumberSymbolicVariable(name, value);
            }
            case "string": {
                return new StringSymbolicVariable(name, value);
            }
            case "any": {
                return new AnySymbolicVariable(name, value);
            }

            default : {
                this.logger.error("Dont support this type in declaration statement: " + type);
            }

        }
    }

    public static isMathematicalExpression(expression: BinaryExpression) {
        let operators: string[] = ["+", "-", "*", "/"];
        let operator = expression.getOperatorToken().getText();
        if (operators.includes(operator)) {
            return true;
        } else return false;

        // if (expression instanceof BinaryExpression) {
        //     let operator = expression.getOperatorToken().getText();
        //     let left = expression.getLeft();
        //     let right = expression.getRight();
        //     if (SingleBinaryConstraint.CONSTRAINT_OPERATOR.includes(operator)) {
        //         let checkLeft = Utils.isMathematicalExpression(left);
        //         if (checkLeft === false) return false;
        //         else {
        //             let checkRight = Utils.isMathematicalExpression(right);
        //             if (checkRight === false) return false;
        //             else return true;
        //         }
        //     } else return false;
        // }
        // return true;
    }

    public static isComparableExpression(expression: BinaryExpression) {
        let operator = expression.getOperatorToken().getText();
        if (SingleBinaryConstraint.CONSTRAINT_OPERATOR.includes(operator)) {
            return true;
        } else return false;
    }

    public static writeToFile(content: string, pathURL: string) {
        //Dung sync de luu file ngay sau khi write

        fs.writeFileSync(path.normalize(pathURL), content);
    }

    public static convertAccessExpressionToBasicVariable(expression: Expression): string {
        let newText = expression.getText().replace(new RegExp("\\.", "g"),
            SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
        newText = newText.replace(new RegExp("\\[", "g"),
            SymbolicVariable.ARRAY_OPENING );
        newText = newText.replace(new RegExp("\\]", "g"),
            SymbolicVariable.ARRAY_CLOSING );
        newText = newText.replace(new RegExp("\\(", "g"),
            SymbolicVariable.PARAM_OPENING );
        newText = newText.replace(new RegExp("\\)", "g"),
            SymbolicVariable.PARAM_CLOSING );
        return newText;
        // if (expression instanceof PropertyAccessExpression) { let newText = name.replace(new RegExp("\\.", "g"),
        //             SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
        //         newText = newText.replace(new RegExp("\\[", "g"),
        //             SymbolicVariable.ARRAY_OPENING );
        //         newText = newText.replace(new RegExp("\\]", "g"),
        //             SymbolicVariable.ARRAY_CLOSING );
        //         newText = newText.replace(new RegExp("\\(", "g"),
        //             SymbolicVariable.PARAM_OPENING );
        //         newText = newText.replace(new RegExp("\\)", "g"),
        //             SymbolicVariable.PARAM_CLOSING );
        //     let newText = expression.getText().replace(new RegExp("\\.", "g"),
        //         SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
        //     return SymbolicVariable.PREFIX_SYMBOLIC_VALUE + newText;
        // } else if (expression instanceof ElementAccessExpression) {
        //     let propertyAccessExpresison = expression.getExpression();
        //     let index = expression.getArgumentExpression();
        //     if ((propertyAccessExpresison instanceof PropertyAccessExpression || propertyAccessExpresison instanceof Identifier)
        //             && index instanceof NumericLiteral) {
        //         let newText = propertyAccessExpresison.getText().replace(new RegExp("\\.", "g"),
        //             SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
        //         newText = newText + SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES + index;
        //         return SymbolicVariable.PREFIX_SYMBOLIC_VALUE + newText;
        //     } else {
        //         this.logger.error("Dont support this expression: " + expression.getText());
        //         return  ;
        //     }
        // }
        // else {
        //     return expression.getText();
        // }
    }

    //s.v.m.n => s____V____m_____n
    public static convertObjectPropertyAccessStringToNewSymVarName(name: string): string {
        // let newText = name.replace(new RegExp("\\.get(\\w+)", "g"), (macher, p1) => {return "." + p1.toLowerCase()});
        // let newText = name.replace(new RegExp("\\.(\\w+)\\(\\)", "g"),
        //     (match, p1) => {return "." + p1.toLowerCase()} );
        let newText = name.replace(new RegExp("\\.", "g"),
            SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
        newText = newText.replace(new RegExp("\\[", "g"),
            SymbolicVariable.ARRAY_OPENING );
        newText = newText.replace(new RegExp("\\]", "g"),
            SymbolicVariable.ARRAY_CLOSING );
        newText = newText.replace(new RegExp("\\(", "g"),
            SymbolicVariable.PARAM_OPENING );
        newText = newText.replace(new RegExp("\\)", "g"),
            SymbolicVariable.PARAM_CLOSING );
        // newText = newText.replace(new RegExp("\\.(\\w+)\\(\\)", "g"),
        //     (match, p1) => {return "." + p1.toLowerCase()} );
        return newText;
    }

    static formatExpressionToString(expression: Expression): string {
        if (expression instanceof Identifier) { return expression.getText()}
        else if (expression instanceof PropertyAccessExpression) {
            let name = expression.getName();
            let subExpression = expression.getExpression();
            return this.formatExpressionToString(subExpression).concat(".", name);
        } else if (expression instanceof CallExpression) {
            let propertyAccessExpression = expression.getExpression();
            if (propertyAccessExpression instanceof Identifier) {
                return propertyAccessExpression.getText();
            } else if (propertyAccessExpression instanceof PropertyAccessExpression) {
                let methodName = propertyAccessExpression.getName();
                if (methodName.startsWith("get")) {
                    methodName = methodName.replace("get", "");
                }
                let subExpression = propertyAccessExpression.getExpression();
                return this.formatExpressionToString(subExpression).concat(".", methodName);
            }
        } else if (expression instanceof ElementAccessExpression) {
            let index = expression.getArgumentExpression();
            let arrayExpressin = expression.getExpression();
            return this.formatExpressionToString(arrayExpressin).concat("[", index.getText(), "]");
        }
    }

    public static  isStringMethodSupporting(methodName: string): boolean {
        let methods: string[] = ["startsWith","endsWith","includes","substring", "indexOf", "charAt"];
        if (methods.includes(methodName)) return true;
        else return false;
    }
}
