import {
    CallExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    Node,
    PropertyAccessExpression,
    SyntaxKind
} from "ts-morph";
import {PropertyAccessChangedToken} from "./PropertyAccessChangedToken";
import {TypeHelper} from "./TypeHelper";
import {IFunctionNormalizer} from "./IFunctionNormalizer";
import {Logger} from "typescript-logging";
import {factory} from "../ConfigLog4j";
import {SymbolicVariable} from "../symbolicExecution/variables/SymbolicVariable";

export class ParameterNormalizer implements IFunctionNormalizer{

    private static logger: Logger = factory.getLogger("ParameterNormalizer");
    private _changedTokens: Map<string, PropertyAccessChangedToken> = new Map();

    normalize(functionNode: FunctionDeclaration): FunctionDeclaration {
        let tmpFunction = functionNode;
        let changedTokens: Map<string, PropertyAccessChangedToken> = new Map();

        tmpFunction.forEachDescendant((node, traversal) => {
            if (node instanceof PropertyAccessExpression) {
                let type = node.getType().getText();
                if (node.getText().endsWith(".startsWith") || node.getText().endsWith("endsWith") || node.getText().endsWith("includes")) {
                    //do nothing
                }
                else if (node.getText().endsWith(".length")) {
                    let subPropertyAccess = node.getExpression();
                    if (subPropertyAccess instanceof PropertyAccessExpression) {
                        let changedToken = new PropertyAccessChangedToken(node);
                        let identifierText = ParameterNormalizer.convertStringPropertyAccess(node, changedToken);
                        changedTokens.set(changedToken.getOldText(), changedToken);
                        node.replaceWithText(identifierText + ".length");
                        traversal.skip();
                    } else {
                        //do nothing
                        traversal.skip();
                    }
                } else {
                    let changedToken = new PropertyAccessChangedToken(node);
                    let identifierText = ParameterNormalizer.convertPropertyAccessToIdentifier(node, changedToken);
                    changedTokens.set(node.getText(), changedToken);
                    node.replaceWithText(identifierText);
                    traversal.skip();
                }
                traversal.skip();
            }
            else if (node.getKind() == SyntaxKind.CallExpression) {
                let nodeCallExpression: CallExpression = node as CallExpression;
                let nodeText = node.getText();
                let identifierMethod: PropertyAccessExpression = nodeCallExpression.getExpression() as PropertyAccessExpression;
                let stringMethodName = identifierMethod.getName();
                let identifier: Expression = identifierMethod.getExpression();
                if (identifier instanceof PropertyAccessExpression) {
                    if (nodeText.includes("endsWith") || nodeText.includes("startsWith") || nodeText.includes("includes") || nodeText.includes("substring") || nodeText.includes("indexof") ){
                        let changedToken = new PropertyAccessChangedToken(node);
                        let identifierText = ParameterNormalizer.convertStringMethodAccess(nodeCallExpression, changedToken);
                        changedTokens.set(changedToken.getOldText(), changedToken);
                        let argumentsText: Array<string> = ParameterNormalizer.getNormalizedTextFromArgumentsInStringMethodCallExpression(nodeCallExpression, changedTokens);
                        nodeCallExpression.replaceWithText(identifierText + "."+ stringMethodName+"(" + argumentsText.join(",") +  ")");
                    // } else if (nodeText.includes("substring")){
                    //     let c
                    }else {
                        throw new Error("Don't support this expression: " + nodeText);
                    }
                }
            }
        });



        //xoa paramter la object
        tmpFunction.getParameters().forEach(param => {
            let type = param.getStructure().type.toString();
            let typeChecker = TypeHelper.checkType(type);
            if (typeChecker == TypeHelper.OBJECT_TYPE) {
                param.remove();
            }
        });

        //them parameter moi person: Person => person____age: number, person_____name: string
        changedTokens.forEach((value, key) => {
            let changedToken: PropertyAccessChangedToken = value as PropertyAccessChangedToken;
            tmpFunction.insertParameter(0,{name: changedToken.getNewText(), type: changedToken.getType()});
        });

        this.setChangedTokens(changedTokens);
        return tmpFunction;
    }

    private static convertPropertyAccessToIdentifier(node: Node, changedToken: PropertyAccessChangedToken ): string {
        let propertyAccessText: string = node.getText();
        let result = propertyAccessText.replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES);
        changedToken.setNewText(result);
        changedToken.setType(node.getType().getText());
        return result;
    }

    //person.school.name.length => person__school__name.length
    private static convertStringPropertyAccess(node: Node, changedToken: PropertyAccessChangedToken) : string {
        let propertyAccessText: string = node.getText();
        let result: string = "";
        if (propertyAccessText.endsWith(".length")) {
            node.forEachDescendant((node1, traversal) => {
                if (node1.getKind() == SyntaxKind.PropertyAccessExpression) {
                    // console.log("Sub access: " + node1.getText());
                    // console.log("Type: " + node1.getType().getText());
                    let typePropertyAccess = node1.getType().getText();
                    if ( typePropertyAccess === "string") {
                        result = node1.getText().replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES);
                        // result = result.concat(".length");
                        changedToken.setOldText(node1.getText());
                        changedToken.setNewText(result);
                        changedToken.setType("string");
                        traversal.stop();
                    } else {
                        result = propertyAccessText.replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES);
                        changedToken.setOldText(node.getText());
                        changedToken.setNewText(result);
                        changedToken.setType(node.getType().getText());
                        traversal.stop();
                    }
                }
            });
        } else {
            result = propertyAccessText.replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES);
        }
        return result;
    }

    private static convertStringMethodAccess(expression: CallExpression, changedToken: PropertyAccessChangedToken) : string {
        let methodAccessText: string = expression.getText();
        let propertyIdentifier: PropertyAccessExpression = expression.getExpression() as PropertyAccessExpression;
        let subPropertyIdentifier: Expression = propertyIdentifier.getExpression();
        let type = subPropertyIdentifier.getType();
        let typeText = type.getText();
        if (type.getText() === "string" && subPropertyIdentifier instanceof PropertyAccessExpression) {
            let propertyAccessText: string = expression.getExpression().getText();
            let result: string = "";
            if (propertyAccessText.endsWith("endsWith") || propertyAccessText.endsWith("startsWith") || propertyAccessText.endsWith("includes") || propertyAccessText.endsWith("substring") || propertyAccessText.endsWith("indexof")){
                // console.log("Sub access: " + node1.getText());
                // console.log("Type: " + node1.getType().getText());
                result = subPropertyIdentifier.getText().replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES);
                changedToken.setOldText(subPropertyIdentifier.getText());
                changedToken.setNewText(result);
                changedToken.setType("string");
                return result;
            } else {
                throw new Error("Dont support this expression: " + methodAccessText);
            }
        }
        else if (subPropertyIdentifier instanceof Identifier) {
            //Do nothing
        }
        else {
            throw new Error("Dont support this expression: " + methodAccessText);
        }
    }

    static getNormalizedTextFromArgumentsInStringMethodCallExpression(node: CallExpression, changedTokens: Map<string, PropertyAccessChangedToken>): Array<string> {
        let argumentsText: Array<string> = [] ;
        node.getArguments().forEach(arg => {
            if (arg.getKind() === SyntaxKind.StringLiteral) {
                argumentsText.push(arg.getText());
            } else if (arg.getKind() === SyntaxKind.PropertyAccessExpression) {
                if (arg.getType().getText() === "string") {
                    let newText = arg.getText().replace(new RegExp("\\.", "g"), SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES );
                    let changedToken: PropertyAccessChangedToken = new PropertyAccessChangedToken(arg,arg.getText(), newText, "string");
                    changedTokens.set(arg.getText(), changedToken);
                    argumentsText.push(newText);
                } else {
                    throw new Error("Dont support this type in string method arguments: " + arg.getType().getText() + " in argument: " + arg.getText);
                }
            } else if (arg.getKind() === SyntaxKind.Identifier) {
                if (arg.getType().getText() === "string") {
                    argumentsText.push(arg.getText());
                } else {
                    throw new Error("Dont support this type in string method arguments: " + arg.getType().getText() + " in argument: " + arg.getText);
                }
            }
            else {
                throw new Error("Dont support this expression in string method arguments: " + arg.getKind());
            }
        });
        return argumentsText;
    }

    getChangedTokens(): Map<string, PropertyAccessChangedToken> {
        return this._changedTokens;
    }

    setChangedTokens(value: Map<string, PropertyAccessChangedToken>) {
        this._changedTokens = value;
    }

    //collect all propertyAccessExpression and save to changed list, for converting to identifier
    //phai lam nhu nay de lay duoc chinh xac type cua property
    //khong duyet duoc tren tmpFunction vi createSourceFile khong luu dc type goc
    // private initPropertyAccessChangedToken(functionNode: FunctionDeclaration): Map<string, PropertyAccessChangedToken> {
    //     let changedTokens = new Map();
    //     functionNode.forEachDescendant((descendant,traversal) => {
    //         if (TypeGuards.isPropertyAccessExpression(descendant)) {
    //             let type = descendant.getType().getText();
    //             let oldText = descendant.getText();
    //             let changedToken = new PropertyAccessChangedToken(descendant, oldText);
    //             changedToken.setType(type);
    //             changedTokens.set(oldText, changedToken);
    //             traversal.skip();
    //         }
    //     });
    //
    //     return changedTokens;
    // }

}
