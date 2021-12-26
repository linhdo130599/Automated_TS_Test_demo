import {Logger} from "typescript-logging";
import * as fs from "fs";
import {spawnSync, execSync, exec, spawn} from "child_process";
import * as util from "util";
import {factory} from "../../ConfigLog4j";
import {SymbolicExecution} from "../SymbolicExecution";
import {ConstraintSolver} from "./ConstraintSolver";
const exec2 = util.promisify(exec);

export class RunZ3OnCMD {
    public static logger: Logger = factory.getLogger("RunZ3OnCMD");
    private _Z3Path: string;
    private _smtLibPath: string;
    private _result: string;


    constructor(Z3Path: string, smtLibPath: string) {
        this._Z3Path = Z3Path;
        this._smtLibPath = smtLibPath;
    }

    public execute() {
        if (this._Z3Path == null || this._smtLibPath == null) {
            throw new Error("Z3Path or smtLib file null.");
        }
        let contentSmtLib : string= "";
        fs.readFile(this._smtLibPath, (err, data)=>{
            contentSmtLib= data.toString();
            RunZ3OnCMD.logger.info("Read SMT Lib file doned!");
        })
        let result: string = "";
        if (contentSmtLib.includes(ConstraintSolver.NO_SOLUTION_CONSTRAINT_SMTLIB)) {
            result = ConstraintSolver.UNSAT_IN_Z3;
        } else {
            let commandLine: string = "";
            if (process.platform === "win32"){
                let commands: string[] = [this._Z3Path, "-smt2", this._smtLibPath];
                commandLine = commands.join(" ");
                // commandLine = "\"" + this._Z3Path + "\"" + " -smt2 " + "\"" + this._smtLibPath + "\"";

            } else if (process.platform === "linux") {
                if (this._smtLibPath.includes(" ")) {
                    throw new Error("SmtLibPath must not contain space charater: " + this._smtLibPath);
                } else {
                    commandLine = "z3 -smt2 " + this._smtLibPath;
                }
            } else {
                // RunZ3OnCMD.logger.error("Dont support this OS: "+ process.platform);
                throw new Error("Don't support this OS: " + process.platform);
            }

            let startTime = new Date();
            try {
                let runZ3 = spawnSync(this._Z3Path,["-smt2", this._smtLibPath]);
                this._result = runZ3.stdout.toString();
                RunZ3OnCMD.logger.info("Z3 Result:\n" + this._result);
            } catch (e) {
                RunZ3OnCMD.logger.error(e.getMessages());
            }
            let endTime = new Date();
            let totalTime = endTime.getTime() - startTime.getTime();
            RunZ3OnCMD.logger.info("Total solving time: " + totalTime + "ms");
        }
    }

    getZ3Path(): string {
        return this._Z3Path;
    }

    setZ3Path(value: string) {
        this._Z3Path = value;
    }

    getSmtLibPath(): string {
        return this._smtLibPath;
    }

    setSmtLibPath(value: string) {
        this._smtLibPath = value;
    }

    getResult(): string {
        return this._result;
    }

    setResult(value: string) {
        this._result = value;
    }

    getSolution(): string {
        return this._result;
    }
}
