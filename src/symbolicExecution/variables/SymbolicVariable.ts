import {ISymbolicVariable} from "./ISymbolicVariable";
import {SymbolicExpression} from "../expressions/SymbolicExpression";
import {factory} from "../../ConfigLog4j";

export class SymbolicVariable implements ISymbolicVariable {
    public static logger = factory.getLogger("SymbolicVariable");
    public static readonly PREFIX_SYMBOLIC_VALUE: string = "tvw_";
    public static readonly ARRAY_OPENING: string = "_dsgs_";
    public static readonly ARRAY_CLOSING: string = "_fdq_";
    public static readonly PARAM_OPENING: string = "_qaz_";
    public static readonly PARAM_CLOSING: string = "_wsx_";
    public static readonly SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES: string = "egt_______fes";
    // public static readonly SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES_2: string = "";
    private _name: string;
    private _value: SymbolicExpression;
    private _scopeLevel: number;

    constructor(name: string, value: SymbolicExpression) {
        this._name = name;
        this._value = value;
    }


    getName(): string {
        return this._name;
    }

    setName(value: string) {
        this._name = value;
    }

    getValue(): SymbolicExpression {
        return this._value;
    }

    setValue(value: SymbolicExpression) {
        this._value = value;
    }


    getScopeLevel(): number {
        return this._scopeLevel;
    }

    setScopeLevel(value: number) {
        this._scopeLevel = value;
    }
}
