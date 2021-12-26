import {Z3Convert} from "../z3convert/Z3Convert";

export interface ISymbolicExpression extends Z3Convert{
    isNull(): boolean;
    getType(): string;
}
