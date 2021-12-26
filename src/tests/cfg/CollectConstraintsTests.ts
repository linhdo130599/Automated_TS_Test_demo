import {getCfgByName} from "../testHelper";
import {expect} from "chai";
import {ExpressionStatementCfgNode} from "../../cfg/nodes/ExpressionStatementCfgNode";
import {DeclarationStatementCfgNode} from "../../cfg/nodes/DeclarationStatementCfgNode";
import {TestpathGeneration} from "../../cfg/generation/testpath/TestpathGeneration";
import {IConstraint} from "../../symbolicExecution/constraints/IConstraint";
import {ConstraintSolver} from "../../symbolicExecution/solver/ConstraintSolver";

describe("Collect Constraints tests", () => {
    //TODO xu ly lenh khai bao
    it("Should have  DeclarationStatementCfgNode in testpath", () => {
        const cfg = getCfgByName("declare_new_variable_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        expect(testpaths.length).to.be.equal(3);
        expect(testpaths[0].getElements()[2] instanceof DeclarationStatementCfgNode).to.be.equal(true);
        expect(testpaths[0].getElements()[3] instanceof DeclarationStatementCfgNode).to.be.equal(true);
        expect(testpaths[0].getElements()[4] instanceof DeclarationStatementCfgNode).to.be.equal(true);
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        // console.log(constraints);
    });

    it("Should have ExpressionStatement nodes in testpath", () => {
        const cfg = getCfgByName("update_variable_test1");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        expect(testpaths.length).to.be.equal(3);
        expect(testpaths[0].getElements()[2] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        expect(testpaths[0].getElements()[3] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        expect(testpaths[0].getElements()[4] instanceof DeclarationStatementCfgNode).to.be.equal(true);
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
    });

    it("Should handle multiple assignment expression", () => {
        const cfg = getCfgByName("update_variable_test4");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        // expect(testpaths.length).to.be.equal(3);
        // expect(testpaths[0].getElements()[2] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[3] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[4] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        // let constraints: Array<IConstraint> = TestpathGeneration.solve(parameters, randomTestpath);
        // console.log(constraints);
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle multiple assignment expression contains array element access, object access", () => {
        const cfg = getCfgByName("multiple_assignment");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        // expect(testpaths.length).to.be.equal(3);
        // expect(testpaths[0].getElements()[2] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[3] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[4] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        // let constraints: Array<IConstraint> = TestpathGeneration.solve(parameters, randomTestpath);
        // console.log(constraints);
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle object parameter", () => {
        const cfg = getCfgByName("caculate");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        // expect(testpaths.length).to.be.equal(3);
        // expect(testpaths[0].getElements()[2] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[3] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        // expect(testpaths[0].getElements()[4] instanceof ExpressionStatementCfgNode).to.be.equal(true);
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        // let constraints: Array<IConstraint> = TestpathGeneration.solve(parameters, randomTestpath);
        // console.log(constraints);
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle length string property access constraints", () => {
        const cfg = getCfgByName("caculate3");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle assign to json object", () => {
        const cfg = getCfgByName("assign_to_json_object_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle getter method to get new variable", () => {
        const cfg = getCfgByName("call_getter_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle assign to object literal expression", () => {
        const cfg = getCfgByName("object_literal_expresion_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });

    it("Should handle external functionCall", () => {
        const cfg = getCfgByName("external_method_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let parameters = cfg.getFunctionNode().getParameters();
        let testcase = ConstraintSolver.solve(randomTestpath);
        console.log(testcase);
    });
});
