import {MethodDeclaration} from "ts-morph";
import {AbstractStubData} from "./StubData";

export class StaticMethodStubData extends AbstractStubData {
    private _methodNode: MethodDeclaration;
    private _stubValues: Map<number, string> = new Map<number, string>();

    constructor(methodNode: MethodDeclaration) {
        super();
        this._methodNode = methodNode;
    }

    getMethodNode(): MethodDeclaration {
        return this._methodNode;
    }

    setMethodNode(value: MethodDeclaration) {
        this._methodNode = value;
    }

    getStubsValue(): Map<number, string> {
        return this._stubValues;
    }

    setStubsValue(value: Map<number, string>) {
        this._stubValues = value;
    }
}
