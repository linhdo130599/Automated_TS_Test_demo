import {FlagCfgNode} from "./FlagCfgNode";

export class BeginFlagCfgNode extends FlagCfgNode{
    constructor() {
        super();
        this.setContent("Begin");
    }
}