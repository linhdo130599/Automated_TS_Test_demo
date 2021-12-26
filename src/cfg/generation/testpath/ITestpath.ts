import {FunctionDeclaration} from "ts-morph";
import {ICfgNode} from "../../nodes/ICfgNode";
import {FlagCondition} from "./FlagCondition";

export interface ITestpath {
    setFunctionNode(node: FunctionDeclaration): void;
    push(node: ICfgNode): void;
    pop(): void;
    getElements(): Array<ICfgNode>;
    setFlags(flags: Array<FlagCondition>);
    getFlags(): Array<FlagCondition>;
    getFunctionNode(): FunctionDeclaration;

}
