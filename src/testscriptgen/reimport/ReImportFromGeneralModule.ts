import {Expression, FunctionDeclaration, Node} from "ts-morph";
import {ExportData} from "../ExportData";
import * as path from "path";
import {ts} from "ts-morph";

export class ReImportFromGeneralModule {
    static updateSourceFile(functionNode: FunctionDeclaration, exportData: ExportData, exportHelperPath: string) {
        let sourceFile = functionNode.getSourceFile();
        let moduleSpecifierRelativePath = this.getExportModuleSpecifier(sourceFile.getDirectoryPath(), exportHelperPath);
        let checkExportModuleExist = false;
        sourceFile.getImportDeclarations().forEach(im => {
            if (im.getStructure().namespaceImport === "exportModule") {
                checkExportModuleExist = true;
            }
        });
        if (checkExportModuleExist == false) {
            sourceFile.addImportDeclaration({moduleSpecifier:moduleSpecifierRelativePath, namespaceImport:"exportModule"});
        }
        let usedExpressions = exportData.getFirstIdentifierOfAllExpression();
        usedExpressions.forEach(e => {
            console.log("expression: " + e.getText());
            e.transform(traversal => {
                let node = traversal.currentNode;
                if (ts.isIdentifier(node)) {
                        let nodeText = node.getText();
                        return ts.createPropertyAccess(ts.createIdentifier("exportModule"), ts.createIdentifier(nodeText));
                }
                return node;
            });
            // console.log(e.getFullText());
            // console.log(e.getText());
            // let originExpressionText = e.getText();
            // let newExpressionText = "exportModule." + originExpressionText;
            // e.replaceWithText(newExpressionText);
        });

        // sourceFile.transform((traversal) => {
        //     if (ts.isNumericLiteral(traversal.currentNode)) {
        //         console.log(traversal.currentNode.text);
        //         return traversal.currentNode;
        //     }
        // });

        // sourceFile.transform(traversal => {
        //     // this will skip visiting the children of the classes
        //     if (ts.isClassDeclaration(traversal.currentNode))
        //         return traversal.currentNode;
        //
        //     const node = traversal.visitChildren();
        //     if (ts.isCallExpression(node)) {
        //         if (node.expression.getText() == "Algorithm.sum") {
        //             return ts.createCall(ts.createPropertyAccess(ts.createIdentifier("exportModule"), "sum"), undefined, undefined);
        //         }
        //         console.log("Expression: "+node.expression.getText());
        //     }
        //         // return ts.updateFunctionDeclaration(node, [], [], undefined, ts.createIdentifier("newName"),
        //         //     [], [], undefined, ts.createBlock([]))
        //     return node;
        // });

        sourceFile.saveSync();
    }

    static getExportModuleSpecifier(sourceFilePath: string, exportHelperPath: string ) : string {
            let relativePathWithExtension = path.relative(sourceFilePath, exportHelperPath);
            if (relativePathWithExtension.startsWith("..") == false) {
                relativePathWithExtension = "./".concat(relativePathWithExtension);
            }
            let fromStringWithExtension = relativePathWithExtension.replace(new RegExp("\\\\", "g"),"/");
            let fromString = fromStringWithExtension.substring(0, fromStringWithExtension.length - 3);
            return fromString;
    }

    // static addExportModuleBeforeExpression(expression: Expression): Expression {
    //
    // }
    //
    // static createExpression(expression: ts.Node): ts.Node {
    //     if (ts.isPropertyAccessExpression(expression)){
    //         let subExpression = expression.expression;
    //         let identifier = expression.name;
    //         return ts.createPropertyAccess(expression, ts.createIdentifier(identifier.text));
    //     }
    //     if (ts.isCallExpression(expression)) {
    //         let propertyAccessExpression = expression.expression;
    //         let argumentsList = expression.arguments;
    //         return ts.createCall(propertyAccessExpression, undefined, ar)
    //     }
    //     if (ts.isIdentifier(expression)) {
    //         return ts.createPropertyAccess(ts.createIdentifier("exportModule"), ts.createIdentifier(expression.text));
    //     }
    // }
}
