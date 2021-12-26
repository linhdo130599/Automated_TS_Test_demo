//
import {SourceFile} from "ts-morph";
import {factory} from "../ConfigLog4j";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";
import {initTestParser} from "./TestConfig"
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {ConstraintSolver} from "../symbolicExecution/solver/ConstraintSolver";
import {DataForGenerateTestscript} from "../testscriptgen/DataForGenerateTestscript";
import {ExportData} from "../testscriptgen/ExportData";
import {ReImportFromGeneralModule} from "../testscriptgen/reimport/ReImportFromGeneralModule";
import * as path from "path";

const logger = factory.getLogger("Demo");

const sourceFile: SourceFile = initTestParser().getSourceFileOrThrow(process.env.SOURCE_FILE_TEST);
console.log(sourceFile.getDirectoryPath());

const origin_function = sourceFile.getFunctionOrThrow(process.env.FUNCTION_TEST);

const cfgGenerration: CFGGeneration = new CFGGeneration(origin_function);
const cfg = cfgGenerration.generateCFG();
let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
testpathGen.generateTestpaths();


// let  testcases: Array<string> = new Array<string>();
// let inputList: Array<Array<AbstractProperty>> = new Array<Array<AbstractProperty>>();
// testpathGen.getPossibleTestpaths().forEach(tp => {
//     let solverResult = ConstraintSolver.solveNewVersion(tp);
//     let testcase = solverResult.getTestcaseText();
//     let usedVariables = solverResult.getVariables();
//     let inputData = TestscriptGeneration.parseInputDataToArray(testcase, tp.getFunctionNode(), usedVariables);
//     inputList.push(inputData);
// });
// console.log(testcases.toString());
//
// TestscriptGeneration.generateTestscriptForSingleDemo(origin_function, inputList);
let  testcases: Array<string> = new Array<string>();
let inputList: Array<DataForGenerateTestscript> = new Array<DataForGenerateTestscript>();
let exportData: ExportData = new ExportData();
testpathGen.getPossibleTestpaths().forEach(tp => {
    let solverResult = ConstraintSolver.solveNewVersion(tp);
    let testcase = solverResult.getTestcaseText();
    testcases.push(testcase);
    let usedVariables = solverResult.getVariables();
    let inputData = TestscriptGeneration.parseInputDataToObject(testcase, tp.getFunctionNode(), usedVariables, exportData);
    inputList.push(inputData);
});
console.log(testcases.toString());

TestscriptGeneration.generateTestscriptForSingleDemo_paramterAsObject(origin_function, inputList, exportData);
let exportHelperPath = path.dirname(process.env.INPUT_PROJECT_SOURCE_PATH) + "\\tests\\exports.ts";
ReImportFromGeneralModule.updateSourceFile(origin_function, exportData, exportHelperPath);


// let scriptGen: TestscriptGeneration = new TestscriptGeneration();
// let paramterNormalizer: IFunctionNormalizer = normalizer.getNormalizers()[0];
// let standardizedInputs = TestscriptGeneration.standardizeInputs(testcases, origin_function, paramterNormalizer.getChangedTokens());
// console.log(standardizedInputs.toString());
// let script = TestscriptGeneration.generateTestscript(origin_function, standardizedInputs);
//

export function foo(a: number): number {
    let x: number = 1;
    let y: number = 2;
    if (a > x + y) return 1;
    else return 2;
}



// let testRunner = new ScriptRunner();
// testRunner.execute();


