import {Project, SourceFile} from "ts-morph";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import * as path from "path";

export function initTestParser(): Project {
    let myEnv = dotenv.config({path: path.dirname(__dirname)+ "/config.env"});
    console.log( "Config enviroment file: " + path.dirname(__dirname)+ "/config.env");
    dotenvExpand(myEnv);

    console.log("TsConfigFile of test project" + process.env.tsConfigFilePath);
    let project = new Project({
        tsConfigFilePath: process.env.tsConfigFilePath
    });
    return project;
}

// const sourceFile: SourceFile = project.getSourceFileOrThrow("Max.ts");
// console.log(sourceFile.getImportDeclarations()[1].getStructure().namespaceImport);
// console.log(sourceFile.getImportDeclarations()[1].getStructure().defaultImport);
// console.log(sourceFile.getImportDeclarations()[1].getStructure().namedImports);
// console.log(sourceFile.getImportDeclarations()[1].getStructure().moduleSpecifier);





// project.addExistingDirectory(INPUT_PROJECT_SOURCE_PATH);
