import {ISymbolicExpression} from "../expressions/ISymbolicExpression";
import {Z3Convert} from "../z3convert/Z3Convert";
import {SymbolicExpression} from "../expressions/SymbolicExpression";

export interface ISymbolicVariable {
    getScopeLevel(): number;
    getValue(): ISymbolicExpression;
    setValue(symExp: SymbolicExpression): void;
    getName(): string;
    setName(name: string): void;
    // getType(): string;

}
