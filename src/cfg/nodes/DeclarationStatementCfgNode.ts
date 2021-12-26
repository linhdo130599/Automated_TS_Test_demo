import {SimpleCfgNode} from "./SimpleCfgNode";
import {Statement} from "ts-morph";

export class DeclarationStatementCfgNode extends SimpleCfgNode{
    constructor(statement: Statement) {
        super(statement);
    }
}