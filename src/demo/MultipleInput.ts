import { Input } from "./Input";

export class MultipleInput {
    private _inputs: Array<Input>;


    constructor(inputs: Array<Input>) {
        this._inputs = inputs;
    }

    getInputs(): Array<Input> {
        return this._inputs;
    }

    setInputs(value: Array<Input>) {
        this._inputs = value;
    }
}
