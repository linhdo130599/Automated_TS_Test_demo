import {ICFG} from "../ICFG";
import {FunctionDeclaration} from "ts-morph";

export interface ICFGGeneration {
    generateCFG: () => ICFG;
    getFunctionNode(): FunctionDeclaration;
    setFunctionNode(functionNode : FunctionDeclaration): void;
}
