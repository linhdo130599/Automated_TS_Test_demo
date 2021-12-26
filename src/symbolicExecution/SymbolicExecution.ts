import {ITestpath} from "../cfg/generation/testpath/ITestpath";
import {ISymbolicVariable} from "./variables/ISymbolicVariable";
import {SymbolicTable} from "./SymbolicTable";
import {IConstraint} from "./constraints/IConstraint";
import {
    ArrayLiteralExpression, BinaryExpression,
    BooleanLiteral,
    Expression, Identifier,
    LiteralExpression,
    NullLiteral,
    NumericLiteral,
    ParameterDeclaration,
    Statement, StringLiteral
} from "ts-morph";
import {factory} from "../ConfigLog4j";
import {SymbolicVariable} from "./variables/SymbolicVariable";
import {NumberSymbolicVariable} from "./variables/NumberSymbolicVariable";
import {BooleanSymbolicVaribale} from "./variables/BooleanSymbolicVaribale";
import {StringSymbolicVariable} from "./variables/StringSymbolicVariable";
import {InitializedSymbolicExpression} from "./expressions/InitializedSymbolicExpression";
import {ICfgNode} from "../cfg/nodes/ICfgNode";
import {Direction, FlagCondition} from "../cfg/generation/testpath/FlagCondition";
import {BeginFlagCfgNode} from "../cfg/nodes/BeginFlagCfgNode";
import {EndFlagCfgNode} from "../cfg/nodes/EndFlagCfgNode";
import {NormalCfgNode} from "../cfg/nodes/NormalCfgNode";
import {ConditionCfgNode} from "../cfg/nodes/ConditionCfgNode";
import {ScopeCfgNode} from "../cfg/nodes/ScopeCfgNode";
import {SimpleCfgNode} from "../cfg/nodes/SimpleCfgNode";
import {CfgNode} from "../cfg/nodes/CfgNode";
import {StatementParser} from "./parsers/StatementParser";
import {Utils} from "../utils/Utils";
import {Constraint} from "./constraints/Constraint";
import {BooleanLiteralConstraint} from "./constraints/BooleanLiteralConstraint";
import {NullLiteralConstraint} from "./constraints/NullLiteralConstraint";
import {NumberLiteralSymExp} from "./expressions/NumberLiteralSymExp";
import {ExpressionConstraint} from "./constraints/ExpressionConstraint";
import {BooleanLiteralSymExp} from "./expressions/BooleanLiteralSymExp";
import {NullLiteralSymExp} from "./expressions/NullLiteralSymExp";
import {StringLiteralSymExp} from "./expressions/StringLiteralSymExp";
import {UndefinedLiteralSymExp} from "./expressions/UndefinedLiteralSymExp";
import {SingleBinaryConstraint} from "./constraints/SingleBinaryConstraint";
import {MultipleConstraint} from "./constraints/MultipleConstraint";
import {PrefixUnaryConstraint} from "./constraints/PrefixUnaryConstraint";
import {AnySymbolicVariable} from "./variables/AnySymbolicVariable";
import {NotDeclaredSymVar} from "./variables/NotDeclaredSymVar";
import {ExternalFunctionSymVar} from "./variables/ExternalFunctionSymVar";
import {StaticMethodSymVar} from "./variables/StaticMethodSymVar";
import {AbstractZ3Variable} from "./z3convert/AbstractZ3Variable";
import {LiteralParameterZ3Variable} from "./z3convert/LiteralParameterZ3Variable";
import {ExternalFunctionZ3Variable} from "./z3convert/ExternalFunctionZ3Variable";
import {StaticMethodZ3Variable} from "./z3convert/StaticMethodZ3Variable";
import {ObjectPropertyZ3Variable} from "./z3convert/ObjectPropertyZ3Variable";


export class SymbolicExecution {
    public static logger = factory.getLogger("SymbolicExecution");
    private _testpath: ITestpath;
    private _table: SymbolicTable;
    private _constraints: Array<IConstraint>;
    private _parameters: Array<ParameterDeclaration>;
    private _externalFunction: Array<Expression>;
    private _externalStaticMethod: Array<Expression>;

    // constructor(parameters: Array<ParameterDeclaration>, testpath: ITestpath) {
    //     let startTime = new Date();
    //     this._parameters = parameters;
    //     this._testpath = testpath;
    //     this._table = new SymbolicTable();
    //     this._constraints = new Array<IConstraint>();
    //     this.createMappingTable();
    //     // this._tableMapping.setFunctionNode(functionNode);
    //     // this.symbolize();
    //     let endTime = new Date();
    //     let totalTime = endTime.getTime() - startTime.getTime();
    //     SymbolicExecution.logger.info("Total symbolic execution time: " + totalTime + "ms");
    //
    // }

    constructor(testpath: ITestpath) {
        let startTime = new Date();
        this._parameters = testpath.getFunctionNode().getParameters();
        this._testpath = testpath;
        this._table = new SymbolicTable();
        this._constraints = new Array<IConstraint>();
        this.createMappingTable();
        // this._tableMapping.setFunctionNode(functionNode);
        // this.symbolize();
        let endTime = new Date();
        let totalTime = endTime.getTime() - startTime.getTime();
        SymbolicExecution.logger.info("Total symbolic execution time: " + totalTime + "ms");

    }

    private createMappingTable(): void {
        for (var i = 0; i< this._parameters.length; i++) {
            let parameter : ParameterDeclaration = this._parameters[i];
            let symbolicVar: ISymbolicVariable = null;
            let name= parameter.getName();
            // //TODO  tro den ast class node, hien tai la primiive
            let nodeType = parameter.getType().getText();
            let defaultValue: string = SymbolicVariable.PREFIX_SYMBOLIC_VALUE + name;
            if (parameter.getStructure().type === "number") {
                symbolicVar = new NumberSymbolicVariable(name, new InitializedSymbolicExpression(defaultValue, "number"));
            }
            else if (parameter.getStructure().type === "boolean") {
                symbolicVar = new BooleanSymbolicVaribale(name, new InitializedSymbolicExpression(defaultValue, "boolean"));
            }
            else if (parameter.getStructure().type === "string"){
                symbolicVar = new StringSymbolicVariable(name, new InitializedSymbolicExpression(defaultValue, "string"));
            } else if (parameter.getStructure().type === "any") {
                symbolicVar = new AnySymbolicVariable(name, new InitializedSymbolicExpression(defaultValue, "any"));
            }

            if (symbolicVar !== null) {
                // symbolicVar.setFunctionNode(this._functionNode);
                // symbolicVar.setVariableNode(temp);
                this._table.push(symbolicVar);
            }
        }
    }

    symbolize(): void {
        //TODO thay doi scopeLevel
        let scopeLevel = 1;
        //TODO normalize testpath truoc khi symbolic Execution
        //tam thoi coi nhu da dc normalize

        // let flagConditions: Array<FlagCondition>  = testpath.getFlags();//Testpath chỉ dùng dc 1 lần
        let flagConditions: Array<FlagCondition>  = Object.assign([], this._testpath.getFlags());
        this._testpath.getElements().forEach((cfgNode) => {
            if (cfgNode instanceof BeginFlagCfgNode || cfgNode instanceof EndFlagCfgNode) {
                //nothing todo
            } else {
                //TODO bien nay chua biet co tac dung gi
                let isContinue =true;
                if (cfgNode instanceof NormalCfgNode) {
                    if (cfgNode instanceof ConditionCfgNode) {
                        let flagConditon = flagConditions.shift();
                        if (flagConditon == undefined) {
                            SymbolicExecution.logger.error("Danh dau bieu thuc dieu kien khong dung");
                        }
                        // let conditionCfgNode = cfgNode as ConditionCfgNode;
                        let expression: Expression = cfgNode.getAstCondition();
                        //TODO hien tai chua xu ly truong hop trong condition co chua bien khac paramter
                        let newUsedVariables: Array<ISymbolicVariable> = this._table.findNewVariableAndCreate(expression);
                        this.createNewConstraints(newUsedVariables);
                        isContinue = this.parseCondition(cfgNode, flagConditon.getFlag());
                    } else if (cfgNode instanceof SimpleCfgNode) {
                        //ToDO xu ly assign statement
                        let ast: Statement = cfgNode.getStatement();
                        let statementParser: StatementParser = new StatementParser();
                        statementParser.parse(ast, this._table);
                        // this._useVariables.push(this.getUsedVariable(this._tableMapping));
                    }
                } else if (cfgNode instanceof ScopeCfgNode) {
                    //TODO parse Scope
                    //parseScope;
                    scopeLevel = this.parseScope(cfgNode, scopeLevel, this._table);
                }

            }
        })
    }

    parseCondition(cfgNode: ConditionCfgNode, flag: number): boolean {
        let expression: Expression = cfgNode.getAstCondition();
        let constraint = this.transferExpression(expression, this._table);
        if (flag === Direction.FALSE) {
            constraint = new PrefixUnaryConstraint(expression, constraint);
        }
        this._constraints.push(constraint)
        return true;
    }

    transferExpression(expression: Expression, table: SymbolicTable): Constraint {
        expression = Utils.shortenParenthesizedExpression(expression);
        let newConstraint;
        if (!(expression instanceof BinaryExpression)) {
            let symbolicExpression = ExpressionConstraint.tranfer(expression, this._table);
            return new ExpressionConstraint(expression, symbolicExpression);
        }
        else if (expression instanceof BinaryExpression ) {
            let newConstraint;
            if (Utils.isSingleCondition(expression)) {
                if (Utils.isMathematicalExpression(expression)) {
                    let symbolicExpression = ExpressionConstraint.tranfer(expression, this._table);
                    return new ExpressionConstraint(expression, symbolicExpression);
                    // if (symbolicExpression.isNull() == true) {
                    //     newConstraint = new ExpressionConstraint(expression, new BooleanLiteralSymExp("false"));
                    // } else {
                    //     newConstraint = new ExpressionConstraint(expression, new BooleanLiteralSymExp("true"));
                    // }
                    // newConstraint = new ExpressionConstraint(expression, symbolicExpression);
                } else if (Utils.isComparableExpression(expression)) {
                    newConstraint = SingleBinaryConstraint.tranfer(expression, this._table);
                }
            } else if (Utils.isMultipleCondition(expression)) {
                let operator = expression.getOperatorToken().getText();
                let left = expression.getLeft();
                let right = expression.getRight();
                newConstraint = new MultipleConstraint(expression,operator,
                                                        this.transferExpression(left, this._table),
                                                        this.transferExpression(right, this._table));

            }
            return newConstraint;
        }
    }

    // transferMultipleConstraintExpression(expression: Expression): MultipleConstraint {
    //     if (expression instanceof BinaryExpression) {
    //         if (Utils.isMultipleCondition(expression)) {
    //             let operator = expression.getOperatorToken().getText();
    //             let left = expression.getLeft();
    //             let right = expression.getRight();
    //             let leftSymbolic = ;
    //             let rightSymbolic = ExpressionConstraint.tranfer(right, table);
    //             return new SingleBinaryConstraint(expression, operator, leftSymbolic, rightSymbolic);
    //         } else {
    //             this.logger.error("Expression is not multiple constraint: " + expression.getText());
    //         }
    //     } else {
    //         this.logger.error("Transfer invalid expression: " + expression.getText() + " is not binary expression");
    //     }
    // }


    parseScope(cfgNode: CfgNode, scopeLevel: number,  table: SymbolicTable) {
        if (cfgNode.getContent() === "{")
            scopeLevel++;
        else {
            table.deleteScopeLevelAt(scopeLevel);
            scopeLevel--;
        }
        return scopeLevel;
    }
    getTestpath(): ITestpath {
        return this._testpath;
    }

    setTestpath(value: ITestpath) {
        this._testpath = value;
    }

    getTable(): SymbolicTable {
        return this._table;
    }

    setTable(value: SymbolicTable) {
        this._table = value;
    }

    getConstraints(): Array<IConstraint> {
        return this._constraints;
    }

    setConstraints(value: Array<IConstraint>) {
        this._constraints = value;
    }

    getParameters(): Array<ParameterDeclaration> {
        return this._parameters;
    }

    setParameters(value: Array<ParameterDeclaration>) {
        this._parameters = value;
    }

    public createNewConstraints(newVariables: Array<ISymbolicVariable>) : void {
        newVariables.forEach(item => {
            this.creatNewConstraint(item);
        })
    }

    public creatNewConstraint(newVariable: ISymbolicVariable) : void {
        // this._constraints.push(newVariable);
    }

    public getZ3InputVariable(): Array<AbstractZ3Variable> {
        let z3inputs = new Array<AbstractZ3Variable>();
        this._parameters.forEach(param => {
            let name = param.getName();
            let type = param.getType().getText();
            switch (type) {
                case "number":
                case "boolean":
                case "string": {
                    z3inputs.push(new LiteralParameterZ3Variable(name, type, name));
                    break;
                }
                case "any": {
                    //ignore
                    break;
                }
                default: {
                    this.getTable().getElements().forEach(symVar => {
                        if (symVar instanceof ExternalFunctionSymVar) {
                            let z3Name = symVar.getNewName();
                            z3inputs.push(new ExternalFunctionZ3Variable(z3Name, symVar.getType(), symVar.getName(), symVar.getExpression()));
                        } else if (symVar instanceof StaticMethodSymVar ) {
                            let z3Name = symVar.getNewName();
                            z3inputs.push(new StaticMethodZ3Variable(z3Name, symVar.getType(), symVar.getName(), symVar.getExpression()));
                        }
                        else if (symVar instanceof NotDeclaredSymVar) {
                            let token: string[] = symVar.getName().split(".");
                            let arrayAccessPattern = name + "\\[";
                            let arrayAccessRegex = new RegExp(arrayAccessPattern);
                            if (token[0] == name || token[0].match(arrayAccessRegex)) {
                                let z3Name = symVar.getNewName();
                                z3inputs.push(new ObjectPropertyZ3Variable(z3Name, symVar.getType(), symVar.getName(), symVar.getExpression()));
                                // let z3Name = symVar.getName().replace(".", SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES)
                                //     .replace(new RegExp("\\[", "g"), SymbolicVariable.ARRAY_OPENING)
                                //     .replace(new RegExp("\\]", "g"), SymbolicVariable.ARRAY_CLOSING);
                                // if (symVar instanceof BooleanSymbolicVaribale) {
                                //     z3inputs.push(new Z3Variable(z3Name, "boolean"));
                                // } else if (symVar instanceof NumberSymbolicVariable) {
                                //     z3inputs.push(new Z3Variable(z3Name, "number"));
                                // } else if (symVar instanceof StringSymbolicVariable) {
                                //     z3inputs.push(new Z3Variable(z3Name, "string"));
                                // } else {
                                //     //nothing to do
                                // }
                            }
                        }

                    })
                }

            }

        });
        this._table.getExternalFunctions().forEach(symVar=> {
            let z3Name = symVar.getNewName();
            z3inputs.push(new ExternalFunctionZ3Variable(z3Name, symVar.getType(), symVar.getName(), symVar.getExpression()));
        });
        this._table.getStaticMethods().forEach(symVar=> {
            let z3Name = symVar.getNewName();
            z3inputs.push(new StaticMethodZ3Variable(z3Name, symVar.getType(), symVar.getName(), symVar.getExpression()));
        });
        return z3inputs;
    }

}
