import {NormalCfgNode} from "./NormalCfgNode";
import {Expression, Statement} from "ts-morph";

export class ConditionCfgNode extends NormalCfgNode {

    private _astCondition : Expression;

    constructor(condition: Expression) {
        super();
        this._astCondition = condition;
    }


    getAstCondition(): Expression {
        return this._astCondition;
    }

    setAstCondition(value: Expression) {
        this._astCondition = value;
    }
}