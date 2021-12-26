import {SimpleCfgNode} from "./SimpleCfgNode";
import {Expression, Statement} from "ts-morph";
import {NormalCfgNode} from "./NormalCfgNode";

export class ExpressionStatementCfgNode extends SimpleCfgNode {
    constructor(_statement: Statement) {
        super(_statement);
    }
}