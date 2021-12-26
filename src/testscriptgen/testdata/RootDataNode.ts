import {AbstractDataNode} from "./AbstractDataNode";
import {FunctionDeclaration} from "ts-morph";

export class RootDataNode extends AbstractDataNode{
    private _functionNode: FunctionDeclaration;

    constructor(name: string, type: string, functionNode: FunctionDeclaration) {
        super(name, type);
        this._functionNode = functionNode;
    }

    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }
}


