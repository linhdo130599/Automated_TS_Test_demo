import { ITestpathGeneration } from "./ITestpathGeneration";
import { CFG } from "../../CFG";
import { Testpath } from "./Testpath";
import { factory } from "../../../ConfigLog4j";
import { ICfgNode } from "../../nodes/ICfgNode";
import { ITestpath } from "./ITestpath";
import { Direction, FlagCondition } from "./FlagCondition";
import { FlagCfgNode } from "../../nodes/FlagCfgNode";
import { IfConditionCfgNode } from "../../nodes/IfConditionCfgNode";
import { ConditionCfgNode } from "../../nodes/ConditionCfgNode";
import { ICFG } from "../../ICFG";
import { ConditionPath } from "../../../autotest/RunAutoTest";

import { Constraint } from "../../../symbolicExecution/constraints/Constraint";
// import {SymbolicExecution} from "../../../symbolicExecution/SymbolicExecution";
import { ParameterDeclaration } from "ts-morph";
import { IConstraint } from "../../../symbolicExecution/constraints/IConstraint";
import { SymbolicExecution } from "../../../symbolicExecution/SymbolicExecution";

export class TestpathGenerationConfig {
    public static readonly maxIterationsforEachLoop = 1;
}
export class TestpathGeneration implements ITestpathGeneration {
    public static logger = factory.getLogger("TestpathGeneration");
    private _cfg: ICFG;
    private _testpaths: Array<Testpath>;
    private _config: TestpathGenerationConfig;
    private _logTestPaths : Array<Testpath>;


    constructor(cfg: ICFG, config?: TestpathGenerationConfig) {
        this._cfg = cfg;
        this._config = config;
    }

    generateTestpaths(): void {
        TestpathGeneration.logger.info("Start colecting testpaths")
        let startTime = new Date();
        let testpaths: Array<Testpath> = new Array();
        let beginNode: ICfgNode = this._cfg.getBeginNode();
        let initialTestpath: Testpath = new Testpath();
        initialTestpath.setFunctionNode(this._cfg.getFunctionNode());
        // this.traverseCFG(beginNode, initialTestpath, testpaths);
        this.traverseCFG(beginNode, initialTestpath, testpaths, new Array<FlagCondition>());

        for (var i = 0; i < testpaths.length; i++) {
            let tmp: ITestpath = testpaths[i];
            tmp.setFunctionNode(this._cfg.getFunctionNode());
        }


        this._testpaths = testpaths;

        let logTestPaths:Array<Testpath> = [];
        this._logTestPaths = logTestPaths;

        for (let indexTestPaths = 0 ; indexTestPaths <testpaths.length ; indexTestPaths++){
            for (let indexFlagTestPaths = 0 ; indexFlagTestPaths< testpaths[indexTestPaths].getFlags().length ; indexFlagTestPaths++){
                if (testpaths[indexTestPaths].getFlags()[indexFlagTestPaths].getFlag() == ConditionPath.getInstance()[indexFlagTestPaths]) {
                    if (indexFlagTestPaths === (testpaths[indexTestPaths].getFlags().length-1))
                        logTestPaths.push(testpaths[indexTestPaths]);
                } else {
                    break
                }
            }
        }


        let endTime = new Date();
        let totalTime = endTime.getTime() - startTime.getTime();
        TestpathGeneration.logger.info("Finished collecting! Total running time: " + totalTime + " ms");
        TestpathGeneration.logger.debug("Number of possible testpaths: " + testpaths.length);
        TestpathGeneration.logger.debug(`Number of possible testpaths for condication ${ConditionPath.getInstance().toString()}: ` + logTestPaths.length);
        console.log(ConditionPath.getInstance())




    }

    traverseCFG(stmt: ICfgNode, testpath: ITestpath, testpathList: Array<ITestpath>, flags: Array<FlagCondition>, conditionPath?: Array<FlagCondition>) {
        testpath.push(stmt);
        if (FlagCfgNode.isEndNode(stmt)) {
            let copyTestpath = new Testpath();
            let copyFlags = new Array<FlagCondition>();
            testpath.getElements().forEach((node) => {
                copyTestpath.push(node);
            });
            if (conditionPath === undefined) {
                flags.forEach((flag) => {
                    copyFlags.push(flag);


                });
                copyTestpath.setFlags(copyFlags);
                testpathList.push(copyTestpath);
                testpath.pop();
            } else {
                for (let index = 0; index < flags.length; index++) {
                    if (flags[index] == conditionPath[index])
                        copyFlags.push(flags[index]);
                    else {
                        testpath.pop();
                        return;
                    }

                }
                copyTestpath.setFlags(copyFlags);
                testpathList.push(copyTestpath);
                testpath.pop();
            }
            // flags.pop();
        } else {
            let trueNode: ICfgNode = stmt.getTrueNode();
            let falseNode: ICfgNode = stmt.getFalseNode();

            if (stmt instanceof ConditionCfgNode) {
                if (stmt instanceof IfConditionCfgNode) {
                    // let trueFlag = new FlagCondition(stmt, FlagCondition.TRUE);
                    let trueFlag = new FlagCondition(stmt, Direction.TRUE);
                    flags.push(trueFlag);
                    this.traverseCFG(trueNode, testpath, testpathList, flags, conditionPath);
                    flags.pop();
                    // let falseFlag = new FlagCondition(stmt, FlagCondition.FALSE);
                    let falseFlag = new FlagCondition(stmt, Direction.FALSE);
                    // let newFlags = Object.assign([], flags);
                    flags.push(falseFlag);
                    this.traverseCFG(falseNode, testpath, testpathList, flags, conditionPath);
                    flags.pop();

                } else {
                    console.log("Chua xu ly loop condition");
                }

            } else {
                this.traverseCFG(trueNode, testpath, testpathList, flags, conditionPath);
            }
            testpath.pop();
        }
    }

    // static solve(testpath: ITestpath): Array<IConstraint> {
    //     let se = new SymbolicExecution(testpath);
    //     se.symbolize();
    //     return se.getConstraints();
    //     // return null;
    // }


    getCurrentTestpaths(): Array<ITestpath>{
        return this._logTestPaths;
    }


    getPossibleTestpaths(): Array<ITestpath> {
        return this._testpaths;
    }


    getCfg(): ICFG {
        return this._cfg;
    }

    setCfg(value: ICFG) {
        this._cfg = value;
    }

    getTestpaths(): Array<Testpath> {
        return this._testpaths;
    }

    setTestpaths(value: Array<Testpath>) {
        this._testpaths = value;
    }

    getConfig(): TestpathGenerationConfig {
        return this._config;
    }

    setConfig(value: TestpathGenerationConfig) {
        this._config = value;
    }
}
