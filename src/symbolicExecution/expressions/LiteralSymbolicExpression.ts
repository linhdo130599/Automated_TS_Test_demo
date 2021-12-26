import {Z3Convert} from "../z3convert/Z3Convert";
import {SymbolicExpression} from "./SymbolicExpression";

export abstract class LiteralSymbolicExpression extends SymbolicExpression implements Z3Convert{
    abstract toZ3Text(): string;
}
