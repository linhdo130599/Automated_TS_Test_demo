import {AbstractDataNode} from "./AbstractDataNode";

export class LiteralDataNode extends AbstractDataNode{
    private _value: string;


    constructor(name: string, type: string, value: string) {
        super(name, type);
        this._value = value;
    }

    getValue(): string {
        return this._value;
    }

    setValue(value: string) {
        this._value = value;
    }
}
