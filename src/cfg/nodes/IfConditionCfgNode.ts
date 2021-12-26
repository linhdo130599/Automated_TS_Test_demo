import {ConditionCfgNode} from "./ConditionCfgNode";
import {Expression} from "ts-morph";

export class IfConditionCfgNode extends ConditionCfgNode {
    constructor(condition: Expression) {
        super(condition);
    }
}