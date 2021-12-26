import {AbstractDataNode} from "./AbstractDataNode";

export class StructureDataNode extends AbstractDataNode{
    private _properties: Array<AbstractDataNode>;

    constructor(name: string, type: string, properties?: Array<AbstractDataNode>) {
        super(name, type);
        this._properties = properties;
    }

    getProperties(): Array<AbstractDataNode> {
        return this._properties;
    }

    setProperties(value: Array<AbstractDataNode>) {
        this._properties = value;
    }
}
