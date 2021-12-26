import {FunctionDeclaration} from "ts-morph";
import {AbstractStubData} from "./StubData";

export class ExternalFunctionStubData extends AbstractStubData {
    private _functionNode: FunctionDeclaration;
    private _stubValues: Map<number, string> = new Map();


    constructor(functionNode: FunctionDeclaration, tescaseOrder: number, value: string) {
        super();
        this._functionNode = functionNode;
        this._stubValues.set(tescaseOrder, value);
    }

    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }

    getStubValues(): Map<number, string> {
        return this._stubValues;
    }

    setStubValues(value: Map<number, string>) {
        this._stubValues = value;
    }
}
