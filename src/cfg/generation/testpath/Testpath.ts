import {ITestpath} from "./ITestpath";
import {FunctionDeclaration} from "ts-morph";
import {FlagCondition} from "./FlagCondition";
import {ICfgNode} from "../../nodes/ICfgNode";
import {ICFG} from "../../ICFG";

export class Testpath implements ITestpath {
    private _elements: Array<ICfgNode>;
    private _cfg: ICFG;
    private _functionNode: FunctionDeclaration;
    private _flags: Array<FlagCondition>;


    push(node: ICfgNode) : void {
        if (this._elements == null) {
            this._elements = new Array<ICfgNode>();
            this._elements.push(node);
        } else {
            this._elements.push(node);
        }
    }

    pop(): void {
        this._elements.pop();
    }

    getElements(): Array<ICfgNode> {
        return this._elements;
    }

    setElements(value: Array<ICfgNode>) {
        this._elements = value;
    }

    getCfg(): ICFG {
        return this._cfg;
    }

    setCfg(value: ICFG) {
        this._cfg = value;
    }

    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }

    getFlags(): Array<FlagCondition> {
        return this._flags;
    }

    setFlags(value: Array<FlagCondition>) {
        this._flags = value;
    }
}
