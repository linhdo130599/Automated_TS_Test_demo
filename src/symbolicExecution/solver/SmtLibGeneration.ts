import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";
import {IConstraint} from "../constraints/IConstraint";
import {SpecialCharacters} from "../../utils/SpecialCharacters";
import * as ts from "typescript/lib/tsserverlibrary";
import Types = ts.server.Msg.Types;
import {SymbolicVariable} from "../variables/SymbolicVariable";
import {wrapText} from "../z3convert/Z3Utils";
import {MultipleConstraint} from "../constraints/MultipleConstraint";
import {AbstractZ3Variable} from "../z3convert/AbstractZ3Variable";

export class SmtLibGeneration {
    public static logger: Logger = factory.getLogger("SmtLibGeneration");
    private _constraints: Array<IConstraint>;
    private _smtLib: string = "";
    private _variables: Array<AbstractZ3Variable>;
    static readonly OPTION_TIMEOUT: string = "(set-option :timeout 5000)";
    static readonly SOLVE_COMMAND: string = "(check-sat)\n(get-model)";
    static readonly EMPTY_SMT_LIB_FILE: string = "";

    constructor(constraints: Array<IConstraint>, variables: Array<AbstractZ3Variable>) {
        this._constraints = constraints;
        this._variables = variables;
    }

    generate(): void {
        this._smtLib+= SmtLibGeneration.OPTION_TIMEOUT + SpecialCharacters.LINE_BREAK + this.getDeclarationFun(this._variables);
        if (this._constraints.length == 0) {
            this._smtLib = SmtLibGeneration.EMPTY_SMT_LIB_FILE;
            return ;
        } else {
            this._constraints.forEach(item => {
                let constraintInZ3 = item.toZ3Text();
                if (constraintInZ3.startsWith("(") && constraintInZ3.endsWith(")")) {
                    this._smtLib += "(assert " + "(not " + constraintInZ3 + "))" + SpecialCharacters.LINE_BREAK;
                } else {
                    this._smtLib += "(assert " + wrapText(constraintInZ3) + ")" + SpecialCharacters.LINE_BREAK;
                }

            });
        }

        this._smtLib += SmtLibGeneration.SOLVE_COMMAND;
        SmtLibGeneration.logger.info("SmtLib command:\n" + this._smtLib);
    }

    getDeclarationFun(variables: Array<AbstractZ3Variable>): string {
        let result: string = "";
        variables.forEach(item => {
            let type = item.type;
            if (type === "number") {
                result += "(declare-fun " + SymbolicVariable.PREFIX_SYMBOLIC_VALUE + item.newName + " () Int)" + SpecialCharacters.LINE_BREAK;
            }
            else if (type === "boolean") {
                result += "(declare-fun " + SymbolicVariable.PREFIX_SYMBOLIC_VALUE + item.newName + " () Bool)" + SpecialCharacters.LINE_BREAK;
            }
            else if (type === "string") {
                result += "(declare-fun " + SymbolicVariable.PREFIX_SYMBOLIC_VALUE + item.newName + " () String)" + SpecialCharacters.LINE_BREAK;
            }
            else {
                SmtLibGeneration.logger.error("Dont support variable type: " + type);
            }
        });

        return result;
    }

    getSmtLib(): string {
        return this._smtLib;
    }

    setSmtLib(value: string) {
        this._smtLib = value;
    }
}
