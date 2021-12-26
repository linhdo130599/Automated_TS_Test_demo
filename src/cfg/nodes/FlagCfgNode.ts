import {CfgNode} from "./CfgNode";
import {ICfgNode} from "./ICfgNode";

export class FlagCfgNode extends CfgNode {
    public static readonly BEGIN_FLAG:string = "Begin";
    public static readonly END_FLAG:string = "End";


    // constructor(flag: string) {
    //     super();
    //     this.setContent(flag);
    // }

    static createBeginFlagCfgNode = (): FlagCfgNode => {
        return new FlagCfgNode(FlagCfgNode.BEGIN_FLAG);
    }

    static createEndFlagCfgNode = (): FlagCfgNode => {
        return new FlagCfgNode(FlagCfgNode.END_FLAG);
    }

    isNormalNode = (): boolean => {
        return false;
    }

    static isBeginNode = (cfgNode: ICfgNode): boolean => {
        if (cfgNode instanceof FlagCfgNode && cfgNode.getContent() == "Begin") return true;
        else return false;
    }

    static isEndNode = (cfgNode: ICfgNode): boolean => {
        if (cfgNode instanceof FlagCfgNode && cfgNode.getContent() == "End") return true;
        else return false;
    }
}