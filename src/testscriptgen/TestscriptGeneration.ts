import {
    CallExpression, ClassDeclaration, ElementAccessExpression,
    Expression,
    FunctionDeclaration, Identifier, MethodDeclaration,
    ParameterDeclaration,
    PropertyAccessExpression,
    Type
} from "ts-morph";
import {JSONArray, JSONHelper, JSONObject} from "typescript-logging";
import {AbstractProperty} from "./AbstractProperty";
import {Utils} from "../utils/Utils";
import {deleteQuotes} from "../testscriptgen/JsonGenerationHelper";
import * as path from "path";
import * as fs from "fs";
import {SingleFunctionTestdata} from "./SingleFunctionTestdata";
import {SingleSourceTestdata} from "./SingleSourceTestdata";
import {DataForGenerateTestscript} from "./DataForGenerateTestscript";
import {AbstractZ3Variable} from "../symbolicExecution/z3convert/AbstractZ3Variable";
import {ObjectParameterProperty} from "./ObjectParameterProperty";
import {BasicParameterProperty} from "./BasicParameterProperty";
import {LiteralParameterZ3Variable} from "../symbolicExecution/z3convert/LiteralParameterZ3Variable";
import {ObjectPropertyZ3Variable} from "../symbolicExecution/z3convert/ObjectPropertyZ3Variable";
import {ExternalFunctionZ3Variable} from "../symbolicExecution/z3convert/ExternalFunctionZ3Variable";
import {ExternalFunctionProperty} from "./ExternalFunctionProperty";
import {StaticMethodZ3Variable} from "../symbolicExecution/z3convert/StaticMethodZ3Variable";
import {StaticMethodProperty} from "./StaticMethodProperty";
import {MockData} from "./MockData";
import {ExportData} from "./ExportData";
import {ReImportFromGeneralModule} from "./reimport/ReImportFromGeneralModule";
import {exec} from "child_process";

export class TestscriptGeneration {
    //a=1,b=2,c=3 => [1,2,3]
    // public static readonly SRC_DIR = "input/example-typescript-nyc-mocha-coverage/calculator/ts/src";

    static parseInputDataToArray(testcase: string, functionNode: FunctionDeclaration, usedVariables: Array<AbstractZ3Variable>): Array<any> {
        let parameters: Array<AbstractProperty> = this.getMultipleParam(testcase, usedVariables);
        let json = TestscriptGeneration.rearrangeInputsOrder(parameters, functionNode);
        return json;
    }

    static parseInputDataToObject(testcase: string, functionNode: FunctionDeclaration, usedVariables: Array<AbstractZ3Variable>, exportData: ExportData): DataForGenerateTestscript {
        let variables: Array<AbstractProperty> = this.getMultipleParam(testcase, usedVariables);
        // let paramtersObject = TestscriptGeneration.rearrangeInputsOrder4(parameters, functionNode);
        let externalFunctionProperties: Array<ExternalFunctionProperty> = new Array<ExternalFunctionProperty>();
        let staticMethodProperties: Array<StaticMethodProperty> = new Array<StaticMethodProperty>();
        let parameterProperty: Array<AbstractProperty> = new Array<AbstractProperty>();
        let usedExternalExpressions: Array<Expression> = new Array<Expression>();
        variables.forEach( item => {
            if (item instanceof ExternalFunctionProperty) {
                externalFunctionProperties.push(item);
                let originExpression = item.getExpression();
                if (originExpression instanceof CallExpression) {
                    exportData.addNewExpression(originExpression.getStart(), originExpression);
                    let identifier = originExpression.getExpression();
                    if (identifier instanceof Identifier) {
                        let declarationNode = identifier.getDefinitionNodes()[0];
                        let declarationNodeTest = declarationNode.getText();
                        if (declarationNode instanceof FunctionDeclaration) {
                            exportData.addNewFunction(declarationNode.getSymbol().getFullyQualifiedName(), declarationNode);
                        }
                    }
                }
            } else if (item instanceof StaticMethodProperty) {
                staticMethodProperties.push(item);
                let originExpression = item.getExpression();
                if (originExpression instanceof CallExpression) {
                    exportData.addNewExpression(originExpression.getStart(), originExpression);
                    let propertyAccessExpression = originExpression.getExpression();
                    if (propertyAccessExpression instanceof PropertyAccessExpression) {
                        let staticMethodName = propertyAccessExpression.getName();
                        let className = propertyAccessExpression.getExpression();
                        if (className instanceof Identifier) {
                            let definitionNode = className.getDefinitionNodes()[0];
                            if (definitionNode instanceof ClassDeclaration) {
                                exportData.addNewType(definitionNode.getSymbol().getFullyQualifiedName(), definitionNode.getType());
                            }
                        }
                    }
                }
            } else {
                parameterProperty.push(item);
            }
        });
        let mockData: MockData = new MockData(externalFunctionProperties, staticMethodProperties);
        let parametersObject = this.buildJsonObject(parameterProperty, exportData);
        return new DataForGenerateTestscript(parametersObject, mockData);
    }

    //dung duoc, tao truc tiep mang paramter
    static rearrangeInputsOrder(inputs: Array<AbstractProperty>, functionNode: FunctionDeclaration, usedTypes?: Map<string, Type>): Array<any> {
        let parameters = [];
        let object = this.buildJsonObject(inputs, null);
        functionNode.getParameters().forEach(param => {
            let paramName = param.getName();
            parameters.push(object[paramName]);
        });
        return parameters;
    }

    static buildJsonObject(inputs: Array<AbstractProperty>, exportData: ExportData): Object {
        var object = {};
        inputs.forEach(variable => {
            // let value = variable.getValue();
            if (variable instanceof BasicParameterProperty) {
                let name = variable.getName();
                let value = TestscriptGeneration.getPrimitivePropertyValue(variable);
                object[name] = value;
            } else if (variable instanceof ObjectParameterProperty){
                let expression = variable.getExpression();
                let name = variable.getName().replace(new RegExp("\\.(\\w+)\\(\\)", "g"),
                    (match, p1) => {
                        if (p1.startsWith("get")) {
                            return "." + p1.replace("get", "").toLowerCase();
                        } else {
                            return "." + p1;
                        }
                    })
                let tokens = name.split(".");
                let tmp = object;
                let accessText = "";
                for (var i = 0; i < tokens.length -1; i++) {
                    if (tokens[i].startsWith("get")) {
                        tokens[i] = tokens[i].replace("get","").toLowerCase();
                    }
                    if (tmp[tokens[i]] != null) {
                        accessText+=tokens[i];
                        tmp = tmp[tokens[i]];
                    } else {
                        if (tokens[i].match("(\\w+)\\[(\\d+)\\]")) {
                            let matcher = tokens[i].match("(\\w+)\\[(\\d+)\\]");
                            let propertyName = matcher[1];
                            if (propertyName.startsWith("get")) {
                                propertyName = propertyName.replace("get","").toLowerCase();
                            }
                            accessText = accessText.concat(propertyName);
                            // console.log("Name: ", propertyName);
                            let indexMatcher = tokens[i].match(new RegExp("\\[([0-9]+)\\]","g"));
                            let numberIndex = indexMatcher.length;
                            for (var j = 0; j < numberIndex; j++) {
                                let index = indexMatcher[j][1];
                                accessText=accessText.concat("[", index,"]");
                                // console.log(index);
                                if (j == 0) {
                                    if (tmp[propertyName] != null) {
                                        tmp= tmp[propertyName][index];
                                    } else {
                                        if (numberIndex >1) {
                                            tmp[propertyName] = [];
                                            tmp[propertyName][index] = [];
                                            tmp = tmp[propertyName][index];
                                        } else if (numberIndex == 1) {
                                            tmp[propertyName] = [];
                                            tmp[propertyName][index] = {};
                                            let type = this.findTypeOfAccessExpressionText(accessText, expression);
                                            tmp[propertyName][index]["type"] = type.getSymbol().getName();
                                            exportData.addNewType(type.getSymbol().getFullyQualifiedName(), type);
                                            tmp = tmp[propertyName][index];
                                        }

                                    }
                                }
                                else if (j == numberIndex - 1) {
                                    if (tmp[index] != null) {
                                        tmp= tmp[index];
                                    } else {
                                        tmp[index] = {};
                                        let type = this.findTypeOfAccessExpressionText(accessText, expression);
                                        tmp[index]["type"] = type.getSymbol().getName();
                                        exportData.addNewType(type.getSymbol().getFullyQualifiedName(), type);
                                        tmp = tmp[index];
                                    }
                                } else {
                                    if (tmp[index] != null) {
                                        tmp= tmp[index];
                                    } else {
                                        tmp[index] = [];
                                        tmp = tmp[index];
                                    }
                                }
                            }
                        } else {
                            accessText+=tokens[i];
                            tmp[tokens[i]] = {};
                            let type = this.findTypeOfAccessExpressionText(accessText, expression);
                            tmp[tokens[i]]["type"] = type.getSymbol().getName();
                            exportData.addNewType(type.getSymbol().getFullyQualifiedName(), type);
                            tmp = tmp[tokens[i]];
                        }
                    }

                    accessText = accessText +  ".";
                }
                // tmp = value;
                if (tokens[tokens.length - 1].match("(\\w+)\\[(\\d+)\\]")) {
                    let matcher = tokens[i].match("(\\w+)\\[(\\d+)\\]");
                    let propertyName = matcher[1];
                    let index = matcher[2];
                    if (tmp[propertyName] != null) {
                        tmp[propertyName][index] = TestscriptGeneration.getPrimitivePropertyValue(variable);
                    } else {
                        tmp[propertyName] = [];
                        tmp[propertyName][index] = TestscriptGeneration.getPrimitivePropertyValue(variable);
                    }
                } else {
                    tmp[tokens[tokens.length - 1]] = TestscriptGeneration.getPrimitivePropertyValue(variable);
                    // console.log(tmp[tokens[tokens.length - 1]]);
                }
                // console.log(JSON.stringify(object));
            }

        });

        console.log("JSON object: " + JSON.stringify(object));


        // @ts-ignore
        try {
            const json = require('C:\\\\Users\\\\Tuan Linh\\\\IdeaProjects\\\\jest_test\\\\src\\\\test\\\\test.json');
            const objGen = [...json,object];
            fs.writeFileSync('C:\\\\Users\\\\Tuan Linh\\\\IdeaProjects\\\\jest_test\\\\src\\\\test\\\\test.json', JSON.stringify(objGen));
        }catch (error) {
            console.log(error.message)
        }


        return object;
    }

    static findTypeOfAccessExpressionText(accessText: string, expression: Expression) : Type {
        let type = null;
        let tmp = expression;
        while (true) {
            if (tmp instanceof Identifier) {
                if (tmp.getText() === accessText) {
                    return tmp.getType();
                }
            } else if (tmp instanceof PropertyAccessExpression) {
                let formatExpressionText = this.formatExpressionToString(tmp);
                if (formatExpressionText == accessText) {
                    return tmp.getType();
                } else {
                    tmp = tmp.getExpression();
                }
            } else if (tmp instanceof CallExpression) {
                let formatExpressionText = this.formatExpressionToString(tmp);
                if (formatExpressionText == accessText) {
                    return tmp.getType();
                } else {
                    let propertyAccessExpression = tmp.getExpression();
                    if (propertyAccessExpression instanceof PropertyAccessExpression) {
                        tmp = propertyAccessExpression.getExpression();
                    }
                }
            } else if (tmp instanceof ElementAccessExpression) {
                let formatExpressionText = this.formatExpressionToString(tmp);
                if (formatExpressionText == accessText) {
                    return tmp.getType();
                } else {
                    tmp = tmp.getExpression();
                }
            }
        }
        return type;
    }

    static formatExpressionToString(expression: Expression): string {
        if (expression instanceof Identifier) { return expression.getText()}
        else if (expression instanceof PropertyAccessExpression) {
            let name = expression.getName();
            let subExpression = expression.getExpression();
            return this.formatExpressionToString(subExpression).concat(".", name);
        } else if (expression instanceof CallExpression) {
            let propertyAccessExpression = expression.getExpression();
            if (propertyAccessExpression instanceof Identifier) {
                return propertyAccessExpression.getText();
            } else if (propertyAccessExpression instanceof PropertyAccessExpression) {
                let methodName = propertyAccessExpression.getName();
                if (methodName.startsWith("get")) {
                    methodName = methodName.replace("get", "").toLocaleLowerCase();
                }
                let subExpression = propertyAccessExpression.getExpression();
                return this.formatExpressionToString(subExpression).concat(".", methodName);
            }
        } else if (expression instanceof ElementAccessExpression) {
            let index = expression.getArgumentExpression();
            let arrayExpressin = expression.getExpression();
            return this.formatExpressionToString(arrayExpressin).concat("[", index.getText(), "]");
        }
    }

    static getPrimitivePropertyValue(property: AbstractProperty): string | number | boolean {
        if (property.getType() === "string") {
            return deleteQuotes(property.getValue());
        } else if (property.getType() === "number") {
            return Number(property.getValue());
        } else if (property.getType() === "boolean") {
            return JSON.parse(property.getValue());
        } else return deleteQuotes(property.getValue());
    }

    static generateTestscriptForSingleDemo(functionNode: FunctionDeclaration, inputs: Array<Array<AbstractProperty>>): string {
        let importStmt: string = this.generateImportStatement(functionNode);
        let mochaScript: string = this.generateMochaScript(functionNode, inputs);
        let result: string = importStmt + mochaScript;
        Utils.writeToFile(result, process.env.TEST_FILE_PATH);
        // Utils.writeToFile(result, "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\tests\\sources\\auto.generate.tests.ts");
        return result;
    }

    static generateTestscriptForSingleDemo_paramterAsObject(functionNode: FunctionDeclaration, inputs: Array<DataForGenerateTestscript>, exportData: ExportData): string {
        let config = {};
        config["testDir"] = path.dirname(process.env.INPUT_PROJECT_SOURCE_PATH) + "\\tests";
        config["srcDir"] = process.env.INPUT_PROJECT_SOURCE_PATH;
        config["serializationHelperPath"] = process.env.SERIALIZATION_HELPER_PATH;
        config["testFileDirectory"] = path.dirname(process.env.INPUT_PROJECT_SOURCE_PATH) + "\\tests";
        // config["exportHelperPath"] = "C:\\Users\\Admin\\IdeaProjects\\test-project\\example-typescript-nyc-mocha-coverage\\calculator\\ts\\tests\\exports.ts";
        config["exportHelperPath"] = TestscriptGeneration.exportAllNeededElementInOneFile(config["testDir"], exportData);

        let importStmt: string = this.generateImportStatementNewestVersion(functionNode, config);
        let mochaScript: string = this.generateMochaScriptNewestVersion(functionNode, inputs);
        let result: string = importStmt + mochaScript;
        Utils.writeToFile(result, process.env.TEST_FILE_PATH);
        // Utils.writeToFile(result, "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\tests\\sources\\auto.generate.tests.ts");
        return result;
    }

    //Call for API

    static generateTestscriptForFunction(functionNode: FunctionDeclaration, inputs: Array<DataForGenerateTestscript>, config: Object, exportData: ExportData): string {
        let serializationHelperPath = TestscriptGeneration.copySerializationHelperToTestDirectory(config["testDir"]);
        // let usedTypes = exportData.getUsedTypes();
        config["serializationHelperPath"] = serializationHelperPath;
        config["exportHelperPath"] = path.join(config["testDir"], "exports.ts");

        // fs.closeSync(fs.openSync(config["exportHelperPath"],"w"));


        let importStmt: string = this.generateImportStatementNewestVersion(functionNode, config);
        let mochaScript: string = this.generateMochaScriptNewestVersion(functionNode, inputs);
        let result: string = importStmt + mochaScript;
        Utils.writeToFile(result, path.join(config["testFileDirectory"], functionNode.getSourceFile().getBaseNameWithoutExtension() + "." + functionNode.getName() + ".test.ts" ));
        let dataObject={};
        let countTestcase = 0;
        inputs.forEach(input => {
            countTestcase++;
            dataObject[`test_${countTestcase}`] = input.getParamterObject();
        });
        Utils.writeToFile(JSON.stringify(dataObject), path.join(config["dataFileDirectory"], functionNode.getSourceFile().getBaseNameWithoutExtension() + "." + functionNode.getName() + ".txt" ));
        // Utils.writeToFile(result, "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\tests\\sources\\auto.generate.tests.ts");
        return result;
    }

    static copySerializationHelperToTestDirectory(testDirectory: string):string {
        let serializationHelperPath = path.join(testDirectory, path.basename(process.env.SERIALIZATION_HELPER_PATH));
        fs.copyFileSync(path.normalize(process.env.SERIALIZATION_HELPER_PATH), serializationHelperPath);
        return serializationHelperPath;
    }

    static exportAllNeededElementInOneFile(testDir: string, exportElemets: ExportData) {
        let exportHelperPath = path.join(testDir, "exports.ts");
        let exportContent = "";
        if (fs.existsSync(exportHelperPath)) {
            exportContent = fs.readFileSync(exportHelperPath).toString();
        } else {
            fs.closeSync(fs.openSync(exportHelperPath,"w"));
        }
        // fs.closeSync(fs.openSync(exportHelperPath,"w"));
        let usedTypes = exportElemets.getUsedTypes();
        let usedFunctions = exportElemets.getFunctions();
        let exportData = exportContent;
        // if (usedTypes.size == 0) {
        //     exportData+="export {} from \"./\";\n";
        // }
        if (usedTypes && usedTypes.size >0) {
            usedTypes.forEach(((value, key) => {
                let declarationNode = value.getSymbol().getDeclarations()[0];
                let name = value.getSymbol().getName();
                if (declarationNode instanceof ClassDeclaration) {
                    let sourceFilePath = declarationNode.getSourceFile().getFilePath();
                    let relativePathFromExportFile = path.relative(testDir, sourceFilePath);
                    if (relativePathFromExportFile.startsWith("..") == false) {
                        relativePathFromExportFile = "./".concat(relativePathFromExportFile);
                    }
                    let fromStringWithExtension = relativePathFromExportFile.replace(new RegExp("\\\\", "g"),"/");
                    let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
                    let exportLine = `export { ${name} }` + " from " + "\"" +fromString+ "\";\n";
                    if (exportContent.includes(name)) {

                    } else {
                        exportData += exportLine;
                    }
                }
            }));
        }

        if (usedFunctions && usedFunctions.size > 0) {
            usedFunctions.forEach((value, key) => {
                let declarationNode = value.getSymbol().getDeclarations()[0];
                let name = value.getSymbol().getName();
                if (declarationNode instanceof FunctionDeclaration) {
                    let sourceFilePath = declarationNode.getSourceFile().getFilePath();
                    let relativePathFromExportFile = path.relative(testDir, sourceFilePath);
                    if (relativePathFromExportFile.startsWith("..") == false) {
                        relativePathFromExportFile = "./".concat(relativePathFromExportFile);
                    }
                    let fromStringWithExtension = relativePathFromExportFile.replace(new RegExp("\\\\", "g"),"/");
                    let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
                    if (exportContent.includes(name) == false) {
                        exportData += `export { ${name} }` + " from " + "\"" +fromString+ "\";\n";
                    }
                }
            });
        }

        if (exportData == "") {
            exportData+="export {} from \"./\";\n";
        }


        // usedStaticMethods.forEach((value, key) => {
        //     let declarationNode = value.getSymbol().getDeclarations()[0];
        //     let name = value.getSymbol().getName();
        //     if (declarationNode instanceof MethodDeclaration) {
        //         let classNode = declarationNode.getParent();
        //         if(classNode instanceof ClassDeclaration) {
        //             let sourceFilePath = classNode.getSourceFile().getFilePath();
        //             let relativePathFromExportFile = path.relative(testDir, sourceFilePath);
        //             if (relativePathFromExportFile.startsWith("..") == false) {
        //                 relativePathFromExportFile = "./".concat(relativePathFromExportFile);
        //             }
        //             let fromStringWithExtension = relativePathFromExportFile.replace(new RegExp("\\\\", "g"),"/");
        //             let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
        //             exportData += `export { ${name} }` + " from " + "\"" +fromString+ "\";\n";
        //         }
        //     }
        // });
        fs.writeFileSync(exportHelperPath, exportData);
        return exportHelperPath;
    }

    static generateTestscriptForMultipleDemo(functionNode: FunctionDeclaration, inputs: Array<Array<AbstractProperty>>): string {
        let mochaScript: string = this.generateMochaScript(functionNode, inputs);
        let result: string = mochaScript;
        return result;
    }

    static generateTestscriptForSingleSource(sourceTestdata: SingleSourceTestdata): string {
        let functionsTestdata: Array<SingleFunctionTestdata> = sourceTestdata.getMultipleFunctionTestdata();
        let importStmts: string = this.generateImportStatements(functionsTestdata.map(t => t.getFunctionNode()));
        let mochaScripts: string = this.generateMultipleMochaScript(functionsTestdata);
        let result: string = importStmts + mochaScripts;
        let testFolder = this.getTestFolderPath(functionsTestdata[0].getFunctionNode());
        if (!fs.existsSync(testFolder)){
            fs.mkdirSync(testFolder);
        }

        let sourceName = path.basename(sourceTestdata.getPath(),".ts");
        let testfileName = path.join(testFolder, sourceName + ".test.ts");
        // let testfileName = testFoler + functionNode.getName() + ".test.ts";
        Utils.writeToFile(result, testfileName);
        return result;
    }


    static generateImportStatement(functionNode: FunctionDeclaration) : string {
        let fileName = functionNode.getSourceFile().getBaseNameWithoutExtension();
        let dirPath = functionNode.getSourceFile().getDirectoryPath();
        // let fullFilePath = dirPath + "/" + fileName;
        // let srcIndex = fullFilePath.search(new RegExp("/src/"));
        // let fromString = ".." + fullFilePath.substring(srcIndex, fullFilePath.length);
        let relativePathWithExtension = path.relative(this.getTestFolderPath(functionNode), functionNode.getSourceFile().getDirectoryPath());

        let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");

        let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);

        let result = "import {" + functionNode.getName() + "}" + " from " + "\"" +fromString+ "\";\n";
        return result;

    }

    static generateImportStatementNewestVersion(functionNode: FunctionDeclaration, config: Object) : string {
        // let fileName = functionNode.getSourceFile().getBaseNameWithoutExtension();
        // let dirPath = functionNode.getSourceFile().getDirectoryPath();
        // let fullFilePath = dirPath + "/" + fileName;
        // let srcIndex = fullFilePath.search(new RegExp("/src/"));
        // let fromString = ".." + fullFilePath.substring(srcIndex, fullFilePath.length);
        let srcDir = config["srcDir"];
        let testDir = config["testDir"];
        let serializationHelper = config["serializationHelperPath"];
        // let exportHelper = config["exportHelperPath"];

        let relativePathWithExtension = path.relative(this.getTestFolderPathRealVersion(functionNode, srcDir, testDir), functionNode.getSourceFile().getFilePath());

        let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");

        let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);

        let result = "import {" + functionNode.getName() + "}" + " from " + "\"" +fromString+ "\";\n";
        let importHelper = this.generateImportSerializeHelper(config["testFileDirectory"], serializationHelper);
        let mockLibraryImport = "import {ImportMock} from \"ts-mock-imports\";\n";
        let importExportModule = this.generateExportModuleImportString(config["testFileDirectory"], config["exportHelperPath"]);
        return result + importHelper + mockLibraryImport + importExportModule;

    }

    static generateExportModuleImportString(testFileDirectory: string, exportHelperPath: string ): string {
        let relativePathWithExtension = path.relative(testFileDirectory, exportHelperPath);
        if (relativePathWithExtension.startsWith("..") == false) {
            relativePathWithExtension = "./".concat(relativePathWithExtension);
        }
        let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");
        let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
        let result = "import * as exportModule" + " from " + "\"" +fromString+ "\";\n";
        return result;
    }

    static generateImportSerializeHelper(testDir: string, serializationHelperPath: string): string {
        let relativePathWithExtension = path.relative(testDir, serializationHelperPath);
        if (relativePathWithExtension.startsWith("..") == false) {
            relativePathWithExtension = "./".concat(relativePathWithExtension);
        }
        let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");
        let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
        let result = "import { SerializationHelper}" + " from " + "\"" +fromString+ "\";\n";
        return result;
    }


    static generateImportStatements(functionNodes: Array<FunctionDeclaration>) : string {
        let result = "";
        functionNodes.forEach(functionNode => {
            result = result.concat(this.generateImportStatement(functionNode));
        })
        return result;
    }

    static getTestFolderPath(functionNode: FunctionDeclaration): string {
        let rootPath = process.env.INPUT_PROJECT_SOURCE_PATH;
        let rootPathFormat = path.normalize(rootPath);
        let sourceFilePath = functionNode.getSourceFile().getDirectoryPath();
        let sourceFilePathFormat = path.normalize(sourceFilePath);
        let relativePath = sourceFilePathFormat.replace(rootPathFormat, "");
        // let testFoler = path.join(TestscriptGeneration.TEST_DIR, relativePath);
        let testFoler = path.join(process.env.TEST_DIR, relativePath);
        return testFoler;
    }

    static getTestFolderPathRealVersion(functionNode: FunctionDeclaration, srcPath: string, testDir: string): string {
        let rootPath = srcPath;
        let rootPathFormat = path.normalize(rootPath);
        let sourceFilePath = functionNode.getSourceFile().getDirectoryPath();
        let sourceFilePathFormat = path.normalize(sourceFilePath);
        let relativePath = sourceFilePathFormat.replace(rootPathFormat, "");
        // let testFoler = path.join(TestscriptGeneration.TEST_DIR, relativePath);
        let testFoler = path.join(testDir, relativePath);
        return testFoler;
    }


    static generateMochaScript(functionNode: FunctionDeclaration, input: Array<Array<any>>) : string {
        console.log("Array input: " + JSON.stringify(input));
        let inputVarName = functionNode.getName().concat("Input");
        let initInput = `const ${inputVarName} =  ${JSON.stringify(input)} ;\n`;
        // let initInput = "const input = " + input.toString() + ";\n";
        return initInput + "describe(\"Test\",  () => {\n" +
            `    ${inputVarName}.forEach(parameters => {\n` +
            "        it(\"Test\",  () => {\n" +
            "            "+functionNode.getName()+".apply(null, parameters);\n" +
            "        } )\n" +
            "    })\n" +
            "})"
    }

    static generateMochaScriptNewestVersion(functionNode: FunctionDeclaration, inputs: Array<DataForGenerateTestscript>) : string {
        let itscript = "";
        inputs.forEach(o => {
            itscript+=this.generateMochaScriptForSingleTestcase_paramterAsObject(functionNode, o);
        });

        return "describe(\"Test\",  () => {\n" +
            itscript +
        "})"
    }

    static generateMochaScriptForSingleTestcase_paramterAsObject(functionNode: FunctionDeclaration, inputData: DataForGenerateTestscript) : string {
        let parameterObject = inputData.getParamterObject();
        console.log("parameter input: " + JSON.stringify(parameterObject));
        let mockScript = this.generateMockScript(inputData.getMockData());
        let inputVarName = functionNode.getName().concat("Input");
        let initInput = `const object =   ${JSON.stringify(parameterObject)};\n`;
        let createInstanceScript =  "            "+"let paramters: any = {};\n" +
            "            "+  "SerializationHelper.fillFromJSON(JSON.stringify(object), paramters);\n";
        let parameterArrayText = "";
        functionNode.getParameters().forEach(param => {
            parameterArrayText= parameterArrayText.concat(`paramters[\"${param.getName()}\"]`,",")
        });

        parameterArrayText = "".concat("[", parameterArrayText,"]");

        return "        it(\"Test\",  () => {\n" +
                mockScript +
                "            "+initInput +
                createInstanceScript +
                "            "+functionNode.getName()+`.apply(null, ${parameterArrayText});\n` +
                "            "+"ImportMock.restore();\n" +
                "        });\n" ;
    }

    static generateMockScript(mockData: MockData): string {
        return this.generateMockExternalFunction(mockData) + this.generateMockStaticFunction(mockData);

    }

    static generateMockExternalFunction(mockData: MockData): string {
        let externalFunctions = mockData.getExternalFunctions();
        let countSub = 0;
        let result = "";
        externalFunctions.forEach(f => {
            countSub++;
            result+= "            " + `const stub${countSub} = ImportMock.mockFunction(exportModule, '${f.getName()}', ${f.getValue()});\n`;
        });
        return result;
    }

    static generateMockStaticFunction(mockData: MockData): string {
        let map: Map<string, Array<StaticMethodProperty>> = mockData.groupStaticMethodByClassName();
        let result = "";
        let countClass = 0;
        map.forEach((value, key) => {
            countClass++;
            result+= "            "+`const mockManager${countClass} = ImportMock.mockStaticClass(exportModule, "${key}");\n`;
            value.forEach(method => {
                let methodName = "noName";
                let expression = method.getExpression();
                if (expression instanceof CallExpression) {
                    let propertyAccessExpression = expression.getExpression();
                    if (propertyAccessExpression instanceof PropertyAccessExpression) {
                        methodName = propertyAccessExpression.getName();
                    }
                }
                result+="            " + `mockManager${countClass}.mock("${methodName}", ${method.getValue()});\n`
            })
        });
        return result;
    }

    static generateMultipleMochaScript(testdatas: Array<SingleFunctionTestdata>) : string {
        let result = "";
        testdatas.forEach(testdata => {
            let functionNode = testdata.getFunctionNode();
            let inputs = testdata.getInputs();
            let singleScipt = this.generateTestscriptForMultipleDemo(functionNode, inputs);
            result = result.concat(singleScipt, "\n\n");
        });
        return result;
    }


    static getSingleParam(pattern: string, usedVariables: Array<AbstractZ3Variable>): AbstractProperty {
        let array: string[] = pattern.split("=");
        let level = this.getParamLevel(array[0]);
        let variable = usedVariables.filter(s => {
            return s.oldName === array[0];
        });
        if (variable[0] instanceof LiteralParameterZ3Variable) {
            return new BasicParameterProperty(array[0], array[1], level, variable[0].type);
        } else if (variable[0] instanceof ObjectPropertyZ3Variable) {
            let tmp = variable[0] as ObjectPropertyZ3Variable;
            let object = new ObjectParameterProperty(array[0], array[1], level, variable[0].type, tmp.getExpression());
            return object;
            // return new ObjectParameterProperty(array[0], array[1], level, variable[0].type, tmp.getExpression());
        } else if (variable[0] instanceof ExternalFunctionZ3Variable) {
            let tmp = variable[0] as ExternalFunctionZ3Variable;
            return new ExternalFunctionProperty(array[0], array[1], level, variable[0].type, tmp.getExpression());
        } else if (variable[0] instanceof StaticMethodZ3Variable) {
            let tmp = variable[0] as StaticMethodZ3Variable;
            return new StaticMethodProperty(array[0], array[1], level, variable[0].type, tmp.getExpression());
        }
    }

    static getParamLevel(paramName: string): number {
        let array: string[] = paramName.split(".");
        return array.length-1;
    }

    static getMultipleParam(testcase: string, usedVariables: Array<AbstractZ3Variable>): Array<AbstractProperty> {
        let array: string[] = testcase.split(";");
        let result: Array<AbstractProperty> = new Array<AbstractProperty>();
        array.forEach(param=>{
            if (param !== "") {
                result.push(this.getSingleParam(param, usedVariables));
            }
        });
        return result;
    }

}
