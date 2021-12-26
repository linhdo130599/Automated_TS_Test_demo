import {getCfgByName} from "../testHelper";
import {TestpathGeneration} from "../../cfg/generation/testpath/TestpathGeneration";
import {expect} from "chai";
import {DeclarationStatementCfgNode} from "../../cfg/nodes/DeclarationStatementCfgNode";
import {IConstraint} from "../../symbolicExecution/constraints/IConstraint";
import {TestscriptGeneration} from "../../testscriptgen/TestscriptGeneration";
import {ConstraintSolver} from "../../symbolicExecution/solver/ConstraintSolver";

describe("Collect Constraints tests", () => {
    //TODO xu ly lenh khai bao
    it("Should have  DeclarationStatementCfgNode in testpath", () => {
        const cfg = getCfgByName("assign_to_json_object_test");
        let testpathGen = new TestpathGeneration(cfg);
        testpathGen.generateTestpaths();
        let testpaths = testpathGen.getPossibleTestpaths();
        let randomTestpath = testpaths[0];
        let solverResult = ConstraintSolver.solveNewVersion(randomTestpath);
        let testcase = solverResult.getTestcaseText();
        let usedVariables = solverResult.getVariables();
        console.log(testcase);
        let inputData = TestscriptGeneration.parseInputDataToArray(testcase, randomTestpath.getFunctionNode(), usedVariables);
        TestscriptGeneration.generateTestscriptForSingleDemo(randomTestpath.getFunctionNode(), [inputData]);

        // console.log(jsonParameter);
    });
});
