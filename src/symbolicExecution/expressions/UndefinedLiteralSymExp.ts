import {LiteralSymbolicExpression} from "./LiteralSymbolicExpression";

export class UndefinedLiteralSymExp extends LiteralSymbolicExpression {
    toZ3Text() {
        return "nil";
    }

    isNull(): boolean {
        return true;
    }

    getType(): string {
        return "undefined";
    }

}
