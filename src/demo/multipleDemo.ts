import {factory} from "../ConfigLog4j";

import {initTestParser} from "./TestConfig";
import {FunctionDeclaration, ParameterDeclaration, SourceFile} from "ts-morph";
import * as fs from "fs";

import * as rd from 'readline';
import { Input } from "./Input";
import {MultipleInput} from "./MultipleInput";
import {SingleFunctionTestdata} from "../testscriptgen/SingleFunctionTestdata";
import {FunctionNormalizer} from "../normalizer/FunctionNormalizer";
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {ITestpath} from "../cfg/generation/testpath/ITestpath";
import {IFunctionNormalizer} from "../normalizer/IFunctionNormalizer";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";
import {SingleSourceTestdata} from "../testscriptgen/SingleSourceTestdata";
import {ScriptRunner} from "../testscriptgen/ScriptRunner";
import {ConstraintSolver} from "../symbolicExecution/solver/ConstraintSolver";
import {AbstractProperty} from "../testscriptgen/AbstractProperty";

const logger = factory.getLogger("MultipleDemo");

export function getInput(): Array<Input> {
    const inputFilePath = "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\demo\\functions.txt";
    let inputs: Array<Input> = new Array<Input>();
    var lines = fs.readFileSync(inputFilePath, 'utf-8')
        .split('\r\n').forEach(l => {
            if (l.length == 0) return;
            let tokens = l.split(' ');
            let path = tokens[0];
            let functionList = new Array<string>();

            for ( let i = 1; i < tokens.length; i++) {
                functionList.push(tokens[i]);
            }
            let input: Input = new Input(path, functionList);
            inputs.push(input);
        });

    return inputs;
}
export function execute() : string {
    let inputs: Array<Input> = getInput();
    let res = "";
    inputs.forEach(file => {
        console.log(file);
        let sourceFile: SourceFile = initTestParser().getSourceFileOrThrow(file.getSourcePath());
        let multipleFuntionTestdata = new Array<SingleFunctionTestdata>();
        file.getFunctionList().forEach(functionName => {
            let origin_function = sourceFile.getFunction(functionName);
            if (origin_function == null) {
                logger.error(`Dont have function ${functionName} in file: ${file.getSourcePath()}`);
            }

            const cfgGenerration: CFGGeneration = new CFGGeneration(origin_function);
            const cfg = cfgGenerration.generateCFG();
            let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
            testpathGen.generateTestpaths();
            let inputList: Array<Array<AbstractProperty>> = new Array<Array<AbstractProperty>>();
            testpathGen.getPossibleTestpaths().forEach(tp => {
                let solverResult = ConstraintSolver.solveNewVersion(tp);
                let testcase = solverResult.getTestcaseText();
                let usedVariables = solverResult.getVariables();
                let inputData = TestscriptGeneration.parseInputDataToArray(testcase, tp.getFunctionNode(), usedVariables);
                inputList.push(inputData);
            });
            console.log(inputList.toString());
            let singleFunctionTestdata = new SingleFunctionTestdata(origin_function, inputList);
            multipleFuntionTestdata.push(singleFunctionTestdata);
        });
        let sourceTestdata = new SingleSourceTestdata(file.getSourcePath(), multipleFuntionTestdata);
        res = TestscriptGeneration.generateTestscriptForSingleSource(sourceTestdata);
    });

    return res;
}

// getInput();
// execute();
//
// let testRunner = new ScriptRunner();
// testRunner.execute();

