import {AbstractDataNode} from "./AbstractDataNode";

export class ArrayDataNode extends AbstractDataNode{
    private _elements: Array<AbstractDataNode>;

    constructor(name: string, type: string, elements?: Array<AbstractDataNode>) {
        super(name, type);
        this._elements = elements;
    }

    getElements(): Array<AbstractDataNode> {
        return this._elements;
    }

    setElements(value: Array<AbstractDataNode>) {
        this._elements = value;
    }
}
