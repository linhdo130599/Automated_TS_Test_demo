import {ParameterDeclaration} from "ts-morph";
import {ITestpath} from "../../cfg/generation/testpath/ITestpath";
import {SymbolicExecution} from "../SymbolicExecution";
import {SmtLibGeneration} from "./SmtLibGeneration";
import {Utils} from "../../utils/Utils";
import * as path from "path";
import {RunZ3OnCMD} from "./RunZ3OnCMD";
import {Z3SolutionParser} from "./Z3SolutionParser";
import {SolverResult} from "./SolverResult";

export class ConstraintSolver {
    public static readonly NO_SOLUTION = "";
    public static readonly EVERY_SOLUTION = " ";
    public static readonly UNSAT_IN_Z3: string = "unsat";
    public static readonly NO_SOLUTION_CONSTRAINT_SMTLIB: string = "(false)";
    static solve( testpath: ITestpath): string {
        let se = new SymbolicExecution(testpath);
        se.symbolize();
        let constraints = se.getConstraints();
        if (constraints.length > 0 ) {
            let smtLibGen = new SmtLibGeneration(se.getConstraints(), se.getZ3InputVariable());
            smtLibGen.generate();
            Utils.writeToFile(smtLibGen.getSmtLib(), process.env.CONSTRAINS_FILE);

            let commandLineRunner: RunZ3OnCMD = new RunZ3OnCMD(process.env.Z3, process.env.CONSTRAINS_FILE);
            commandLineRunner.execute();
            let solutionParser: Z3SolutionParser = new Z3SolutionParser();
            let staticSolution = solutionParser.parse(commandLineRunner.getSolution());

            if (staticSolution === ConstraintSolver.NO_SOLUTION) {
                return ConstraintSolver.NO_SOLUTION;
            } else {
                //a=1;b=2 =>  a=1; b=2; c!= null
                //TODO add null or not null constraint
                return staticSolution;
            }
        } else {
            return ConstraintSolver.NO_SOLUTION;
        }
    }

    static solveNewVersion( testpath: ITestpath): SolverResult {
        let se = new SymbolicExecution(testpath);
        se.symbolize();
        let constraints = se.getConstraints();
        if (constraints.length > 0 ) {
            let smtLibGen = new SmtLibGeneration(se.getConstraints(), se.getZ3InputVariable());
            smtLibGen.generate();
            console.log(process.env.CONSTRAINS_FILE);
            Utils.writeToFile(smtLibGen.getSmtLib(), process.env.CONSTRAINS_FILE);

            let commandLineRunner: RunZ3OnCMD = new RunZ3OnCMD(process.env.Z3, process.env.CONSTRAINS_FILE);
            commandLineRunner.execute();
            let solutionParser: Z3SolutionParser = new Z3SolutionParser();
            let staticSolution = solutionParser.parse(commandLineRunner.getSolution());

            if (staticSolution === ConstraintSolver.NO_SOLUTION) {
                return new SolverResult(ConstraintSolver.NO_SOLUTION, se.getZ3InputVariable());
            } else {
                //a=1;b=2 =>  a=1; b=2; c!= null
                //TODO add null or not null constraint
                return new SolverResult(staticSolution, se.getZ3InputVariable());
            }
        } else {
            return new SolverResult(ConstraintSolver.NO_SOLUTION, se.getZ3InputVariable());
        }
    }
}
