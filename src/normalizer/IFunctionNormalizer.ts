import {FunctionDeclaration} from "ts-morph";
import {PropertyAccessChangedToken} from "./PropertyAccessChangedToken";

export interface IFunctionNormalizer {
    normalize(functionNode: FunctionDeclaration): FunctionDeclaration;
    getChangedTokens(): Map<string, PropertyAccessChangedToken>;
    // setFunctionNode(functionNode: FunctionDeclaration): void;
    // getFunctionNode(): FunctionDeclaration;
    // setNormalizedFunctionNode(functionNode: FunctionDeclaration): void;
    // getNormalizedFunctionNode(): FunctionDeclaration;
}
