import {ConditionCfgNode} from "../../nodes/ConditionCfgNode";

export enum Direction {
    FALSE,
    TRUE
}
export class FlagCondition {
    private _cfgNode: ConditionCfgNode;
    private _flag: Direction;
    // public static readonly TRUE: number = 1;
    // public static readonly FALSE: number = 0;


    constructor(cfgNode: ConditionCfgNode, flag: number) {
        this._cfgNode = cfgNode;
        this._flag = flag;
    }

    getCfgNode(): ConditionCfgNode {
        return this._cfgNode;
    }

    setCfgNode(value: ConditionCfgNode) {
        this._cfgNode = value;
    }


    getFlag(): number {
        return this._flag;
    }

    setFlag(value: number) {
        this._flag = value;
    }

    toString():string {
        return this._flag.toString();
    }
}
