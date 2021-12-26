import {FunctionDeclaration} from "ts-morph";
import {JSONArray} from "typescript-logging";

export class SingleFunctionTestdata {
    private _functionNode: FunctionDeclaration;
    private _inputs: Array<Array<any>>;


    constructor(functionNode: FunctionDeclaration, inputs: Array<Array<any>>) {
        this._functionNode = functionNode;
        this._inputs = inputs;
    }


    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }

    getInputs(): Array<Array<any>> {
        return this._inputs;
    }

    setInputs(value: Array<Array<any>>) {
        this._inputs = value;
    }
}
