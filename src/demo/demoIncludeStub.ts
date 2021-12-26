//
import {FunctionDeclaration, ParameterDeclaration, Project, SourceFile} from "ts-morph";
import {factory} from "../ConfigLog4j";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";
import {ScriptRunner} from "../testscriptgen/ScriptRunner";
import {ParameterNormalizer} from "../normalizer/ParameterNormalizer";
import {FunctionNormalizer} from "../normalizer/FunctionNormalizer";
import {IFunctionNormalizer} from "../normalizer/IFunctionNormalizer";
import {initTestParser} from "./TestConfig"
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {ITestpath} from "../cfg/generation/testpath/ITestpath";
import {ConstraintSolver} from "../symbolicExecution/solver/ConstraintSolver";
import {AbstractProperty} from "../testscriptgen/AbstractProperty";
import {DataForGenerateTestscript} from "../testscriptgen/DataForGenerateTestscript";
import {generateTestscriptForFunctionIncludingStub, parseZ3Result} from "../testscriptgen/StubGenerator";
import {StubElementList} from "../testscriptgen/stubData/StubElementList";


const logger = factory.getLogger("DemoStub");

const sourceFile: SourceFile = initTestParser().getSourceFileOrThrow("ObjectExample.ts");

const origin_function = sourceFile.getFunctionOrThrow("object_literal_expresion_test");

const cfgGenerration: CFGGeneration = new CFGGeneration(origin_function);
const cfg = cfgGenerration.generateCFG();
let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
testpathGen.generateTestpaths();

let  testcases: Array<string> = new Array<string>();
let inputList: Array<Array<AbstractProperty>> = new Array<Array<AbstractProperty>>();
let countTestcase = 0;
let stubData = new StubElementList();
testpathGen.getPossibleTestpaths().forEach(tp => {
    countTestcase++;
    let solverResult = ConstraintSolver.solveNewVersion(tp);
    let testcase = solverResult.getTestcaseText();
    let usedVariables = solverResult.getVariables();
    let inputData = parseZ3Result(countTestcase, testcase, tp.getFunctionNode(), usedVariables, stubData);
    inputList.push(inputData);
});
console.log(testcases.toString());

generateTestscriptForFunctionIncludingStub(origin_function, inputList);

// let scriptGen: TestscriptGeneration = new TestscriptGeneration();
// let paramterNormalizer: IFunctionNormalizer = normalizer.getNormalizers()[0];
// let standardizedInputs = TestscriptGeneration.standardizeInputs(testcases, origin_function, paramterNormalizer.getChangedTokens());
// console.log(standardizedInputs.toString());
// let script = TestscriptGeneration.generateTestscript(origin_function, standardizedInputs);
//
// let testRunner = new ScriptRunner();
// testRunner.execute();


