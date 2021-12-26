import {FunctionDeclaration, createWrappedNode, SourceFile, ImportDeclaration} from "ts-morph";
import {AbstractNormalizer} from "./AbstractNormalizer";
import {ParameterNormalizer} from "./ParameterNormalizer";
import {IFunctionNormalizer} from "./IFunctionNormalizer";
import {cloneFunctionNode} from "./NormalizerHelper";

export class FunctionNormalizer extends AbstractNormalizer {
    private _functionNode: FunctionDeclaration;
    private _normalizedFunctionNode: FunctionDeclaration;

    private _normalizers: Array<IFunctionNormalizer> = new Array();

    constructor(functionNode: FunctionDeclaration) {
        super(functionNode.getText());
        this._functionNode = functionNode;
        this._normalizers.push(new ParameterNormalizer());
    }

    normalize(): void {
        let cloneObject: FunctionDeclaration = cloneFunctionNode(this._functionNode);
        let normalizedFunctionNode: FunctionDeclaration = undefined;
        this._normalizers.forEach(normalizer => {
            normalizedFunctionNode = normalizer.normalize(cloneObject);
            cloneObject = normalizedFunctionNode;
        });
        this.setNormalizedFunctionNode(normalizedFunctionNode);
        cloneObject.getSourceFile().saveSync();
    }

    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }


    getNormalizers(): Array<IFunctionNormalizer> {
        return this._normalizers;
    }

    setNormalizers(value: Array<IFunctionNormalizer>) {
        this._normalizers = value;
    }

    getNormalizedFunctionNode(): FunctionDeclaration {
        return this._normalizedFunctionNode;
    }

    setNormalizedFunctionNode(value: FunctionDeclaration) {
        this._normalizedFunctionNode = value;
    }
}


