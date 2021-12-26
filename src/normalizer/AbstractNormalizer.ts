import {IFunctionNormalizer} from "./IFunctionNormalizer";
import {FunctionDeclaration} from "ts-morph";

export abstract class AbstractNormalizer {
    private _originalSourcecode: string;
    private _normalizeSourcecode: string;

    constructor(originalSourcecode: string) {
        this._originalSourcecode = originalSourcecode;
    }


    getOriginalSourcecode(): string {
        return this._originalSourcecode;
    }

    setOriginalSourcecode(value: string) {
        this._originalSourcecode = value;
    }

    getNormalizeSourcecode(): string {
        return this._normalizeSourcecode;
    }

    setNormalizeSourcecode(value: string) {
        this._normalizeSourcecode = value;
    }
}
