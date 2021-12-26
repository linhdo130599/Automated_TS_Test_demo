import {SymbolicExpression} from "./SymbolicExpression";
import {Z3Convert} from "../z3convert/Z3Convert";

export class InitializedSymbolicExpression extends SymbolicExpression {
    private _identifier: string;
    private _type: string;


    constructor(identifier: string, type: string) {
        super();
        this._identifier = identifier;
        this._type = type;
    }

    getIdentifier(): string {
        return this._identifier;
    }

    setIdentifier(value: string) {
        this._identifier = value;
    }

    toZ3Text(): string {
        return this._identifier;
    }

    isNull(): boolean {
        return false;
    }

    getType(): string {
        return this._type;
    }
}
