import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";
import {ConstraintSolver} from "./ConstraintSolver";
import {SymbolicVariable} from "../variables/SymbolicVariable";

export type Variable = {name: string, value: string}
export class Z3SolutionParser {

    public static logeer: Logger = factory.getLogger("Z3SolutionParser");
    public static readonly NO_SOLUTION = "";
    public static readonly KHAI_BAO = "define-fun";
    public static readonly IF_THEN_ELSE = "ite";
    public static readonly END = ")";
    public static readonly MODEL = "model";
    public static readonly SAT = "sat";
    public static readonly UNSAT = "unsat";
    public static readonly UNKNOWN = "unknown";
    public static readonly KHAI_BAO_ID: number = 0;
    public static readonly MODEL_ID: number = -1;
    public static readonly IF_THEN_ELSE_ID = 1;
    public static readonly VALUE_ID = 2;
    public static readonly END_ID = 3
    public static readonly SAT_ID = 4;
    public static readonly UNSAT_ID = 5;
    public static readonly UNKNOWN_ID = 6;
    public static readonly ERROR = 7;
    private _solution: string = "";
    private _variables: Array<Variable>= new Array<Variable>();

    parse(z3Result: string) : string {
        let solution: string = "";
        if (z3Result.includes(ConstraintSolver.UNSAT_IN_Z3)) {

        }
        else {
            const lines: string [] = z3Result.split("\r\n");
            let name: string = "";
            let value: string = "";
            let type: string = "";
            let ignoreEndline = false;
            lines.forEach(line =>{
                switch (this.getTypeOfLine(line)) {
                    case Z3SolutionParser.KHAI_BAO_ID: {
                        ignoreEndline = false;
                        let nameAndType = this.getNameAndType(line);
                        name = nameAndType.name;
                        type = nameAndType.type;
                        break;
                    }
                    case Z3SolutionParser.IF_THEN_ELSE_ID: {
                        Z3SolutionParser.logeer.error("Chua xu ly if then else trong ket qua tra ve cua z3");
                        break;
                    }
                    case Z3SolutionParser.VALUE_ID: {
                        if (!ignoreEndline) {
                            value = this.getValueOfVariable(line);
                            let valueSimplify = eval(value);
                            // if (type === "String") value = "\"" + value + "\"";

                            if (type === "String") {
                                value = value.replace(new RegExp("\\\\x(\\w{2})","g"), "x");
                            }
                            else value = valueSimplify;
                            solution += name + "=" + value + ",";
                            this._variables.push({name: name, value: value});

                        }
                        break;
                    }

                    case Z3SolutionParser.ERROR:
                    case Z3SolutionParser.UNKNOWN_ID: {
                        break;
                    }
                }
            })
            //XOa dau , o cuoi
            if (solution.lastIndexOf(",") > 0) {
                solution = solution.substring(0, solution.lastIndexOf(","));
            }
            // Restore solution to its original format
            solution = solution.replace(new RegExp(SymbolicVariable.PREFIX_SYMBOLIC_VALUE, "g"), "")
                .replace(new RegExp(SymbolicVariable.SEPARATOR_BETWEEN_STRUCTURE_NAME_AND_ITS_ATTRIBUTES,"g"), ".")
                .replace(new RegExp(SymbolicVariable.ARRAY_CLOSING,"g"), "]")
                .replace(new RegExp(SymbolicVariable.ARRAY_OPENING,"g"), "[")
                .replace(new RegExp(SymbolicVariable.PARAM_OPENING,"g"), "(")
                .replace(new RegExp(SymbolicVariable.PARAM_CLOSING,"g"), ")")
                .replace( new RegExp(",","g"), ";");

            if (solution.length > 0 && !solution.endsWith(";"))
                solution += ";";
        }

        return solution;
    }

    getNameAndType(defuncLine: string ) : {name: string, type: string} {
        let nameFunction: string = "";
        let type: string = "";
        // let regex = new RegExp("\\(define-fun\\s(\\w+)");
        let regex = new RegExp("\\(define-fun\\s(\\w+)\\s\\(\\)\\s(\\w+)");
        let match = defuncLine.match(regex);
        if (match) {
            nameFunction = match[1];
            type = match[2];
        }

        return {name: nameFunction, type: type};
    }

    getValueOfVariable(line: string) : string {
        let value: string = "";
        let DEVIDE: string = "/";
        let NEGATIVE: string = "-";
        /*
         * Ex: (/ 1.0 10000.0))
         */
        if (line.includes(DEVIDE) && !line.includes(NEGATIVE)) {
            let start: number = line.indexOf("(") + 1;
            let end: number = line.indexOf(")");
            let reducedLine: string = line.substring(start, end);

            let elements : string[]= reducedLine.split(" ");
            if (elements.length >= 3)
                value = elements[1] + elements[0] + elements[2];

        } else
        /*
         * Ex: (- (/ 9981.0 10000.0))
         */
        if (line.includes(DEVIDE) && line.includes(NEGATIVE)) {
            let start: number = line.lastIndexOf("(") + 1;
            let end: number = line.indexOf(")");
            let reducedLine: string = line.substring(start, end);

            let elements: string[] = reducedLine.split(" ");
            if (elements.length >= 3)
                value = NEGATIVE + "(" + elements[1] + elements[0] + elements[2] + ")";

        } else {

            // let regex = new RegExp("(.*)\\)");
            let regex = new RegExp("\\s+(.*)\\)");
            let match = line.match(regex);
            if (match) {
                // value = match[1].replace(new RegExp("\\s", "g"), "");
                value = match[1];

            }
        }
        return value;
    }

    getTypeOfLine(line: string): number {
        if (line.includes(Z3SolutionParser.KHAI_BAO))
            return Z3SolutionParser.KHAI_BAO_ID;

        else if (line.includes(Z3SolutionParser.IF_THEN_ELSE))
            return Z3SolutionParser.IF_THEN_ELSE_ID;

        else if (line.includes(Z3SolutionParser.MODEL))
            return Z3SolutionParser.MODEL_ID;

        else if (line === Z3SolutionParser.END)
            return Z3SolutionParser.END_ID;

        else if (line === Z3SolutionParser.SAT)
            return Z3SolutionParser.SAT_ID;

        else if (line === Z3SolutionParser.UNSAT)
            return Z3SolutionParser.UNSAT_ID;

        else if (line === Z3SolutionParser.UNKNOWN)
            return Z3SolutionParser.UNKNOWN_ID;

        else if (line.startsWith("(error") || line.length == 0)
            return Z3SolutionParser.ERROR;
        return Z3SolutionParser.VALUE_ID;
    }


    getSolution(): string {
        return this._solution;
    }

    setSolution(value: string) {
        this._solution = value;
    }

    getVariables(): Array<Variable> {
        return this._variables;
    }

    setVariables(value: Array<Variable>) {
        this._variables = value;
    }
}
