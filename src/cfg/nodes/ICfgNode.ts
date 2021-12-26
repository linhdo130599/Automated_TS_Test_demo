import {Expression} from "ts-morph";

export interface ICfgNode {
    getContent : () => string;
    setContent : (content: string) => void;
    getId: () => number;
    setId: (id : number) => void;
    setBranch(cfgNode: ICfgNode): void;
    getTrueNode(): ICfgNode;
    setTrueNode(cfgNode: ICfgNode): void;
    getFalseNode(): ICfgNode;
    setFalseNode(cfgNode: ICfgNode): void;
    isVisited(): boolean;
    setVisited(visited: boolean): void
    getParent(): ICfgNode;
    setParent(parent: ICfgNode): void;
    // getExpression(): Expression;
    // content: () => string;
    // content(content: string): void;
    // id(): number;
    // id(id : number): void;
}
