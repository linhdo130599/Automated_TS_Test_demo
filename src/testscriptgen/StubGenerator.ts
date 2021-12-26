import {FunctionDeclaration, Identifier} from "ts-morph";
import {DataForGenerateTestscript} from "./DataForGenerateTestscript";
import {Utils} from "../utils/Utils";
import * as path from "path";
import {AbstractProperty} from "./AbstractProperty";
import {ExternalFunctionSymVar} from "../symbolicExecution/variables/ExternalFunctionSymVar";
import {StaticMethodSymVar} from "../symbolicExecution/variables/StaticMethodSymVar";
import {SolverResult} from "../symbolicExecution/solver/SolverResult";
import {BasicParameterProperty} from "./BasicParameterProperty";
import {ExternalFunctionProperty} from "./ExternalFunctionProperty";
import {StaticMethodProperty} from "./StaticMethodProperty";
import {AbstractZ3Variable} from "../symbolicExecution/z3convert/AbstractZ3Variable";
import {TestscriptGeneration} from "./TestscriptGeneration";
import {LiteralParameterZ3Variable} from "../symbolicExecution/z3convert/LiteralParameterZ3Variable";
import {ExternalFunctionZ3Variable} from "../symbolicExecution/z3convert/ExternalFunctionZ3Variable";
import {StaticMethodZ3Variable} from "../symbolicExecution/z3convert/StaticMethodZ3Variable";
import {AbstractDataNode} from "./testdata/AbstractDataNode";
import {StubElementList} from "./stubData/StubElementList";
import {ExternalFunctionStubData} from "./stubData/ExternalFunctionStubData";

// export function parseZ3Result(testcase: string, functionNode: FunctionDeclaration, usedVariables: Array<AbstractZ3Variable>): AbstractDataNode {
//     let parameterDataNode: AbstractDataNode = this.getMultipleParam(testcase, usedVariables);
//     let json = this.rearrangeInputsOrder3(parameters, functionNode);
//     return json;
//
// }

export function parseZ3Result(testcaseOrder: number, testcase: string, functionNode: FunctionDeclaration, usedVariables: Array<AbstractZ3Variable>, stubData: StubElementList): Array<AbstractProperty> {
    let properties: Array<AbstractProperty> = this.getMultipleParam(testcase, usedVariables);
    let parameters = properties.filter(s=> {return s instanceof BasicParameterProperty});
    let externalFunctions = properties.filter(s=> {return s instanceof ExternalFunctionProperty});
    externalFunctions.forEach(f => {
        if (f instanceof ExternalFunctionProperty) {
            let value = f.getValue();
            let type = f.getType();
            let expression = f.getExpression();
            if (expression instanceof Identifier) {
                let declarationNode = expression.getSymbol().getDeclarations()[0];
                if (declarationNode instanceof FunctionDeclaration) {
                    stubData.updateExternalFunction(declarationNode, testcaseOrder, value);
                }
            }
        }

    });
    let staticMethods = properties.filter(s=> {return s instanceof StaticMethodProperty});
    let json = this.rearrangeInputsOrder3(parameters, functionNode);
    return json;
}

export function getMultipleParam(testcase: string, usedVariables: Array<AbstractZ3Variable>): Array<AbstractProperty> {
    let array: string[] = testcase.split(";");
    let result: Array<AbstractProperty> = new Array<AbstractProperty>();
    array.forEach(param=>{
        if (param !== "") {
            result.push(this.getSingleParam(param, usedVariables));
        }
    });
    return result;
}

export function getSingleParam(pattern: string, usedVariables: Array<AbstractZ3Variable>): AbstractProperty {
    let array: string[] = pattern.split("=");
    let level = this.getParamLevel(array[0]);
    let variable = usedVariables.filter(s => {
        return s.oldName === array[0];
    })[0];
    if (variable instanceof LiteralParameterZ3Variable) {
        return new BasicParameterProperty(array[0], array[1], level, variable.type);
    } else if (variable instanceof ExternalFunctionZ3Variable) {
        return new ExternalFunctionProperty(array[0], array[1], level, variable.type, variable.getExpression());
    } else if (variable instanceof StaticMethodZ3Variable) {
        return new StaticMethodProperty(array[0], array[1], level, variable.type, variable.getExpression());
    }
}

export function getParamLevel(paramName: string): number {
    let array: string[] = paramName.split(".");
    return array.length-1;
}

export function rearrangeInputsOrder3(inputs: Array<AbstractProperty>, functionNode: FunctionDeclaration): Array<any> {
    let parameters = [];
    let object = this.buildJsonObject(inputs);
    functionNode.getParameters().forEach(param => {
        let paramName = param.getName();
        parameters.push(object[paramName]);
    });
    return parameters;
}

export function generateTestscriptForFunctionIncludingStub(functionNode: FunctionDeclaration, inputData: Array<Array<AbstractProperty>>): string {
    let importStmt: string = this.generateImportStatementIncludingStub(functionNode, inputData);
    let mochaScript: string = this.generateMochaScriptForAllTestcase(functionNode, inputData);
    let result: string = importStmt + mochaScript;
    Utils.writeToFile(result, process.env.TEST_FILE_PATH);
    // Utils.writeToFile(result, "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\tests\\sources\\auto.generate.tests.ts");
    return result;
}

export function generateMochaScriptForAllTestcase(functionNode: FunctionDeclaration, inputData: Array<Array<AbstractProperty>>): string {
    let result: string = "";
    inputData.forEach(input=> {
        result+= this.generateMochaScriptForSingleTestcase(functionNode, input);
    })
    return result;
}

export function generateSingleTestcaseScriptIncludingStub(functionNode: FunctionDeclaration, inputData: DataForGenerateTestscript): string {

    let importStmt: string = this.generateImportStatementIncludingStub(functionNode, inputData);
    let mochaScript: string = this.generateMochaScriptForSingleTestcase(functionNode, inputData);

    let result: string = importStmt + mochaScript;
    Utils.writeToFile(result, process.env.TEST_FILE_PATH);
    // Utils.writeToFile(result, "C:\\Users\\Admin\\IdeaProjects\\typescript-automated-testdata-generator\\src\\tests\\sources\\auto.generate.tests.ts");
    return result;
}

export function generateImportStatementIncludingStub(functionNode: FunctionDeclaration, inputData: Array<DataForGenerateTestscript>) : string {
    // let fileName = functionNode.getSourceFile().getBaseNameWithoutExtension();
    // let dirPath = functionNode.getSourceFile().getDirectoryPath();
    // let fullFilePath = dirPath + "/" + fileName;
    // let srcIndex = fullFilePath.search(new RegExp("/src/"));
    // let fromString = ".." + fullFilePath.substring(srcIndex, fullFilePath.length);
    let relativePathWithExtension = path.relative(this.getTestFolderPath(functionNode), functionNode.getSourceFile().getFilePath());

    let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");

    let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);

    let result = "import {" + functionNode.getName() + "}" + " from " + "\"" +fromString+ "\";\n";
    return result;
}

export function generateMochaScriptForSingleTestcase(functionNode: FunctionDeclaration, inputData: Array<AbstractProperty>) : string {
    let parameters: Array<AbstractProperty> = inputData.filter(s=> {return s instanceof BasicParameterProperty});
    let externalFunctions: Array<AbstractProperty> = inputData.filter(s=> {return s instanceof ExternalFunctionProperty});
    let staticMethods: Array<AbstractProperty> = inputData.filter(s=> {return s instanceof StaticMethodProperty});
    const tabLevel: number = 2;
    let mockFunctionsScript: string = this.generateMockFunctionScript(externalFunctions, tabLevel);
    let mockStaticMethodsScript: string = this.generateMockStaticMethodScript(staticMethods,tabLevel);
    console.log("Array input: " + JSON.stringify(parameters));
    // let inputVarName = functionNode.getName().concat("Input");
    let initInput = `const parameters =  ${JSON.stringify(parameters)} ;\n`;
    // let initInput = "const input = " + input.toString() + ";\n";
    return initInput + "describe(\"Test\",  () => {\n" +
        "        it(\"Test\",  () => {\n" +
        "            " + `${mockFunctionsScript};\n`+
        "            " + `${mockStaticMethodsScript};\n`+
        "            " + `${initInput};\n`+
        "            " + functionNode.getName()+".apply(null, parameters);\n" +
        "        } )\n" +
        "})"
}

// export function generateMockScript(data: DataForGenerateTestscript) {
//     return "";
// }

export function getBeginSpace(tabLevel: number) {
    let singleTab = "    ";
    let result = "";
    for (var i = 1; i <= tabLevel; i++) {
        result+=singleTab;
    }

    return result;
}

export function generateMockFunctionScript(externalFunctions: Array<AbstractProperty>, tabLevel: number) {
    return "";
}

export function generateMockStaticMethodScript(externalFunctions: Array<AbstractProperty>, tabLevel: number) {
    return "";
}

export function buildJsonObject(inputs: Array<BasicParameterProperty>): Object {
    let object = {};
    inputs.forEach(variable => {
        let tokens = variable.getName().split(".");
        let tmp = object;
        for (var i = 0; i < tokens.length -1; i++) {
            if (tmp[tokens[i]] != null) {
                tmp = tmp[tokens[i]];
            } else {
                if (tokens[i].match("(\\w+)\\[(\\d+)\\]")) {
                    let matcher = tokens[i].match("(\\w+)\\[(\\d+)\\]");
                    let propertyName = matcher[1];
                    // console.log("Name: ", propertyName);
                    let indexMatcher = tokens[i].match(new RegExp("\\[([0-9]+)\\]","g"));
                    let numberIndex = indexMatcher.length;
                    for (var j = 0; j < numberIndex; j++) {
                        let index = indexMatcher[j][1];
                        // console.log(index);
                        if (j == 0) {
                            if (tmp[propertyName] != null) {
                                tmp= tmp[propertyName][index];
                            } else {
                                tmp[propertyName] = [];
                                tmp[propertyName][index] = [];
                                tmp = tmp[propertyName][index];
                            }
                        }
                        else if (j == numberIndex - 1) {
                            if (tmp[index] != null) {
                                tmp= tmp[index];
                            } else {
                                tmp[index] = {};
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
                    tmp[tokens[i]] = {};
                    tmp = tmp[tokens[i]];
                }
            }
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
    });

    console.log("JSON object: " + JSON.stringify(object));
    return object;
}

