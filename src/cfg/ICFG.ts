import {ICfgNode} from "./nodes/ICfgNode";
import {FunctionDeclaration, Node} from "ts-morph";

export interface ICFG {
    findById: () => ICfgNode ;
    getBeginNode: () => ICfgNode;
    computeNumberOfNode: () => number;
    getAllNodes: () => Array<ICfgNode>;
    resetVisitedState(): void;
    getFunctionNode(): FunctionDeclaration;
}
