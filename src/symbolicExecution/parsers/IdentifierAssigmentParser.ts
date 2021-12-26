// import {
//     ArrayLiteralExpression,
//     BinaryExpression, BooleanLiteral,
//     Expression, Identifier,
//     LiteralExpression, NullLiteral,
//     NumericLiteral,
//     PrimaryExpression,
//     StringLiteral
// } from "ts-morph";
// import {factory} from "../../ConfigLog4j";
// import {SymbolicTable} from "../SymbolicTable";
// import {isIdentifierAssignmentExpression} from "./ParserHelper";
// import {ISymbolicVariable} from "../variables/ISymbolicVariable";
// import {ExpressionConstraint} from "../constraints/ExpressionConstraint";
//
// export class IdentifierAssigmentParser {
//     public static logger = factory.getLogger("IdentifierAssigmentParser");
//     parse(expression: BinaryExpression, table: SymbolicTable) : void {
//         if (isIdentifierAssignmentExpression(expression) == false) {
//             throw new Error("Expression: " + expression.getText() + " is not identifierAssignmentExpression");
//         } else {
//             let left: Expression = expression.getLeft();
//             let right: Expression = expression.getRight();
//             let rightSymbolic = ExpressionConstraint.tranfer(right, table);
//             table.updateValue(left.getText(), rightSymbolic);
//         }
//     }
// }
