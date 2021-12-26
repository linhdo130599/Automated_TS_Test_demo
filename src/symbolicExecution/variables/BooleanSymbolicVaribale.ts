import {SymbolicVariable} from "./SymbolicVariable";
import {SymbolicExpression} from "../expressions/SymbolicExpression";

export class BooleanSymbolicVaribale extends SymbolicVariable {

    constructor(name: string, value: SymbolicExpression) {
        super(name, value);
    }
}
