//
import {
    BinaryExpression,
    CaseClause, createWrappedNode,
    Expression,
    FunctionDeclaration, IfStatement,
    SourceFile,
    SwitchStatement,
    SyntaxKind,
    ts, TypeGuards
} from "ts-morph";
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

const origin_function: FunctionDeclaration = sourceFile.getFunctionOrThrow(process.env.FUNCTION_TEST);
const cfgGenerration: CFGGeneration = new CFGGeneration(origin_function);
const cfg = cfgGenerration.generateCFG();
let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
testpathGen.generateTestpaths();

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

// let statements = origin_function.getStatements();
// let switchStatement = statements.filter(s => s instanceof SwitchStatement)[0];
// if (switchStatement instanceof SwitchStatement) {
//     // console.log(switchStatement.getText());
//     console.log("Expression: " + switchStatement.getExpression().getText());
//     let left: Expression = switchStatement.getExpression();
//     let clause0 = switchStatement.getClauses()[0];
//     if (clause0 instanceof CaseClause) {
//         let right = clause0.getExpression();
//         console.log("First value: " + right.getText());
//         let newExpresison: ts.BinaryExpression = ts.createBinary(left.compilerNode, SyntaxKind.EqualsEqualsEqualsToken, right.compilerNode);
//         let ifStatement = switchStatement.replaceWithText("if ( s.length > 1) { }");
//         if (ifStatement instanceof IfStatement) {
//             console.log(ifStatement.getExpression().getText());
//             let ifExpresison = ifStatement.getExpression();
//             if (ifExpresison instanceof BinaryExpression) {
//                 let ifLeft = ifExpresison.getLeft();
//                 console.log("Type: " + ifLeft.getType().getText());
//             }
//         }
//         // sourceFile.saveSync();
//         // let node = createWrappedNode(newExpresison) as BinaryExpression;
//         // console.log(node.getText());
//
//         // if (TypeGuards.isBinaryExpression(newExpresison)) {
//         //     console.log(newExpresison.getText());
//         // }
//
//     }
//
//
//
//
// }


