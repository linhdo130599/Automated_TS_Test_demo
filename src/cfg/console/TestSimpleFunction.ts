import {
    EmptyStatement,
    FunctionDeclaration,
    Identifier,
    LiteralExpression,
    ParameterDeclaration,
    Project
} from "ts-morph";
import {CFGGeneration} from "../generation/CFGGeneration";
import {CFG} from "../CFG";
import {IfConditionCfgNode} from "../nodes/IfConditionCfgNode";

const project = new Project({
    tsConfigFilePath: "C:\\Users\\Admin\\IdeaProjects\\typescript-AST\\tsconfig.json"
})

project.addExistingSourceFile("C:\\Users\\Admin\\IdeaProjects\\typescript-AST\\src\\cfg\\console\\Functions.ts");
const functions = project.getSourceFileOrThrow("Functions.ts");
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
const cfgGenerration2: CFGGeneration = new CFGGeneration(maxFunction);
const maxCFG = cfgGenerration2.generateCFG() as CFG;
console.log("Infor: ", maxCFG.printInfor());
const  statement30 = maxCFG.statements[30] as IfConditionCfgNode;
const astNode30 = statement30.getAstCondition();
const checkType = astNode30 instanceof LiteralExpression;
const checkType2 = astNode30 instanceof Identifier;
console.log(checkType);
console.log(checkType2);

