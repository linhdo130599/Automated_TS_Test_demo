import {factory} from "../../ConfigLog4j";
import {
    ArrayLiteralExpression,
    BinaryExpression,
    CallExpression,
    ElementAccessExpression,
    Expression,
    ExpressionStatement,
    Identifier,
    LiteralExpression,
    NewExpression, NumericLiteral,
    ObjectLiteralExpression,
    PostfixUnaryExpression,
    PrefixUnaryExpression,
    PrimaryExpression,
    PropertyAccessExpression, PropertyAssignment, StringLiteral
} from "ts-morph";
import {SymbolicTable} from "../SymbolicTable";
import {ExpressionConstraint} from "../constraints/ExpressionConstraint";
import {BinarySymbolicExpression} from "../expressions/BinarySymbolicExpression";
import {numericLiteralSymbolicValue} from "tslint-sonarts/lib/se/symbolicValues";
import {NumberLiteralSymExp} from "../expressions/NumberLiteralSymExp";
import {NumberSymbolicVariable} from "../variables/NumberSymbolicVariable";
import {SyntaxKind} from "typescript/lib/tsserverlibrary";
import {Utils} from "../../utils/Utils";
import {ISymbolicExpression} from "../expressions/ISymbolicExpression";
import {UndefinedLiteralSymExp} from "../expressions/UndefinedLiteralSymExp";

export class ExpressionStatementParser{
    public static readonly NORMAL_ASSIGNMENT: number = 1;
    public static readonly MULTIPLE_ASSIGNMENT: number = 2;
    public static readonly NEW_ASSIGNMENT: number = 3;
    public static readonly UNSPECIFIED_ASSIGNMENT: number = 4;
    public static readonly CALL_EXPRESSION: number = 5;
    public static readonly ASSIGN_TO_OBJECT_lITERAL_EXPRESSION: number = 6;
    public static readonly ASSIGN_TO_ARRAY_lITERAL_EXPRESSION: number = 7;
    public static logger = factory.getLogger("ExpressionStatementParser");
    parseExpression(statement: ExpressionStatement, table: SymbolicTable) {
        const expression = statement.getExpression();
        // console.log(expression.getType().getText());
        if (expression instanceof CallExpression) {
            //TODO.....
            ExpressionStatementParser.logger.error("Catch call expression: " + expression.getText());
        } else if (expression instanceof PrefixUnaryExpression) {
            //TODO.....
            ExpressionStatementParser.logger.error("Catch PrefixUnaryExpression: " + expression.getText() + " while parsing statement expression!");
        } else if (expression instanceof PostfixUnaryExpression) {
            //TODO.....
            console.log(expression.getText());
            let operator = expression.getOperatorToken();
            let subExp = expression.getOperand();
            console.log(subExp.getText());
            if (operator === 44 ) {
                let symVar = table.findByExpressionTextAndCreate(subExp);
                let oldValue = symVar.getValue();
                let numberLiter = new NumberLiteralSymExp(1);
                let newValue = new BinarySymbolicExpression("+", oldValue, numberLiter );
                symVar.setValue(newValue);
            } else if (operator === 45){
                let symVar = table.findByExpressionTextAndCreate(subExp);
                let oldValue = symVar.getValue();
                let numberLiter = new NumberLiteralSymExp(1);
                let newValue = new BinarySymbolicExpression("-", oldValue, numberLiter );
                symVar.setValue(newValue);
            }
            // ExpressionStatementParser.logger.error("Catch PostfixUnaryExpression: " + expression.getText() + " while parsing statement expression!");

        }
        else if (expression instanceof BinaryExpression) {
            this.parseBinaryExpression(expression, table);
        } else {
            expression.getType().getText();
            ExpressionStatementParser.logger.error("Dont support this expression: " + statement.getText());
        }
    }

    parseBinaryExpression(expression: BinaryExpression, table: SymbolicTable) {
        let operator = expression.getOperatorToken();
        if (operator.getText() !== "=") {
            ExpressionStatementParser.logger.error(" Haven't implemented handling this expression: " + expression.getText());
        }
        const type: number = ExpressionStatementParser.getTypeOfAssignmentExpression(expression);
        switch (type) {
            case ExpressionStatementParser.NORMAL_ASSIGNMENT: {
                // console.log("normal binary expression: " + expression.getText());
                this.parseNormalBinaryExpression(expression, table);
                break;
            }
            case ExpressionStatementParser.MULTIPLE_ASSIGNMENT: {
                console.log("multiple binary expression" + expression.getText());
                this.parseMultipleBinaryExpression(expression, table);
                break;
            }

            case ExpressionStatementParser.NEW_ASSIGNMENT: {
                //ToDO must have to implement
                ExpressionStatementParser.logger.error("Temporarily pending: " + expression.getText());
                break;
            }

            case ExpressionStatementParser.CALL_EXPRESSION: {
                break;
            }

            case ExpressionStatementParser.ASSIGN_TO_OBJECT_lITERAL_EXPRESSION: {
                let left = expression.getLeft();
                let right = expression.getRight();
                if (right instanceof ObjectLiteralExpression) {
                    ExpressionStatementParser.transferAssignToObjectLiteralExpression(left.getText(), right, table);
                }
                break;
            }

            case ExpressionStatementParser.ASSIGN_TO_ARRAY_lITERAL_EXPRESSION: {
                let left = expression.getLeft();
                let right = expression.getRight();
                if (right instanceof ArrayLiteralExpression) {
                    ExpressionStatementParser.transferAssignToArrayLiteralExpression(left.getText(), right, table)
                }
            }

            default: {
                ExpressionStatementParser.logger.error("Dont support this expression: " + expression.getText());
                break;
            }
        }
    }

    parseNormalBinaryExpression(expression: BinaryExpression, table: SymbolicTable) {
        const left: Expression = expression.getLeft();
        let right: Expression = expression.getRight();
        if (left instanceof PrimaryExpression) {
            if (left instanceof Identifier) {
                // a = a + 1;
                const right = expression.getRight();
                let rightSymExp = ExpressionConstraint.tranfer(right, table);
                let symVar = table.findByExpressionTextAndCreate(left);
                symVar.setValue(rightSymExp);
                // table.updateValue(left.getText(), rightSymExp);
                // new IdentifierAssigmentParser().parse(expression, table);

            }
            else if (left instanceof ArrayLiteralExpression) {
                ExpressionStatementParser.logger.error("Not support left expression: " + left.getText() + " in expression: " + expression.getText());
            }
        } else if (left instanceof ElementAccessExpression) {
            let symbolicVariable = table.findByExpressionTextAndCreate(left);
            let valueSymbolicExpression = ExpressionConstraint.tranfer(right, table);
            symbolicVariable.setValue(valueSymbolicExpression);
        }
        else {
            ExpressionStatementParser.logger.error("Only support PrimaryExpression: " + expression.getText());
        }
    }


    parseMultipleBinaryExpression(expression: Expression, table: SymbolicTable) {
        if (expression instanceof BinaryExpression) {
            let token = expression.getOperatorToken().getText();
            if (token === ",") {
                let left = expression.getLeft();
                this.parseMultipleBinaryExpression(left, table);
                let right = expression.getRight();
                this.parseMultipleBinaryExpression(right, table);
            } else if (token === "=") {
                let type = ExpressionStatementParser.getTypeOfAssignmentExpression(expression);
                if (type == ExpressionStatementParser.MULTIPLE_ASSIGNMENT) {
                    this.parseMultipleAssignment(expression, table);
                } else if (type == ExpressionStatementParser.NORMAL_ASSIGNMENT) {
                    this.parseNormalBinaryExpression(expression, table);
                }
            }
        } else {
            ExpressionStatementParser.logger.error("Catch unknown multiple assignment: " + expression.getText());
        }
    }

    //a=b=c=d= Expression
    parseMultipleAssignment(expression: BinaryExpression, table: SymbolicTable) {
        // let identifilers = new Array<string>();
        // let right: Expression = expression.getRight();
        // let left: Expression = expression.getLeft();
        // identifilers.push(left.getText());
        // if (right instanceof BinaryExpression) {
        //     let type = ExpressionStatementParser.getTypeOfAssignmentExpression(right);
        //     while (right instanceof BinaryExpression && type == ExpressionStatementParser.MULTIPLE_ASSIGNMENT) {
        //         left = right.getLeft();
        //         identifilers.push(left.getText());
        //         right = right.getRight();
        //         type = ExpressionStatementParser.getTypeOfAssignmentExpression(right as BinaryExpression);
        //     }
        //     if (right instanceof BinaryExpression) {
        //         //Ex a=b=c=d=c+1 => [a,b,c]
        //         //=> {d}
        //         let lastIdentifier = right.getLeft();
        //         let lastRight = right.getRight();
        //         identifilers.push(lastIdentifier.getText());
        //         let symbolicRight = ExpressionConstraint.tranfer(lastRight, table);
        //         if (symbolicRight != null) table.updateValues(identifilers, symbolicRight);
        //     }
        // }

        let identifilers = new Array<Expression>();
        let right: Expression = expression.getRight();
        let left: Expression = expression.getLeft();
        identifilers.push(left);
        if (right instanceof BinaryExpression) {
            let type = ExpressionStatementParser.getTypeOfAssignmentExpression(right);
            while (right instanceof BinaryExpression && type == ExpressionStatementParser.MULTIPLE_ASSIGNMENT) {
                left = right.getLeft();
                identifilers.push(left);
                right = right.getRight();
                type = ExpressionStatementParser.getTypeOfAssignmentExpression(right as BinaryExpression);
            }
            if (right instanceof BinaryExpression) {
                //Ex a=b=c=d=c+1 => [a,b,c]
                //=> {d}
                let lastIdentifier = right.getLeft();
                let lastRight = right.getRight();
                identifilers.push(lastIdentifier);
                let symbolicRight = ExpressionConstraint.tranfer(lastRight, table);
                if (symbolicRight != null) table.updateValuesByExpression(identifilers, symbolicRight);
            }
        }
    }

    static getTypeOfAssignmentExpression(expression: BinaryExpression): number {
        // //TODO implement
        // if (expression instanceof CallExpression) {
        //     return ExpressionStatementParser.CALL_EXPRESSION;
        // }
        const right = expression.getRight();
        if (right instanceof NewExpression) {
            return ExpressionStatementParser.NEW_ASSIGNMENT;
        }
        else if (right instanceof BinaryExpression) {
            let right2Text = right.getText();
            if (right2Text.includes("=")) return ExpressionStatementParser.MULTIPLE_ASSIGNMENT;
            else return ExpressionStatementParser.NORMAL_ASSIGNMENT;
        } else if (right instanceof LiteralExpression) {
            return ExpressionStatementParser.NORMAL_ASSIGNMENT;
        } else if (right instanceof PropertyAccessExpression) {
            return ExpressionStatementParser.NORMAL_ASSIGNMENT;
        } else if (right instanceof ElementAccessExpression) {
            return ExpressionStatementParser.NORMAL_ASSIGNMENT;
        }
        else if (right instanceof PrimaryExpression) {
            if (right instanceof ObjectLiteralExpression) {
                return ExpressionStatementParser.ASSIGN_TO_OBJECT_lITERAL_EXPRESSION;
            } else if (right instanceof ArrayLiteralExpression) {
                return ExpressionStatementParser.ASSIGN_TO_ARRAY_lITERAL_EXPRESSION;
            }
            else {
                this.logger.debug("Catch right primary expression: " + expression.getText());
                return ExpressionStatementParser.NORMAL_ASSIGNMENT;
            }

        }
        this.logger.error("Dont support this expression: " + expression.getText());
        return ExpressionStatementParser.UNSPECIFIED_ASSIGNMENT;
    }

    static transferAssignToObjectLiteralExpression(name: string, value: ObjectLiteralExpression, table: SymbolicTable) {
        let properties = value.getProperties();
        properties.forEach(property => {
            if (property instanceof PropertyAssignment) {
                this.createNewVarFromPropertyAssignment(name, property, table);

            }
            else {
                ExpressionStatementParser.logger.error("Catch Invalid property:" + property.getText()
                                            + " in object literal expression: " + value.getText());
            }

        })

    }

    static transferAssignToArrayLiteralExpression(name: string, value: ArrayLiteralExpression, table: SymbolicTable) {
        let elements = value.getElements();

        // string[] => string, number[]=> number
        let type = value.getType().getText().replace("[]", "");
        for (var i = 0; i < elements.length; i++) {
            this.createNewVarFromArrayAccessExpression(name, i, elements[i], table);
        }
    }

    static createNewVarFromArrayAccessExpression(name: string, index: number, value: Expression, table: SymbolicTable): void {
        let accessText = name + "[" + index + "]";
        if (value instanceof ArrayLiteralExpression) {
            this.transferAssignToArrayLiteralExpression(accessText, value, table);
        } else if (value instanceof ObjectLiteralExpression) {
            this.transferAssignToObjectLiteralExpression(accessText, value, table);
        } else {
            // let type = "number";
            // if (value instanceof Identifier) {
            //     type = value.getType().getText();
            // } else if (value instanceof StringLiteral) {
            //     type = "string";
            // } else if (value instanceof NumericLiteral) {
            //     type = ""
            // }

            let valueSymExp = ExpressionConstraint.tranfer(value, table);
            let newVar = table.findByNameAndCreate(accessText, valueSymExp.getType());
            newVar.setValue(valueSymExp);
        }
    }

    // a = {first: "fsdf", right: "dfsdfs"} => a____first = "dfsd", a____right = "fsdds"
    static createNewVarFromPropertyAssignment(startName: string, property: PropertyAssignment, table: SymbolicTable) {
        let propertyName = property.getStructure().name;
        let fullName = startName + "." + propertyName;
        let propetyValue = property.getInitializer();
        if (propetyValue instanceof ObjectLiteralExpression) {
            this.transferAssignToObjectLiteralExpression(fullName, propetyValue, table);
        } else if (propetyValue instanceof ArrayLiteralExpression) {
            this.transferAssignToArrayLiteralExpression(fullName, propetyValue, table);
        }
        else {
            let type = property.getType().getText();
            let newVar = table.findByNameAndCreate(fullName, type);
            let valueSymExp = ExpressionConstraint.tranfer(propetyValue, table);
            newVar.setValue(valueSymExp);
        }
    }
}
