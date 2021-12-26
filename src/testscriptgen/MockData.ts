import {ExternalFunctionProperty} from "./ExternalFunctionProperty";
import {StaticMethodProperty} from "./StaticMethodProperty";
import {CallExpression, Identifier, PropertyAccessExpression} from "ts-morph";

export class MockData {
    private _externalFunctions: Array<ExternalFunctionProperty>;
    private _staticMethods: Array<StaticMethodProperty>;


    constructor(externalFunctions: Array<ExternalFunctionProperty>, staticMethod: Array<StaticMethodProperty>) {
        this._externalFunctions = externalFunctions;
        this._staticMethods = staticMethod;
    }

    getExternalFunctions(): Array<ExternalFunctionProperty> {
        return this._externalFunctions;
    }

    setExternalFunctions(value: Array<ExternalFunctionProperty>) {
        this._externalFunctions = value;
    }

    getStaticMethods(): Array<StaticMethodProperty> {
        return this._staticMethods;
    }

    setStaticMethods(value: Array<StaticMethodProperty>) {
        this._staticMethods = value;
    }

    groupStaticMethodByClassName(): Map<string, Array<StaticMethodProperty>> {
        let map: Map<string, Array<StaticMethodProperty>> = new Map();
        this.getStaticMethods().forEach(method => {
            let expression = method.getExpression();
            if (expression instanceof CallExpression) {
                let propertyAccessExpression = expression.getExpression();
                if (propertyAccessExpression instanceof PropertyAccessExpression) {
                    let className = propertyAccessExpression.getExpression();
                    if (className instanceof Identifier) {
                        let classNameText = className.getText();
                        //TODO xu ly truong hop co nhieu class ten giong nhau
                        if (map.has(classNameText)) {
                            let oldArray: Array<StaticMethodProperty> = map.get(classNameText);
                            oldArray.push(method);
                            map.set(classNameText, oldArray);
                        } else {
                            let array: Array<StaticMethodProperty> = [method];
                            map.set(classNameText, array);
                        }
                    }
                }
            }
        });

        return map;
    }
}
