import {Project, SourceFile} from "ts-morph";
import {ICFG} from "../cfg/ICFG";
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {CFG} from "../cfg/CFG";
import * as dotenv from "dotenv";
import * as path from "path";
import * as dotenvExpand from "dotenv-expand";

export function getCfgByName(functionName: string): ICFG {
    let myEnv = dotenv.config({path: path.dirname(__dirname)+ "/config.env"});
    console.log( "Config enviroment file: " + path.dirname(__dirname)+ "/config.env");
    dotenvExpand(myEnv);

    // const project = new Project({
    //     tsConfigFilePath: process.env["tsConfigFilePath"]
    // });
    const project = new Project();
    project.addExistingSourceFile(__dirname + "/sources/Functions.ts");
    const sourceFile: SourceFile = project.getSourceFileOrThrow("Functions.ts");
    // sourceFile.getImportDeclarations()[0].getStructure().
    console.log(sourceFile.getDirectoryPath());
    const test_function = sourceFile.getFunctionOrThrow(functionName);
    const cfgGenerration: CFGGeneration = new CFGGeneration(test_function);
    const cfg = cfgGenerration.generateCFG() as CFG;
    return cfg;
}
