import {ITestpath} from "./ITestpath";

export interface ITestpathGeneration {
    generateTestpaths(): void;
    getPossibleTestpaths(): Array<ITestpath>
}
