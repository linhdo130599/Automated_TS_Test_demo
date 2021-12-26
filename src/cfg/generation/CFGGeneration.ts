import {ICFGGeneration} from "./ICFGGeneration";
import {ICFG} from "../ICFG";
import {
    BinaryExpression,
    Block, BreakStatement, CaseClause, CommentStatement, ContinueStatement, DefaultClause, DoStatement, EmptyStatement,
    Expression, ExpressionStatement, ForInStatement, ForOfStatement, ForStatement,
    FunctionDeclaration,
    IfStatement, IterationStatement,
    MethodDeclaration, ReturnStatement,
    Statement, SwitchStatement, VariableDeclaration, VariableStatement, WhileStatement, WithStatement
} from "ts-morph";
import {ICfgNode} from "../nodes/ICfgNode";
import {CfgNode} from "../nodes/CfgNode";
import {ScopeCfgNode} from "../nodes/ScopeCfgNode";
import {ForwardCfgNode} from "../nodes/ForwardCfgNode";
import {CFG} from "../CFG";
import {SimpleCfgNode} from "../nodes/SimpleCfgNode";
import {Utils} from "../Utils";
import {IfConditionCfgNode} from "../nodes/IfConditionCfgNode";
import {ForConditionCfgNode} from "../nodes/ForConditionCfgNode";
import {WhileConditionCfgNode} from "../nodes/WhileConditionCfgNode";
import {DoConditionCfgNode} from "../nodes/DoConditionCfgNode";
import {BeginFlagCfgNode} from "../nodes/BeginFlagCfgNode";
import {EndFlagCfgNode} from "../nodes/EndFlagCfgNode";
import {DeclarationStatementCfgNode} from "../nodes/DeclarationStatementCfgNode";
import {factory} from "../../ConfigLog4j";
import {ExpressionStatementCfgNode} from "../nodes/ExpressionStatementCfgNode";
import CodeBlockWriter from "code-block-writer";

export class CFGGeneration implements ICFGGeneration {
    public static logger = factory.getLogger("CFGGeneration");
    public static readonly IF_FLAG : number = 0;

    public static readonly DO_FLAG : number = 1;

    public static readonly WHILE_FLAG : number = 2;

    public static readonly FOR_FLAG : number = 3;

    public static readonly SEPARATE_FOR_INTO_SEVERAL_NODES : number = 1;

    public static readonly DONOT_SEPARATE_FOR : number = 0;

    private _BEGIN: ICfgNode;
    private _END: ICfgNode;
    private _functionNode: FunctionDeclaration;
    generateCFG() : ICFG {
        CFGGeneration.logger.debug("Generating CFG for function: " + this._functionNode.getNameOrThrow());
        return this.parse(this._functionNode);
    };

    private parse(functionNode: FunctionDeclaration): ICFG {
        // this._BEGIN = FlagCfgNode.createBeginFlagCfgNode();
        // this._END = FlagCfgNode.createEndFlagCfgNode();
        this._BEGIN = new BeginFlagCfgNode();
        this._END = new EndFlagCfgNode();
        let body=functionNode.getBody();
        if (body instanceof  Block) {
            let block: Block = body;
            this.visitBlock(block, this._BEGIN, this._END);
        }

        let statementList: ICfgNode[] = [];
        this.linkStatement(this._BEGIN, statementList);
        // for (var i = 0; i < statementList.length ; i++) {
        //     statementList[i].setParent(this.nextConcrete(statementList[i].getParent()));
        // }
        let result:CFG = new CFG(statementList, functionNode);
        result.setRoot(this._BEGIN);
        CFGGeneration.logger.debug("Finished generating CFG! Statement size: " + result.statements.length);
        return result;
    }

    private visitBlock(block: Block, beginNode: ICfgNode, endNode: ICfgNode) {
        let children: Statement[] = block.getStatements();
        if (children.length == 0) {
            beginNode.setBranch(endNode);
            return ;
        }

        let scopeIn: CfgNode = ScopeCfgNode.newOpenScope();
        beginNode.setBranch(scopeIn);
        let scopeOut: CfgNode = ScopeCfgNode.newCloseScope(endNode);

        let points: CfgNode[] = new Array(children.length + 1);
        points[0] = scopeIn;
        points[children.length] = scopeOut;

        for(var i = 1; i<= children.length -1; i++) {
            points[i] = new ForwardCfgNode();
        }

        for(var i = 0; i< children.length; i++) {
            this.visitStatement(children[i], points[i], points[i+1]);
        }

        return null;
    }

    private linkStatement(root: ICfgNode, statements: ICfgNode[]) {
        if (root == null || root.isVisited() == true ) {
            return ;
        }
        root.setVisited(true);
        statements.push(root);
        let tmp: ICfgNode = root.getTrueNode();
        let trueStatement: ICfgNode = this.nextConcrete(tmp);
        root.setTrueNode(trueStatement);
        let falseStatement: ICfgNode = this.nextConcrete(root.getFalseNode());
        root.setFalseNode(falseStatement);

        this.linkStatement(trueStatement, statements);
        this.linkStatement(falseStatement, statements);
    }

    private nextConcrete(stmt : ICfgNode) {
        while (stmt instanceof ForwardCfgNode) {
            let tmp = stmt as ForwardCfgNode;
            stmt = tmp.getTrueNode();
        }
        return stmt;
    }

    private visitStatement(statement: Statement, begin: ICfgNode, end: ICfgNode): void {
        if (statement instanceof IfStatement) {
            let ifStatement = statement as IfStatement;
            let condition : Expression = ifStatement.getExpression();
            if (condition == null) {
                console.log("Condition is null");
            } else {
                let thenStmt: Statement = ifStatement.getThenStatement();
                let elseStmt: Statement = ifStatement.getElseStatement();

                let afterTrue: ForwardCfgNode = new ForwardCfgNode();
                let afterFalse: ForwardCfgNode = new ForwardCfgNode();
                this.visitCondition(condition, begin, afterTrue, afterFalse, CFGGeneration.IF_FLAG);

                this.visitStatement(thenStmt, afterTrue, end);
                this.visitStatement(elseStmt, afterFalse, end);

            }

        } else if (statement instanceof Block ) {
            let block : Block = statement;
            this.visitBlock(block, begin, end)
        } else if (statement == null ) {
            begin.setBranch(end);
        } else if (statement instanceof BreakStatement) {
            console.log("Break Statement Statement");
        } else if (statement instanceof ContinueStatement) {
            console.log("Continue statement");
        } else if (statement instanceof WithStatement) {
            console.log("With Statement");
        } else if (statement instanceof SwitchStatement) {
            let newText = this.convertSwitchStatementToIfStatement(statement);
            console.log("Refactor Switch statement\n", newText);
            let refactorStatement = statement.replaceWithText(newText);
            if (refactorStatement instanceof IfStatement) {
                this.visitStatement(refactorStatement, begin, end);
            } else {
                CFGGeneration.logger.error("Can't detect replaced SwitchStatement as If Statements");
            }
        } else if (statement instanceof CommentStatement) {
            console.log("Comment Statement");
        } else if (statement instanceof IterationStatement) {
            console.log("IterationStatement");
            if (statement instanceof ForStatement) {
                console.log("For statement");
                begin.setBranch(end);
            } else if (statement instanceof ForInStatement) {
                console.log("For in statement");
                begin.setBranch(end);
            } else if (statement instanceof ForOfStatement) {
                console.log("For Of statement");
            } else if (statement instanceof WhileStatement) {
                console.log("While Statement");
            } else if (statement instanceof DoStatement) {
                console.log("Do statement");
            }
        }
        else { //if statement instanceof DeclarationStatement of AssignStatement
            this.visitSimpleStatement(statement, begin, end);
        }
    }

    private visitSimpleStatement(statement: Statement, begin: ICfgNode, end: ICfgNode): void {
        if (statement instanceof VariableStatement ) {
            let simpleCfgNode: DeclarationStatementCfgNode = new DeclarationStatementCfgNode(statement);
            begin.setBranch(simpleCfgNode);
            simpleCfgNode.setBranch(end);
            // console.log("Statetment type", statement.getText());
            simpleCfgNode.setContent(statement.getText())
        } else if (statement instanceof ExpressionStatement) {
            let simpleCfgNode: ExpressionStatementCfgNode = new ExpressionStatementCfgNode(statement);
            begin.setBranch(simpleCfgNode);
            simpleCfgNode.setBranch(end);
            // console.log("Statetment type", statement.getText());
            simpleCfgNode.setContent(statement.getText())
        } else {
            let simpleCfgNode: ExpressionStatementCfgNode = new SimpleCfgNode(statement);
            begin.setBranch(simpleCfgNode);
            simpleCfgNode.setBranch(end);
            // console.log("Statetment type", statement.getText());
            simpleCfgNode.setContent(statement.getText())
        }

        //TODO xử lý lệnh throw, return....
    }

    private visitCondition(condition: Expression, begin: ICfgNode, endTrue: ICfgNode, endFalse: ICfgNode, flag: number): void {
        condition = Utils.shortenASTCondition(condition);
        this.visitShortenCondition(condition, begin, endTrue, endFalse, flag);
    }

    private visitShortenCondition(condition: Expression, begin, endTrue: ICfgNode, endFalse: ICfgNode, flag: number) {
        let conditionCfgNode: ICfgNode = null;
        switch (flag) {
            case CFGGeneration.IF_FLAG:
                conditionCfgNode = new IfConditionCfgNode(condition);
                break;
            case CFGGeneration.FOR_FLAG:
                conditionCfgNode = new ForConditionCfgNode(condition);
                break;
            case CFGGeneration.WHILE_FLAG:
                conditionCfgNode = new WhileConditionCfgNode(condition);
                break;
            case CFGGeneration.DO_FLAG:
                conditionCfgNode = new DoConditionCfgNode(condition);
                break;
        }
        begin.setBranch(conditionCfgNode);
        conditionCfgNode.setTrueNode(endTrue);
        conditionCfgNode.setFalseNode(endFalse);
        conditionCfgNode.setContent(condition.getText())
    }

    convertSwitchStatementToIfStatement(statement: SwitchStatement): string {
        let writer = new CodeBlockWriter();
        let left = statement.getExpression();
        let leftText = left.getText();
        let clauses = statement.getClauses();
        let emptyClause: Array<string> = new Array<string>();

        //Danh dau bieu thuc dieu kien dau tien if ....
        //cac bieu thuc tiep theo la else if
        let firstConditionFlag: number = 0;

        for (var i = 0; i < clauses.length; i++) {
            let cl = clauses[i];
            if (cl instanceof CaseClause) {
                let right = cl.getExpression();
                let rightText = right.getText();
                // emptyClause.push(rightText);
                let caseBlock: Statement[] = cl.getStatements();
                console.log("CASE Clause: " + caseBlock.length);
                if (caseBlock.length === 0) {
                    emptyClause.push(rightText);
                    firstConditionFlag++;
                }
                else {
                    // let newExpressionText = leftText + " === " + rightText;
                    emptyClause.push(rightText);
                    let newExpressionText = "";
                    emptyClause.forEach(r => {
                        newExpressionText+= leftText + " === " + r + " || ";
                    });
                    let lengthExpression = newExpressionText.length;
                    if (newExpressionText.endsWith(" || ")) {
                        newExpressionText = newExpressionText.substring(0, lengthExpression - 4);
                    }
                    emptyClause = new Array<string>();
                    if (i === firstConditionFlag ) {
                        writer.write(`if (${newExpressionText})`).block(()=>{
                            caseBlock.forEach(st => {
                                // CFGGeneration.writeStatement(writer, st);
                                if (st instanceof Block) {
                                    let subStatements = st.getStatements();
                                    subStatements.forEach(sstm => {
                                        CFGGeneration.writeStatement(writer, sstm);
                                    })
                                } else if (st instanceof BreakStatement) {

                                }
                                else {
                                    writer.writeLine(st.getText());
                                }
                            })
                        })
                    } else {
                        writer.write(`else if (${newExpressionText})`).block(()=>{
                            caseBlock.forEach(st => {
                                // CFGGeneration.writeStatement(writer, st);
                                if (st instanceof Block) {
                                    let subStatements = st.getStatements();
                                    subStatements.forEach(sstm => {
                                        CFGGeneration.writeStatement(writer, sstm);
                                    })
                                } else {
                                    writer.writeLine(st.getText());
                                }
                            })
                        })
                    }
                }

            } else if (cl instanceof DefaultClause) {
                let caseBlock: Statement[] = cl.getStatements();
                writer.write(`else`).block(()=>{
                    caseBlock.forEach(st => {
                        // CFGGeneration.writeStatement(writer, st);
                        if (st instanceof Block) {
                            let subStatements = st.getStatements();
                            subStatements.forEach(sstm => {
                                CFGGeneration.writeStatement(writer, sstm);
                            })
                        } else {
                            writer.writeLine(st.getText());
                        }
                    })
                })
            }

        }
        return writer.toString();
    }

    static writeStatement(writer: CodeBlockWriter, statement: Statement) {
        if (statement instanceof Block) {
            let subStatements = statement.getStatements();
            writer.block(() => {
                subStatements.forEach(sstm => {
                    CFGGeneration.writeStatement(writer, sstm);
                })
            })
        } else if (statement instanceof BreakStatement) {

        }
        else {
            writer.writeLine(statement.getText());
        }
    }

    getFunctionNode(): FunctionDeclaration {
        return this._functionNode;
    };

    setFunctionNode(functionNode: FunctionDeclaration) {
        this._functionNode = functionNode;
    };

    constructor(functionNode?: FunctionDeclaration) {
        this._functionNode = functionNode;
    }


}
