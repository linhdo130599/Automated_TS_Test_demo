import {ChangedToken} from "./ChangedToken";
import {Node} from "ts-morph";
import * as ts from "typescript";

export class PropertyAccessChangedToken extends ChangedToken{
    private _type: string;
    private _astOwner: Node;


    constructor( astOwner: Node, oldText?: string, newText?: string, type?: string) {
        super(oldText, newText);
        this._astOwner = astOwner;
        this._type = type;
    }

    getType(): string {
        return this._type;
    }

    setType(value: string) {
        this._type = value;
    }

    getAstOwner(): Node {
        return this._astOwner;
    }

    setAstOwner(value: Node) {
        this._astOwner = value;
    }
}
