import {SymbolicExpression} from "./SymbolicExpression";
import {Z3Convert} from "../z3convert/Z3Convert";
import {wrapText} from "../z3convert/Z3Utils";

export class StringPropertySymExp extends SymbolicExpression {
    private _propertyName: string;
    private _identifier: SymbolicExpression;


    constructor(propertyName: string, identifier: SymbolicExpression) {
        super();
        this._propertyName = propertyName;
        this._identifier = identifier;
    }

    toZ3Text(): string {
        return wrapText("".concat("str.len ", this._identifier.toZ3Text()));
    }

    isNull(): boolean {
        return this._identifier.isNull();
    }

    getType(): string {
        return "number";
    }


    getPropertyName(): string {
        return this._propertyName;
    }

    setPropertyName(value: string) {
        this._propertyName = value;
    }

    getIdentifier(): SymbolicExpression {
        return this._identifier;
    }

    setIdentifier(value: SymbolicExpression) {
        this._identifier = value;
    }

}
