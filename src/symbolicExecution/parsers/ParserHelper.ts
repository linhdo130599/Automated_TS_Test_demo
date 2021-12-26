import {BinaryExpression, Identifier} from "ts-morph";

// a = a + 1, a = a++;
export function isIdentifierAssignmentExpression(expression: BinaryExpression): boolean {
    const left = expression.getLeft();
    const right = expression.getRight();
    if (left instanceof Identifier) return true;
    else return false;
}