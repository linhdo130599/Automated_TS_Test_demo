import {getCfgByName} from "../testHelper";
import {expect} from "chai";
import {ExpressionStatementCfgNode} from "../../cfg/nodes/ExpressionStatementCfgNode";
import {DeclarationStatementCfgNode} from "../../cfg/nodes/DeclarationStatementCfgNode";
import {TestpathGeneration} from "../../cfg/generation/testpath/TestpathGeneration";

describe("Collect testpaths tests", () => {
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
    });
});
