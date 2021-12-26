import {LiteralSymbolicExpression} from "./LiteralSymbolicExpression";

export class NullLiteralSymExp extends LiteralSymbolicExpression{
    toZ3Text() {
        return "nil";
    }

    isNull(): boolean {
        return true;
    }

    getType(): string {
        return "null";
    }
}
