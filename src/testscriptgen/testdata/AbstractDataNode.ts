import {AbstractZ3Variable} from "../../symbolicExecution/z3convert/AbstractZ3Variable";
import {Property} from "../../testscriptgen/"
import {AbstractProperty} from "../AbstractProperty";
import {LiteralDataNode} from "./LiteralDataNode";
import {StructureDataNode} from "./StructureDataNode";
import {ArrayDataNode} from "./ArrayDataNode";
import {BasicParameterProperty} from "../BasicParameterProperty";
import {ObjectParameterProperty} from "../ObjectParameterProperty";
import {CallExpression, Expression, Identifier, PropertyAccessExpression} from "ts-morph";

export class AbstractDataNode {
    private _name: string;
    private _type: string;
    private _correspondingZ3Var: AbstractZ3Variable;
    private _virtualName: string;
    private _children: Array<AbstractDataNode>;

    constructor(name: string, type: string) {
        this._name = name;
        this._type = type;
    }

    setValueForMultipleNodes(testcases: Array<AbstractProperty>) {
        testcases.forEach(property => {
            this.setValueForNode(property);
        })
    }

    setValueForNode(property: AbstractProperty) {
        if (property instanceof BasicParameterProperty) {
            let name = property.getName();
            let value = property.getValue();
            let type  = property.getType();
            let dataNode = this.findChildByName(name);
            if (dataNode) {
                if (dataNode instanceof LiteralDataNode) {
                    dataNode.setValue(value);
                    dataNode.setType(type);
                }
            } else {
                let newLiteralNode = new LiteralDataNode(name, type, value);
                this.addChild(newLiteralNode);
            }
        } else if (property instanceof ObjectParameterProperty) {
            let expression = property.getExpression();
            if (expression instanceof PropertyAccessExpression) {
                let type = expression.getType().getText();
                let name = expression.getName();
                if (type=== "number") {

                }
            }
        }
        let name = property.getName();
        let value = property.getValue();
        // let type = value.getType();
        let tokens = name.split(".");
        let tmpRoot: AbstractDataNode = this;
        tokens.forEach(propertyName=> {
            let dataNode = tmpRoot.findChildByName(propertyName);
            if (dataNode instanceof LiteralDataNode) {
                dataNode.setValue(value);
            } else if (dataNode instanceof StructureDataNode) {
                tmpRoot=dataNode;
            } else if (dataNode instanceof ArrayDataNode) {
                //TODO handling array data node
            }
        })
    }

    findChildByName(name: string): AbstractDataNode {
        this._children.forEach(child => {
            if (child.getName() === name) return child;
        });
        return null;
    }

    addChild(newChild: AbstractDataNode): AbstractDataNode {
        if (this._children == null) {
            this._children = new Array<AbstractDataNode>();
            this._children.push(newChild);
        } else {
            this._children.push(newChild);
        }

        return this;
    }

    createDataNodeFromExpressionSetValue(expression: Expression, value: string): AbstractDataNode {
            if (expression instanceof PropertyAccessExpression) {
                let type = expression.getType().getText();
                let name = expression.getName();
                let subExpression = expression.getExpression();
                if (type === "string" || type === "number" || type === "boolean") {
                    let dataNode = new LiteralDataNode(name, type, value);
                    return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                } else if (type.match("(\\w+)\\[\\]")) {
                    let macher = type.match("(\\w+)\\[\\]");
                    let dataNode = new ArrayDataNode(name, macher[1]);
                    return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                } else {
                    let dataNode = new StructureDataNode(name, type);
                    return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                }

            } else if (expression instanceof CallExpression) {
                let type = expression.getType().getText();
                let propertyExpression = expression.getExpression();
                if (propertyExpression instanceof PropertyAccessExpression) {
                    let methodName = propertyExpression.getName();
                    let subExpression = propertyExpression.getExpression();
                    if (methodName.startsWith("get")) {
                        methodName = methodName.replace("get","").toLowerCase();
                    }
                    if (type === "string" || type === "number" || type === "boolean") {
                        let dataNode = new LiteralDataNode(name, type, value);
                        return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                    } else if (type.match("(\\w+)\\[\\]")) {
                        let macher = type.match("(\\w+)\\[\\]");
                        let dataNode = new ArrayDataNode(name, macher[1]);
                        return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                    } else {
                        //khong bao gio chay vao ham nay
                        let dataNode = new StructureDataNode(methodName, type);
                        return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                    }

                }
            }
    }

    createDataNodeFromExpressionNoValue(expression: Expression): AbstractDataNode {
        while (expression instanceof PropertyAccessExpression || expression instanceof CallExpression) {
            if (expression instanceof PropertyAccessExpression) {
                let type = expression.getType().getText();
                let name = expression.getName();
                let dataNode = new StructureDataNode(name, type);
                let subExpression = expression.getExpression();
                return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
            } else if (expression instanceof CallExpression) {
                let type = expression.getType().getText();
                let propertyExpression = expression.getExpression();
                if (propertyExpression instanceof PropertyAccessExpression) {
                    let methodName = propertyExpression.getName();
                    let subExpression = propertyExpression.getExpression();
                    if (methodName.startsWith("get")) {
                        methodName = methodName.replace("get","").toLowerCase();
                    }
                    let dataNode = new StructureDataNode(methodName, type);
                    return this.createDataNodeFromExpressionNoValue(subExpression).addChild(dataNode);
                }
            }

        }
        if (expression instanceof Identifier) {
            let type = expression.getType().getText();
            return new StructureDataNode(expression.getText(), type);
        }
    }

    getName(): string {
        return this._name;
    }

    setName(value: string) {
        this._name = value;
    }

    getType(): string {
        return this._type;
    }

    setType(value: string) {
        this._type = value;
    }

    getCorrespondingZ3Var(): AbstractZ3Variable {
        return this._correspondingZ3Var;
    }

    setCorrespondingZ3Var(value: AbstractZ3Variable) {
        this._correspondingZ3Var = value;
    }

    getVirtualName(): string {
        return this._virtualName;
    }

    setVirtualName(value: string) {
        this._virtualName = value;
    }

    getChildren(): Array<AbstractDataNode> {
        return this._children;
    }

    setChildren(value: Array<AbstractDataNode>) {
        this._children = value;
    }
}
