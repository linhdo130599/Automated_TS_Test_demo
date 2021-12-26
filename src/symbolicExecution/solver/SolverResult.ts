import {ExternalFunctionSymVar} from "../variables/ExternalFunctionSymVar";
import {StaticMethodSymVar} from "../variables/StaticMethodSymVar";
import {AbstractZ3Variable} from "../z3convert/AbstractZ3Variable";

export class SolverResult {
    private _testcaseText: string;
    private _variables: Array<AbstractZ3Variable>;
    // private _externalFunctions: Array<ExternalFunctionSymVar>;
    // private _staticMethods: Array<StaticMethodSymVar>


    constructor(testcaseText: string, variables: Array<AbstractZ3Variable>) {
        this._testcaseText = testcaseText;
        this._variables = variables;
    }

    getTestcaseText(): string {
        return this._testcaseText;
    }

    setTestcaseText(value: string) {
        this._testcaseText = value;
    }

    getVariables(): Array<AbstractZ3Variable> {
        return this._variables;
    }

    setVariables(value: Array<AbstractZ3Variable>) {
        this._variables = value;
    }


    // getExternalFunctions(): Array<ExternalFunctionSymVar> {
    //     return this._externalFunctions;
    // }
    //
    // setExternalFunctions(value: Array<ExternalFunctionSymVar>) {
    //     this._externalFunctions = value;
    // }
    //
    // getStaticMethods(): Array<StaticMethodSymVar> {
    //     return this._staticMethods;
    // }
    //
    // setStaticMethods(value: Array<StaticMethodSymVar>) {
    //     this._staticMethods = value;
    // }
}
