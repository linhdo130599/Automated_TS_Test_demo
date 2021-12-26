import * as fs from "fs";
import * as unzip from "unzip-stream";
import * as fsExtra from "fs-extra";
import * as child from "child_process";
import {FunctionDeclaration, Project, SourceFile, Type} from "ts-morph";
import * as path from "path";
import last from "lodash/last";
import {CFGGeneration} from "../cfg/generation/CFGGeneration";
import {TestpathGeneration} from "../cfg/generation/testpath/TestpathGeneration";
import {AbstractProperty} from "../testscriptgen/AbstractProperty";
import {ConstraintSolver} from "../symbolicExecution/solver/ConstraintSolver";
import {TestscriptGeneration} from "../testscriptgen/TestscriptGeneration";
import {Logger} from "typescript-logging";
import {factory} from "../ConfigLog4j";
import {ScriptRunner} from "../testscriptgen/ScriptRunner";
import {DataForGenerateTestscript} from "../testscriptgen/DataForGenerateTestscript";
import {ExportData} from "../testscriptgen/ExportData";
import {ReImportFromGeneralModule} from "../testscriptgen/reimport/ReImportFromGeneralModule";

const logger: Logger = factory.getLogger("ApiLog");

export function getFiles (dir, files, object, project: Project){
    var children = fs.readdirSync(dir);
    for (var i in children){
        var name = dir + '/' + children[i];
        // let name = this.cutHeadPath(name,"");
        object["children"].push(name);
        if (fs.statSync(name).isDirectory()){
            let newChild = {};
            newChild["path"] = name;
            newChild["type"] = "folder";
            newChild["isSelected"] = false;
            newChild["children"] =[];
            files[name] = newChild;
            if (name.endsWith("node_modules") === false) {
                getFiles(name, files, newChild, project);
            }
        } else {
            let newChild = {};
            newChild["path"] = name;
            newChild["type"] = "file";
            newChild["children"] =[];
            if (children[i].endsWith(".test.ts")) {
                newChild["isTestFile"] = true;
            } else if (children[i].endsWith(".ts")) {
                let sourceFile = project.getSourceFile(newChild["path"]);
                if (sourceFile) {
                    let functions = sourceFile.getFunctions();
                    let functionNodes = [];
                    if (functions.length > 0) {
                        functions.forEach(fn => {
                            let functionNode = {};
                            functionNode["path"] = name + "/" + fn.getName();
                            functionNode["type"] = "function";
                            functionNode["name"] = fn.getName();
                            functionNode["isSelected"] = false;
                            functionNodes.push(functionNode);
                            files[functionNode["path"]] = functionNode;
                        });
                        newChild["children"] = functionNodes.map(f => f["path"]);
                        newChild["isSelected"] = false;
                    }
                }
                newChild["isTestFile"] = false;
            }
            files[name] = newChild;
        }
    }
    return files;
}

export function cutHeadPath(path: string, cutString: string): string {
    return path.replace(cutString,"");
}

export function initRootNode(dir) {
    let root = {};
    let shortPath = cutHeadPath(dir,"");
    root["path"]= shortPath;
    root["isRoot"] = true;
    root["type"] = "folder";
    root["children"] =[];
    return root;
}

export async function unzipUploadFile(filePath: string, folder: string) {
    await fs.createReadStream(filePath).pipe(unzip.Extract({ path: folder }));
}

export function copySync(from,to){
    fsExtra.copy(from, to, function (err) {
        if (err){
            console.log('An error occured while copying the folder.')
            return console.error(err)
        }
        console.log('Copy completed!')
    });
}

export function getTestFolderPath(functionNode: FunctionDeclaration, srcDir: string, testDir: string): string {
    let rootPath = srcDir;
    let rootPathFormat = path.normalize(rootPath);
    let sourceFilePath = functionNode.getSourceFile().getDirectoryPath();
    let sourceFilePathFormat = path.normalize(sourceFilePath);
    let relativePath = sourceFilePathFormat.replace(rootPathFormat, "");
    // let testFoler = path.join(TestscriptGeneration.TEST_DIR, relativePath);
    let testFoler = path.join(testDir, relativePath);
    return testFoler;
}

export function generateTestdataForFunctions(functionPaths: string[], tsConfigPath: string, srcPath: string) {
    const project = new Project({tsConfigFilePath: tsConfigPath});
    const testData = {};
    let srcPathNormalized = path.normalize(srcPath);
    let testDir = srcPathNormalized.replace(srcPathNormalized.split(path.sep).pop(),"tests");
    let exportData: ExportData = new ExportData();
    let start = new Date();
    functionPaths.forEach(func => {
        const normalizedPath = path.normalize(func);
        const functionName = normalizedPath.split(path.sep).pop();
        const sourceFilePath = normalizedPath.substring(0, normalizedPath.lastIndexOf(path.sep));
        const sourceFile = project.getSourceFile(sourceFilePath);
        const functionAST = sourceFile.getFunction(functionName);
        if (functionAST) {
            const cfgGenerration: CFGGeneration = new CFGGeneration(functionAST);
            const cfg = cfgGenerration.generateCFG();
            let testpathGen: TestpathGeneration = new TestpathGeneration(cfg);
            testpathGen.generateTestpaths();
            let  testcases: Array<string> = new Array<string>();
            let inputList: Array<DataForGenerateTestscript> = new Array<DataForGenerateTestscript>();
            // let usedTypes: Map<string, Type> = new Map<string, Type>();
            testpathGen.getPossibleTestpaths().forEach(tp => {
                let solverResult = ConstraintSolver.solveNewVersion(tp);
                let testcase = solverResult.getTestcaseText();
                let usedVariables = solverResult.getVariables();
                let inputData = TestscriptGeneration.parseInputDataToObject(testcase, tp.getFunctionNode(), usedVariables, exportData);
                inputList.push(inputData);
            });
            console.log(testcases.toString());

            let config = {};
            let srcPathNormalized = path.normalize(srcPath);
            config["srcDir"] = srcPathNormalized;
            config["testDir"] = testDir;

            config["testFileDirectory"] = this.getTestFolderPath(functionAST, config["srcDir"], config["testDir"]);
            if (!fs.existsSync(config["testFileDirectory"])){
                fs.mkdirSync(config["testFileDirectory"], {recursive: true});
            }

            //dung de luu testcase duoi dang json
            config["dataFileDirectory"] = config["testFileDirectory"].replace(path.sep + "tests",path.sep+"testdata_dtht");
            if (!fs.existsSync(config["dataFileDirectory"])){
                fs.mkdirSync(config["dataFileDirectory"], {recursive: true});
            }
            testData[config["testFileDirectory"]] = inputList;
            TestscriptGeneration.generateTestscriptForFunction(functionAST, inputList, config, exportData);
            let exportModulePath = path.join(testDir, "exports.ts")
            ReImportFromGeneralModule.updateSourceFile(functionAST, exportData, exportModulePath);
        }
    });

    let end = new Date();
    let processingTime = end.getTime() - start.getTime();
    logger.error("Total processing time:" + processingTime);

    let exportHelperPath = TestscriptGeneration.exportAllNeededElementInOneFile(testDir, exportData);
    let rootPath = path.dirname(tsConfigPath);
    ScriptRunner.copyMochaConfigFolder(process.env.MOCHA_CONFIG_DIR, rootPath);
    return testData;
}

export function generateCoverageReport(rootDir: string): string {
    rootDir = path.normalize(rootDir);
    let startTime = new Date();
    logger.info(`Start generate coverage report for project: ${rootDir}`);
    let testRunner = new ScriptRunner();
    let reportPath = testRunner.getCoverageReport(rootDir);
    // testRunner.execute();
    // let reportPath = "http://localhost/coverage/lcov-report/index.html";

    let endTime = new Date();

    let totalTime = endTime.getTime() - startTime.getTime();
    logger.info("Total generate coverage report time: " + totalTime + "ms");

    return reportPath;

}
