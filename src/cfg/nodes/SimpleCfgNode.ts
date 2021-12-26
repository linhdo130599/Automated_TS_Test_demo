import {NormalCfgNode} from "./NormalCfgNode";
import {Statement} from "ts-morph";
//node cho statement gán và statement khai báo biến mới
export class SimpleCfgNode extends NormalCfgNode {
    private _statement: Statement;

    constructor(statement: Statement) {
        super();
        this._statement = statement;
    }

    getStatement(): Statement {
        return this._statement;
    }

    setStatement(value: Statement) {
        this._statement = value;
    }
}