import {factory} from "../../ConfigLog4j";
import {
    ArrayLiteralExpression,
    Expression,
    ExpressionStatement,
    ObjectLiteralExpression,
    Statement,
    VariableDeclaration,
    VariableStatement
} from "ts-morph";
import {SymbolicVariable} from "../variables/SymbolicVariable";
import {SymbolicTable} from "../SymbolicTable";
import {ExpressionStatementParser} from "./ExpressionStatementParser";
import {UndefinedLiteralSymExp} from "../expressions/UndefinedLiteralSymExp";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {BooleanSymbolicVaribale} from "../variables/BooleanSymbolicVaribale";
import {ExpressionConstraint} from "../constraints/ExpressionConstraint";
import {NumberSymbolicVariable} from "../variables/NumberSymbolicVariable";
import {StringSymbolicVariable} from "../variables/StringSymbolicVariable";
import {Utils} from "../../utils/Utils";

export class StatementParser {
    public static logger = factory.getLogger("StatementParser");

    parse(statement: Statement, table: SymbolicTable) {
        if (statement instanceof ExpressionStatement) {
            new ExpressionStatementParser().parseExpression(statement, table);
        } else if (statement instanceof VariableStatement) {
            this.parseVariableDeclaration(statement, table);
        }
    }

    parseVariableDeclaration(statement: VariableStatement, table: SymbolicTable) {
        let declarations: VariableDeclaration[] = statement.getDeclarations();
        declarations.forEach((item) => {
            // console.log(item.getText());
            // console.log(item.getType().getText());
            let newVarName: string = item.getName();
            let newVarType: string = item.getType().getText();
            let initializer: Expression = item.getInitializer();
            let defaultValue: SymbolicExpression;
            let newSymbolicVariable;
            if (initializer == null) {
                // defaultValue = Utils.getDefaultSymbolicVariableValue(newVarType, newVarName);
                defaultValue = new UndefinedLiteralSymExp();
                newSymbolicVariable = Utils.createSymVarByType(newVarType, newVarName, defaultValue);
                if (newSymbolicVariable != null) {
                    table.push(newSymbolicVariable);
                }
                return;
            } else {
                if (initializer instanceof ObjectLiteralExpression) {
                    ExpressionStatementParser.transferAssignToObjectLiteralExpression(newVarName, initializer, table);
                } else if (initializer instanceof ArrayLiteralExpression) {
                    ExpressionStatementParser.transferAssignToArrayLiteralExpression(newVarName, initializer, table);
                }

                else {
                    let initializerValue = ExpressionConstraint.tranfer(initializer, table);
                    if (initializerValue != null) {
                        newSymbolicVariable = Utils.createSymVarByType(newVarType, newVarName, initializerValue);
                        if (newSymbolicVariable != null) table.push(newSymbolicVariable);
                        //null khi kieu tra ve cua bien khong phai la primitive
                    }
                    return;
                }
            }
        })
    }
}
