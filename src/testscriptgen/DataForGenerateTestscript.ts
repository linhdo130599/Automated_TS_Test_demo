import {AbstractProperty} from "./AbstractProperty";
import {ExternalFunctionSymVar} from "../symbolicExecution/variables/ExternalFunctionSymVar";
import {StaticMethodSymVar} from "../symbolicExecution/variables/StaticMethodSymVar";
import {Type} from "ts-morph";
import {MockData} from "./MockData";

export class DataForGenerateTestscript {
    private _paramterObject: Object;
    private _mockData: MockData;


    constructor(paramterObject: Object, mockData: MockData) {
        this._paramterObject = paramterObject;
        this._mockData = mockData;
    }

    getParamterObject(): Object {
        return this._paramterObject;
    }

    setParamterObject(value: Object) {
        this._paramterObject = value;
    }


    getMockData(): MockData {
        return this._mockData;
    }

    setMockData(value: MockData) {
        this._mockData = value;
    }
}
