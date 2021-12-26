import {FunctionDeclaration, FunctionDeclarationStructure, ImportDeclaration, SourceFile} from "ts-morph";
import {initTestParser} from "../demo/TestConfig";
import * as path from "path";

export function cloneFunctionNode(functionNode: FunctionDeclaration): FunctionDeclaration {
    let originSourceFile: SourceFile = functionNode.getSourceFile();
    let importList: ImportDeclaration[] = originSourceFile.getImportDeclarations();
    let tmpSourceFile: SourceFile = initTestParser().createSourceFile(path.join(process.env.INPUT_PROJECT_SOURCE_PATH,"Temp.ts") , originSourceFile.getStructure(), {overwrite: true});
    return tmpSourceFile.getFunction(functionNode.getName());
}
