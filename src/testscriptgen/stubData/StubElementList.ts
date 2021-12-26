import {AbstractStubData} from "./StubData";
import {ExternalFunctionStubData} from "./ExternalFunctionStubData";
import {StaticMethodStubData} from "./StaticMethodStubData";
import {FunctionDeclaration} from "ts-morph";

export class StubElementList {
    private _externalFunctions: Array<ExternalFunctionStubData> = [];
    private _staticMethods: Array<StaticMethodStubData> = [];


    updateExternalFunction(functionNode: FunctionDeclaration, testcaseOrder: number, value: string) {
        this._externalFunctions.forEach(f => {
            if (f.getFunctionNode().getSymbol().getFullyQualifiedName() === functionNode.getSymbol().getFullyQualifiedName()) {
                f.getStubValues().set(testcaseOrder, value);
                return ;
            }
        });

        let functionStubData = new ExternalFunctionStubData(functionNode, testcaseOrder, value);
        this._externalFunctions.push(functionStubData);
    }

    updateStaticMethod(method: StaticMethodStubData, testcaseOrder: number, value: string) {
        this._staticMethods.forEach(f => {
            if (f.getMethodNode().getSymbol().getFullyQualifiedName() === method.getMethodNode().getSymbol().getFullyQualifiedName()) {
                f.getStubsValue().set(testcaseOrder, value);
                return ;
            }
        })
        method.getStubsValue().set(testcaseOrder, value);
        this._staticMethods.push(method);
    }


    getExternalFunctions(): Array<ExternalFunctionStubData> {
        return this._externalFunctions;
    }

    setExternalFunctions(value: Array<ExternalFunctionStubData>) {
        this._externalFunctions = value;
    }

    getStaticMethods(): Array<StaticMethodStubData> {
        return this._staticMethods;
    }

    setStaticMethods(value: Array<StaticMethodStubData>) {
        this._staticMethods = value;
    }
}
