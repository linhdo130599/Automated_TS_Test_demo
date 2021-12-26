import {
    BinaryExpression,
    ExpressionStatement,
    FunctionDeclaration,
    Identifier,
    LiteralExpression,
    Project,
    SourceFile
} from "ts-morph";
import {getCfgByName} from "../testHelper";
import {expect} from "chai";
import {IfConditionCfgNode} from "../../cfg/nodes/IfConditionCfgNode";
import {ExpressionStatementCfgNode} from "../../cfg/nodes/ExpressionStatementCfgNode";
import {DeclarationStatementCfgNode} from "../../cfg/nodes/DeclarationStatementCfgNode";
import {BeginFlagCfgNode} from "../../cfg/nodes/BeginFlagCfgNode";
import {ScopeCfgNode} from "../../cfg/nodes/ScopeCfgNode";
import {TestpathGeneration} from "../../cfg/generation/testpath/TestpathGeneration";
import {ConstraintSolver} from "../../symbolicExecution/solver/ConstraintSolver";

describe("Generate Cfg tests", () => {
    //TODO xu ly lenh khai bao
    it("Should contain derlarationCfgNode corresponding to declaration statement", () => {
        const cfg = getCfgByName("declare_new_variable_test");
        const  statement0 = cfg.getAllNodes()[0];
        const  statement1 = cfg.getAllNodes()[1];
        const  statement2 = cfg.getAllNodes()[2];
        const  statement3 = cfg.getAllNodes()[3];
        const  statement5 = cfg.getAllNodes()[5];

        expect(statement0 instanceof BeginFlagCfgNode).to.be.equal(true);
        expect(statement1 instanceof ScopeCfgNode).to.be.equal(true);
        expect(statement2 instanceof DeclarationStatementCfgNode).to.be.equal(true);
        expect(statement5 instanceof IfConditionCfgNode).to.be.equal(true);
        const statement6 = statement5.getTrueNode();
        expect(statement6 instanceof ScopeCfgNode).to.be.equal(true);
        const statement7 = statement6.getTrueNode();
        expect(statement7 instanceof IfConditionCfgNode).to.be.equal(true);
    });

    it("Should contain assignmentCfgNode corresponding to assignment expression ", () => {
        const cfg = getCfgByName("update_variable_test1");
        const  assignExpression = cfg.getAllNodes()[2] as ExpressionStatementCfgNode;
        expect(assignExpression instanceof ExpressionStatementCfgNode).to.equal(true);
        const expressionAst = assignExpression.getStatement();
        expect(expressionAst instanceof ExpressionStatement).to.equal(true);
    });

    it("Should convert SwitchStatement to IfStatement ", () => {
        const cfg = getCfgByName("switch_statement_test");
        const  ifStatement = cfg.getAllNodes()[2] as IfConditionCfgNode;
        expect(ifStatement instanceof IfConditionCfgNode).to.equal(true);
        const content = ifStatement.getContent();
        expect(content.includes("s.length === 1")).to.equal(true);
    });

    it("Should handle grouped clauses in SwitchStatement ", () => {
        const cfg = getCfgByName("switch_statement_test_2");
        const  ifStatement = cfg.getAllNodes()[2] as IfConditionCfgNode;
        expect(ifStatement instanceof IfConditionCfgNode).to.equal(true);
        const content = ifStatement.getContent();
        expect(content.includes("-a === 0 || -a === -1 || -a === 1")).to.equal(true);
    });

    it("Should handle IndexOfStringMethod ", () => {
        const cfg = getCfgByName("test_method_string_indexof2");
        expect(cfg.getAllNodes().length).to.equal(15);
        let testpathGen0 = new TestpathGeneration(cfg);
        testpathGen0.generateTestpaths();
        let testpaths0 = testpathGen0.getPossibleTestpaths();
        let randomTestpath0 = testpaths0[0];
        let parameters0 = cfg.getFunctionNode().getParameters();
        let testcase0 = ConstraintSolver.solve(randomTestpath0);
        expect(testcase0.includes("xxxabcdexxxabcabc") && testcase0.includes("abcdex")).to.equal(true);
        let testpathGen1 = new TestpathGeneration(cfg);
        testpathGen1.generateTestpaths();
        let testpaths1 = testpathGen1.getPossibleTestpaths();
        let randomTestpath1 = testpaths1[1];
        let parameters1 = cfg.getFunctionNode().getParameters();
        let testcase1 = ConstraintSolver.solve(randomTestpath1);
        expect(testcase1.includes("xxxabcde") && testcase1.includes("abcdex")).to.equal(true);
    });

    it("Should handle SubstringMethod ", () => {
        const cfg = getCfgByName("test_method_string_substringh2");
        expect(cfg.getAllNodes().length).to.equal(9);
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        expect(testcase.includes("abc")).to.equal(true);
    });

});
