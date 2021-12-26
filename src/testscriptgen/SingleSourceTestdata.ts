import {SingleFunctionTestdata} from "./SingleFunctionTestdata";

export class SingleSourceTestdata {
    private _path: string;
    private _multipleFunctionTestdata: Array<SingleFunctionTestdata>;

    constructor(path: string, multipleFunctionTestdata: Array<SingleFunctionTestdata>) {
        this._path = path;
        this._multipleFunctionTestdata = multipleFunctionTestdata;
    }

    getPath(): string {
        return this._path;
    }

    setPath(value: string) {
        this._path = value;
    }

    getMultipleFunctionTestdata(): Array<SingleFunctionTestdata> {
        return this._multipleFunctionTestdata;
    }

    setMultipleFunctionTestdata(value: Array<SingleFunctionTestdata>) {
        this._multipleFunctionTestdata = value;
    }
}
