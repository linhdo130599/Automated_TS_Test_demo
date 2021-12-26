import {ICfgNode} from "./ICfgNode";
import {ForwardCfgNode} from "./ForwardCfgNode";
import {Expression} from "ts-morph";

export class CfgNode implements ICfgNode{
    private _content: string;
    private _id: number;
    private _parentNode: ICfgNode;
    private _trueNode: ICfgNode;
    private _falseNode: ICfgNode;
    private _visited: boolean = false;
    private static countnode: number = 0;


    constructor(content?: string) {
        CfgNode.countnode++;
        this._id = CfgNode.countnode;
        this._content = content || "";
    }

    getContent = (): string => {
        return this._content;
    };
    getId = (): number => {
        return this._id;
    };
    setContent = (content: string) => {
        this._content = content;
    };
    setId = (id: number) => {
        this._id = id;
    };

    setBranch(cfgNode: ICfgNode): void {
        this._trueNode = cfgNode;
        this._falseNode = cfgNode;
    }


    getParent(): ICfgNode {
        return this._parentNode;
    }

    setParent(value: ICfgNode) {
        this._parentNode = value;
    }

    getTrueNode(): ICfgNode {
        return this._trueNode;
    }

    setTrueNode(value: ICfgNode) {
        this._trueNode = value;
    }

    getFalseNode(): ICfgNode {
        return this._falseNode;
    }

    setFalseNode(value: ICfgNode) {
        this._falseNode = value;
    }


    isVisited(): boolean {
        return this._visited;
    }

    setVisited(value: boolean) {
        this._visited = value;
    }

    public toString = () => {
        return this._content;
        // return "aaaa";
    }
}
