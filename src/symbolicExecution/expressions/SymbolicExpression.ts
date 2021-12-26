import {ISymbolicExpression} from "./ISymbolicExpression";
import {Z3Convert} from "../z3convert/Z3Convert";

export abstract class SymbolicExpression implements ISymbolicExpression {
    abstract toZ3Text(): string;
    abstract isNull(): boolean;
    abstract getType(): string ;

}
