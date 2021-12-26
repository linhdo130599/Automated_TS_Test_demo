import {ICFG} from "./ICFG";
import {ICfgNode} from "./nodes/ICfgNode";
import {FunctionDeclaration} from "ts-morph";

export class CFG implements ICFG {
    private _functionNode: FunctionDeclaration;
    private _root: ICfgNode;
    private _statements: Array<ICfgNode>;
    constructor(statements: Array<ICfgNode>, functionNode? : FunctionDeclaration) {
        this._statements = statements;
        this._functionNode = functionNode;
    }

    resetVisitedState(): void {
        this.getAllNodes().forEach((value) => {value.setVisited(false)});
    }

    computeNumberOfNode = (): number => {
        return 0;
    };
    findById = (): ICfgNode => {
        return null;
    };
    getBeginNode = (): ICfgNode => {
        return this._root;
    };
    printInfor(): string {
        return `Function name: ${this._functionNode.getName()} . Statements size: ${this._statements.length}`;
    }

    getAllNodes = () => {
        return this._statements;
    };

    get statements(): Array<ICfgNode> {
        return this._statements;
    }

    set statements(value: Array<ICfgNode>) {
        this._statements = value;
    }
    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    }

    setFunctionNode(value: FunctionDeclaration) {
        this._functionNode = value;
    }

    public getRoot(): ICfgNode {
        return this._root;
    }

    public setRoot(root: ICfgNode): void {
        this._root = root;
    }

}
