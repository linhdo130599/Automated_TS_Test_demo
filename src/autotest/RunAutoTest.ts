import {
    ClassDeclaration,
    forEachStructureChild, Expression,
    FunctionDeclaration, Identifier, LiteralExpression,
    MethodDeclaration,
    Project,
    SourceFile
} from "ts-morph";
import {json} from "body-parser";
import {text} from "express";
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {CFG} from "../cfg/CFG";
import {IfConditionCfgNode} from "../cfg/nodes/IfConditionCfgNode";
// import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {initTestParser} from "../demo/TestConfig";
import {expect} from "chai";
import {ExpressionStatementCfgNode} from "../cfg/nodes/ExpressionStatementCfgNode";
import {DeclarationStatementCfgNode} from "../cfg/nodes/DeclarationStatementCfgNode";
import {ConstraintSolver} from "../symbolicExecution/solver/ConstraintSolver";
import {DataForGenerateTestscript} from "../testscriptgen/DataForGenerateTestscript";
import {ExportData} from "../testscriptgen/ExportData";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";
import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {executeTestScript} from "./test";
import {exec} from "child_process";


// const logger = new MyLogger("Test");
// let environmentConfig: EnvironmentConfig = TestingFactory.initTestingEnvironmentConfig();
// let mainProjectConfig = environmentConfig.getMainProject();
// let parser = mainProjectConfig.getProjectParser();
//
// const project = new Project({
//     tsConfigFilePath: "C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\coverage\\coverage-final.json",
// });
// const sourceFile = parser.addExistingSourceFile("C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\src\\sum.ts");
//
// // const sourceFile: SourceFile = parser.getSourceFileOrThrow("sum.ts");
//
// const test_function: FunctionDeclaration = sourceFile.getFunctionOrThrow("sum");
// const statementGeneration: CfgGeneration = new CfgGeneration(environmentConfig, new AnalyzedElementFunction(test_function));
// // const cfg = cfgGeneration.generateMainCfg(false);
// const statement = statementGeneration.generateMainStatement(false);
// const statements = statement.getAllNodes();
// // console.log("statements: ", statements)
// statements.forEach(st => {
//     console.log("Statement: " + st.getContent());
// })
/**tét*/

/**content : string array
start: {line, column}
end : {line, column}**/

export class ConditionPath{
    private static _variable: any[];

    private constructor( ) {
    }

    public static getInstance(): any[] {
        if (this._variable == null){
            this._variable = [];
        }
        return ConditionPath._variable;
    }

    public static variable(value: any[]) {
        this._variable = value;
    }
}


function getString(content, start, end) {

    let result = ""
    let u = start["column"]
    let v = (start["line"] < end["line"]) ? content[start["line"]].length : (end["column"] == null) ? content[start["line"]].length : content[end["column"]].length
    result += content[start["line"]].substring(u,v)
    //console.log("result :", result)
    for(let row = start["line"] + 1; row <= end["line"] - 1; row++) {
        result += "\n"
        result += content[row]
        //console.log("result :", result)
    }
    u = 0
    v = (start["line"] < end["line"]) ? content[end["line"]].length : 0
    result += v > 0 ? "\n" + content[end["line"]].substring(u,v) : ""
    //console.log("result :", result)
    return result
}


var x = null;
const fs = require('fs')
const pathJson = 'C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\coverage\\coverage-final.json'
const pathFunctionFile = 'C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\src\\sum.ts'


// fs.readFile(pathFunctionFile, 'utf-8', (err, data) => {
//     if (err) {
//         console.log("Error reading file from disk:", err)
//         throw err
//     }
//     functionString = data;
//     //test somethings
//     let start = {"line": 3, "column": 4}
//     let end = {"line": 6, "column": null}
//     let content = [""]
//     let lineContent = ""
//     for(let i = 0; i < data.length; i++) {
//         if(data[i] == '\r') continue
//         if(data[i] == '\n') {
//             content.push(lineContent)
//             lineContent = ""
//         } else {
//             lineContent += data[i]
//         }
//     }
//     console.log("content: ", content)
//     console.log("test something:\n", getString(content, start, end))
//
//     console.log("function content local:\n", functionString);
// })
// let functionString = fs.readFileSync(pathFunctionFile, 'utf-8');
// console.log("function content global:\n", functionString); //da xuat ra duoc gia tri cu the cua bien


fs.readFile(pathJson, 'utf8', (err, jsonString) => {
    // if (err) {
    //     console.log("Error reading file from disk:", err)
    //     throw err
    // }
    // try {
        //parse json data
        const jsonData = JSON.parse(jsonString)
        let branchMap = jsonData[pathFunctionFile]["branchMap"]
        let branch = jsonData[pathFunctionFile]["b"]
        let branchCount = Object.keys(branch).length
        console.log("branch count: ", branchCount)
        console.log("branchMap: ", branchMap)
        console.log("branches: ", branch)
        let arrayConditon= []
        for (let i =0; i<branchCount; i++){
            let condition = branch[i]
            let conditionCount = Object.keys(condition).length
            console.log('condition',i,":", condition)
            // console.log('condition Count: ', conditionCount)
            for (let i=0; i<conditionCount/2; i++){
                if (condition[0]!=0 && condition[1]!=0){
                    arrayConditon.push(1)
                }  if ( condition[0] == 0 && condition[1] != 0){
                    arrayConditon.push(0)
                }  if ( condition[0]!= 0 && condition[1] == 0){
                    arrayConditon.push(1)
                }  if (condition[0]==0 && condition[1]==0) {
                    var colors = [0,1]
                    var randColor = colors[Math.floor(Math.random() * colors.length)]
                    arrayConditon.push(randColor)
                }
            }
        }

        ConditionPath.variable(arrayConditon);
        console.log("branch output condition way:", arrayConditon)
        //Compute branch coverage percent
        var branchCoverage = 0;
        let branchTestCaseTotal = 0;
        let branchTestCaseCount = 0;
        Object.keys(branch).forEach(key => {
            branchTestCaseTotal += branch[key].length
            branch[key].forEach(value => {
                branchTestCaseCount += value
            })
        })
        branchCoverage = Math.round(branchTestCaseCount / branchTestCaseTotal * 10000) / 100
        console.log("branch coverage: ", branchCoverage, "%")

    // } catch(err) {
    //     console.log('Error parsing JSON string:', err)
    //     throw(err)
    // }

    /**CFG*/

    console.log("CFG:")
    const project = new Project({
        tsConfigFilePath: "C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\coverage\\coverage-final.json"
    })
    project.addExistingSourceFile("C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test\\src\\sum.ts");
    const functions = project.getSourceFileOrThrow("sum.ts");
    const hasClass = functions.getClasses().length > 0;
    console.log("hasClass", hasClass);
    const isInterface = functions.getInterfaces().length > 0;
    console.log("isInterface", isInterface);
    const functionList = functions.getFunctions();
    console.log("function number", functionList.length);

// const squareFunction = functionList[2] as FunctionDeclaration;
// console.log("Test function name: ", squareFunction.getNameOrThrow());
// const cfgGeneration: CFGGeneration = new CFGGeneration(squareFunction);
// const cfg = cfgGeneration.generateCFG() as CFG;
// console.log("Infor: ", cfg.printInfor());
    const maxFunction = functionList[0] as FunctionDeclaration;
    console.log("Param type", maxFunction.getParameters()[0].getStructure().type);

    console.log("Parse max function....", maxFunction.getNameOrThrow());
    const cfgGenerration: CFGGeneration = new CFGGeneration(maxFunction);
    const maxCFG = cfgGenerration.generateCFG() as CFG;
    console.log("Infor: ", maxCFG.printInfor());
    // const  statement30 = maxCFG.statements[30] as IfConditionCfgNode;
    // const astNode30 = statement30.getAstCondition();
    // const checkType = astNode30 instanceof LiteralExpression;
    // const checkType2 = astNode30 instanceof Identifier;
    // console.log(checkType);
    // console.log(checkType2);
    /**Testpaths*/
    let testpathGen = new TestpathGeneration(maxCFG);
    testpathGen.generateTestpaths();


    let  testcases: Array<string> = new Array<string>();
    let inputList: Array<DataForGenerateTestscript> = new Array<DataForGenerateTestscript>();
    let exportData: ExportData = new ExportData();
    testpathGen.getCurrentTestpaths().forEach(tp => {
        let solverResult = ConstraintSolver.solveNewVersion(tp);
        let testcase = solverResult.getTestcaseText();
        testcases.push(testcase);
        let usedVariables = solverResult.getVariables();
        let inputData = TestscriptGeneration.parseInputDataToObject(testcase, tp.getFunctionNode(), usedVariables, exportData);
        inputList.push(inputData);
    });
    exec('npx jest --json --outputFile=output.json',{cwd: 'C:\\Users\\Tuan Linh\\IdeaProjects\\jest_test'},((error,stdout,stderr) =>{
        console.log(stderr)

    } ));
    console.log('Coverage Report: http://localhost:63342/jest_test/coverage/lcov-report/index.html?_ijt=hmqj0tlj82h6oh8nll7u6mbqmo')


    // console.log(testcases.toString());
    // console.log(executeTestScript());




    /**Constraints
    // let parameters0 = maxCFG.getFunctionNode().getParameters();
    // let testcase0 = ConstraintSolver.solve(randomTestpath0);
    let solverResult = ConstraintSolver.solveNewVersion(randomTestpath0);
    let testcase = solverResult.getTestcaseText();
    let usedVariables = solverResult.getVariables();
    console.log(testcase)*/



})

// let conditionWay = fs.readFileSync(pathJson, 'utf-8');
// console.log("ConditionWay:\n", conditionWay)
// const sourceFile: SourceFile = initTestParser().getSourceFileOrThrow(process.env.SOURCE_FILE_TEST);
// console.log(sourceFile.getDirectoryPath());
//
// const origin_function = sourceFile.getFunctionOrThrow(process.env.FUNCTION_TEST);
// const cfgGenerration: CFGGeneration = new CFGGeneration(origin_function);
// const cfg = cfgGenerration.generateCFG();
// let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
// testpathGen.generateTestpaths();



















/**CODE HERE*/

// cfgGeneration.expandCfg(cfg);


// let testPathGen: TestPathGeneration = new TestPathGeneration(cfg);
// testPathGen.generateTestPaths();
// let testPaths = testPathGen.getPossibleTestPaths();
// console.log("testPaths:", testPaths[0])
// let tp1 = testPaths[3];
// tp1.getElements().forEach(node => {
//     console.log("Node: " + node.getContent());
// })


// let symbolize = new SymbolizeTestPath(tp1);
// symbolize.symbolize();
// symbolize.getPossibleSets().forEach( e => {
//     e.showTestData();
// })


console.log("End Program");