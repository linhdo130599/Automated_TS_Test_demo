import {Constraint} from "./Constraint";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {Z3Keyword} from "../z3convert/Z3Keyword";
import {
    BinaryExpression,
    BooleanLiteral,
    CallExpression,
    ElementAccessExpression,
    Expression,
    Identifier,
    LiteralExpression,
    NullLiteral,
    NumericLiteral,
    ParenthesizedExpression,
    PrefixUnaryExpression,
    PrimaryExpression,
    PropertyAccessExpression,
    StringLiteral,
    SyntaxKind
} from "ts-morph";
import {SymbolicTable} from "../SymbolicTable";
import {BinarySymbolicExpression} from "../expressions/BinarySymbolicExpression";
import {BooleanLiteralSymExp} from "../expressions/BooleanLiteralSymExp";
import {NullLiteralSymExp} from "../expressions/NullLiteralSymExp";
import {NumberLiteralSymExp} from "../expressions/NumberLiteralSymExp";
import {StringLiteralSymExp} from "../expressions/StringLiteralSymExp";
import {UndefinedLiteralSymExp} from "../expressions/UndefinedLiteralSymExp";
import {StringPropertySymExp} from "../expressions/StringPropertySymExp";
import {StringMethodSymExp} from "../expressions/StringMethodSymExp";
import {PrefixUnarySymExp} from "../expressions/PrefixUnarySymExp";
import {factory} from "../../ConfigLog4j";
import {ISymbolicExpression} from "../expressions/ISymbolicExpression";
import {Utils} from "../../utils/Utils";

export class ExpressionConstraint extends Constraint {
    public static logger = factory.getLogger("ExpressionConstraint");
    private _symbolicExpression: SymbolicExpression;

    constructor(expression: Expression, symbolicExpression: SymbolicExpression) {
        super(expression);
        this._symbolicExpression = symbolicExpression;
    }

    toZ3Text(): string {
        if (this._symbolicExpression instanceof StringMethodSymExp) {
            return this._symbolicExpression.toZ3Text();
        } else if (this._symbolicExpression instanceof PrefixUnarySymExp) {
            return this._symbolicExpression.toZ3Text();
        }
        if (this._symbolicExpression.isNull() == true) return Z3Keyword.FALSE;
        else return Z3Keyword.TRUE;

    }

    getSymbolicExpression(): SymbolicExpression {
        return this._symbolicExpression;
    }

    setSymbolicExpression(value: SymbolicExpression) {
        this._symbolicExpression = value;
    }

    static tranfer(expression: Expression, table: SymbolicTable): ISymbolicExpression {
        if (expression instanceof LiteralExpression) {
            if (expression instanceof NullLiteral) {
            // let newConstraint = new NullLiteralConstraint(expression);
                return new NullLiteralSymExp();
            // return newConstraint;
            } else if (expression instanceof NumericLiteral) {
                return new NumberLiteralSymExp(Number(expression.getText()));
            // return newConstraint;
            } else if (expression instanceof StringLiteral) {
                return new StringLiteralSymExp(expression.getText());
                // return newConstraint;
            }

            // else if (expression instanceof ArrayLiteralExpression) {
            //     return  new ArrayLiteralSymExp(expression);
            //     // return newConstraint;
            // }
        } else if (expression instanceof PrimaryExpression) {
            if (expression instanceof BooleanLiteral) {
                return new BooleanLiteralSymExp(expression.getText());
            } else if (expression instanceof Identifier) {
                if (expression.getText() === "undefined") {
                    return new UndefinedLiteralSymExp();
                    // return newConstraint;
                } else {
                    // let identifierName = expression.getText();
                    // let symbolicVar = table.findByName(identifierName);
                    let symbolicVar = table.findByExpressionTextAndCreate(expression);
                    let value = symbolicVar.getValue();
                    return value;
                }
            }
        }
        else if (expression instanceof PropertyAccessExpression) {
            return ExpressionConstraint.transferPropertyAccessExpression(expression, table);
        } else if (expression instanceof CallExpression) {
            return ExpressionConstraint.transferCallExpression(expression, table);
            // return ExpressionConstraint.transferStringMethodAccessExpression(expression, table);
        } else if (expression instanceof PrefixUnaryExpression) {
            let expressionText = expression.getText();
            return ExpressionConstraint.transferPrefixUnaryExpression(expression, table);
        } else if (expression instanceof ElementAccessExpression) {
            return ExpressionConstraint.transferElementAccessExpression(expression, table);
        }
        else if (expression instanceof BinaryExpression) {
            let operator = expression.getOperatorToken().getText();
            let right = expression.getRight();
            let left = expression.getLeft();
            let symbolicLeft = ExpressionConstraint.tranfer(left, table);
            let symbolicRight = ExpressionConstraint.tranfer(right, table);
            return new BinarySymbolicExpression(operator, symbolicLeft, symbolicRight);
        } else {
            this.logger.error("Dont support this expression: " + expression.getText());
        }
    }

    static transferPropertyAccessExpression(expression: PropertyAccessExpression, table: SymbolicTable): SymbolicExpression {
        let identifierExpression = expression.getExpression();
        let lastPropertyAccess: string = expression.getName();
        let typeText = identifierExpression.getType().getText();
        if (identifierExpression.getType().getText() === "string" && lastPropertyAccess === "length") {
            let symbolicIdentifier = ExpressionConstraint.tranfer(identifierExpression, table);
            return new StringPropertySymExp(lastPropertyAccess, symbolicIdentifier);
        } else {
            // let identifier = expression.getText();
            let symbolicVariable = table.findByExpressionTextAndCreate(expression);
            return symbolicVariable.getValue();
        }
    }

    static transferElementAccessExpression(expression: ElementAccessExpression, table: SymbolicTable): SymbolicExpression {
        let symbolicVariable = table.findByExpressionTextAndCreate(expression);
        return symbolicVariable.getValue();
    }

    static transferCallExpression(expression: CallExpression, table: SymbolicTable): SymbolicExpression {
        //sv.getName() => sv.getName; sv.getName().startWith();
        let propertyAccessExpression = expression.getExpression();
        let typeOfExpression = this.checkPropertyAccessExpressionType(expression);
        if (propertyAccessExpression instanceof PropertyAccessExpression) {
            // console.log(propertyAccessExpression.getSymbol().getFullyQualifiedName());
            // propertyAccessExpression.getSymbol().getDeclarations().forEach(declaration => {
            //     console.log("Declaration: " + declaration.getText());
            // })
            let lastProperty = propertyAccessExpression.getName();
            let subPropertyAccessExpression = propertyAccessExpression.getExpression();

            //for test
            // if (subPropertyAccessExpression instanceof Identifier) {
            //     subPropertyAccessExpression.getDefinitions().forEach(infor => {
            //         console.log("Name: ", infor.getName());
            //         console.log("Kind: ", infor.getKind().toString());
            //         console.log("getContainerName: ", infor.getContainerName());
            //         console.log("NodeText: ", infor.getNode().getText());
            //
            //     })
            // }


            if (subPropertyAccessExpression.getType().getText() === "string" || Utils.isStringMethodSupporting(lastProperty)) {
                return this.transferStringMethodAccessExpression(expression, table);
            } else {
                let type = expression.getType().getText();
                // let symVar = table.findByNameAndCreate(expression.getText(), type, expression, typeOfExpression);
                let symVar = table.findByExpressionTextAndCreate(expression);
                return symVar.getValue();
                // let getterRegex = new RegExp("gets(\\w+)\\((.*)\\)", "g");
                // if (expression.getText().match(getterRegex)) {
                //     let newExpressionText = expression.getText().replace(getterRegex, (match, p1) => {
                //         return p1.toLowerCase();
                //     });
                //     let symVar = table.findByNameAndCreate(newExpressionText, type, propertyAccessExpression, typeOfExpression);
                //     return symVar.getValue();
                // } else {
                //
                // }

            }

        } else if (propertyAccessExpression instanceof Identifier) {
            // propertyAccessExpression.getDefinitions().forEach(infor => {
            //     console.log("Name: ", infor.getName());
            //     console.log("Kind: ", infor.getKind().toString());
            //     console.log("getContainerName: ", infor.getContainerName());
            //     console.log("NodeText: ", infor.getNode().getText());
            //
            // });
            // let declaration = propertyAccessExpression.getSymbol().getName();
            // console.log(propertyAccessExpression.getSymbol().getFullyQualifiedName());
            // propertyAccessExpression.getSymbol().getDeclarations().forEach(declaration => {
            //     console.log("Declaration: " + declaration.getText());
            // });

            let type = expression.getType().getText();
            if (typeOfExpression === PropertyAccessExpressionType.EXTERNAL_FUNCTION) {
                let symVar = table.findByNameAndCreate(propertyAccessExpression.getText(), type, expression, typeOfExpression);
                return symVar.getValue();
            }
        }
        else {
            this.logger.error("Dont support this call expression: " + expression.getText());
            return ;
        }
    }

    static transferStringMethodAccessExpression(expression: CallExpression, table: SymbolicTable): SymbolicExpression {
        let argumentList = expression.getArguments();
        let argOrderNumber: number = -1;
        let stringPropertyAccessExpression: PropertyAccessExpression = expression.getExpression() as PropertyAccessExpression;
        let methodName = stringPropertyAccessExpression.getName();
        let stringIdentifier = stringPropertyAccessExpression.getExpression();
        let symbolicIdentifier = ExpressionConstraint.tranfer(stringIdentifier, table);
        let symbolicArgumentList: Array<SymbolicExpression> = [];
        argumentList.forEach(arg => {
            argOrderNumber++;
            if (arg instanceof Expression) {
                let symbolicArg = ExpressionConstraint.tranfer(arg, table);
                symbolicArgumentList.push(symbolicArg);
            } else {
                this.logger.error("Dont support argument kind: " +  arg.getKind().toString());
            }
        });
        return new StringMethodSymExp(methodName, symbolicIdentifier, symbolicArgumentList);
    }

    static transferPrefixUnaryExpression(expression: PrefixUnaryExpression, table: SymbolicTable): PrefixUnarySymExp {
        let operator = expression.getOperatorToken();
        let operatorText = operator.toString();
        if (operator === SyntaxKind.ExclamationToken) {
            let unaryExpression: Expression = expression.getOperand();
            while (unaryExpression instanceof ParenthesizedExpression) {
                unaryExpression = unaryExpression.getExpression();
            }
            let symbolicExpression = ExpressionConstraint.tranfer(unaryExpression, table);
            return new PrefixUnarySymExp(symbolicExpression, "!");
        } else if (operator === SyntaxKind.MinusToken) {
            let unaryExpression: Expression = expression.getOperand();
            while (unaryExpression instanceof ParenthesizedExpression) {
                unaryExpression = unaryExpression.getExpression();
            }
            let symbolicExpression = ExpressionConstraint.tranfer(unaryExpression, table);
            return new PrefixUnarySymExp(symbolicExpression, "-");
        }
        else {
            ExpressionConstraint.logger.error("Catch unspecified operator in prefix unary expression: " + expression.getText());
        }
    }

    static checkPropertyAccessExpressionType(expression: Expression): number {
        let expressionText = expression.getText();
        let tmp = expression;
        // while (tmp instanceof PropertyAccessExpression) {
        //     tmp = tmp.getExpression();
        // }
        while (true) {
            if (tmp instanceof PropertyAccessExpression) {
                tmp = tmp.getExpression();
            } else if (tmp instanceof CallExpression) {
                tmp = tmp.getExpression();
            } else if (tmp instanceof ElementAccessExpression) {
                tmp = tmp.getExpression();
            } else if (tmp instanceof Identifier || tmp instanceof LiteralExpression) {
                break;
            }
        }
        if (tmp instanceof Identifier) {
            let type = tmp.getDefinitions()[0].getKind();
            if (type === "function") {
                return PropertyAccessExpressionType.EXTERNAL_FUNCTION;
            } else if (type === "parameter") {
                return PropertyAccessExpressionType.PARAMETER;
            } else if (type === "class") {
                return PropertyAccessExpressionType.STATIC_METHOD;
            } else if (type === "let" || type === "const" || type === "var") {
                return PropertyAccessExpressionType.DECLARED;
            } else {
                return PropertyAccessExpressionType.UNSPECIFIED;
            }
        } else {
            this.logger.error("Can not detect first item: " + tmp + " in expression: " + expression.getText());
            return PropertyAccessExpressionType.UNSPECIFIED;
        }
    }
}

export enum PropertyAccessExpressionType {
    PARAMETER,
    EXTERNAL_FUNCTION,
    STATIC_METHOD,
    DECLARED,
    UNSPECIFIED
}
