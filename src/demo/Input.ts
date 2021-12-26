export class Input {
    private _sourcePath: string;
    private _functionList: Array<string>;

    constructor(sourcePath: string, functionList: Array<string>) {
        this._sourcePath = sourcePath;
        this._functionList = functionList;
    }

    addFunctionByName(functionName: string): void {
        this._functionList.push(functionName);
    }


    getSourcePath(): string {
        return this._sourcePath;
    }

    setSourcePath(value: string) {
        this._sourcePath = value;
    }

    getFunctionList(): Array<string> {
        return this._functionList;
    }

    setFunctionList(value: Array<string>) {
        this._functionList = value;
    }
}
