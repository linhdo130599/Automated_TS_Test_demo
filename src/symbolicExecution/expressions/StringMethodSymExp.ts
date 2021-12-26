import {SymbolicExpression} from "./SymbolicExpression";
import {wrapText} from "../z3convert/Z3Utils";
import {Logger} from "typescript-logging";
import {factory} from "../../ConfigLog4j";

export class StringMethodSymExp extends SymbolicExpression {
    public static logger: Logger = factory.getLogger("StringMethodSymExp");
    private _methodName: string;
    private _identifier: SymbolicExpression;
    private _paramters: Array<SymbolicExpression>;


    constructor(methodName: string, identifier: SymbolicExpression, paramters: Array<SymbolicExpression>) {
        super();
        this._methodName = methodName;
        this._identifier = identifier;
        this._paramters = paramters;
    }


    toZ3Text(): string {
        switch (this._methodName) {
            case "startsWith": {
                let argumentName = this._paramters[0].toZ3Text();
                let normalizedCode = "str.prefixof "+ argumentName + " " + this._identifier.toZ3Text();
                return wrapText(normalizedCode);
            }
            case "endsWith": {
                let argumentName = this._paramters[0].toZ3Text();
                let normalizedCode = "str.suffixof "+ argumentName + " " + this._identifier.toZ3Text();
                return wrapText(normalizedCode);
            }
            case "includes": {
                let argumentName = this._paramters[0].toZ3Text();
                let normalizedCode = "str.contains "+ this._identifier.toZ3Text() + " " +  argumentName;
                return wrapText(normalizedCode);
            }

            case "substring": {
                let startArgumentName = this._paramters[0].toZ3Text();
                let endArgumentName = this._paramters[1].toZ3Text();
                let lengthArgumentName = "(- " + endArgumentName  + " " + startArgumentName + ")";
                let normalizedCode = "str.substr "+ this._identifier.toZ3Text() +" "+ startArgumentName + " " + lengthArgumentName ;
                return wrapText(normalizedCode);

            }

            case "indexOf": {
                let subArgumentName = this._paramters[0].toZ3Text();
                let offsetArgumentName = this._paramters[1];


                if (offsetArgumentName == null) {

                    let normalizedCode2 = "str.indexof "+ this._identifier.toZ3Text() +" "+ subArgumentName ;
                    return wrapText(normalizedCode2);}
               else {
                    let normalizedCode1 = "str.indexof "+ this._identifier.toZ3Text() +" "+ subArgumentName + " " + offsetArgumentName.toZ3Text() ;

                    return wrapText(normalizedCode1);}
            }

            case "charAt": {
                let offsetArgumentName = this._paramters[0].toZ3Text();
                let normalizedCode = "str.at " + this._identifier.toZ3Text() + " " + offsetArgumentName;
                return wrapText(normalizedCode);
            }

            default:
                StringMethodSymExp.logger.error("Dont support string method: " + this._methodName);

        }
    }

    isNull(): boolean {
        return this._identifier.isNull();
    }

    getType(): string {
        switch (this._methodName) {
            case "includes":
            case "startsWith":
            case "indexof":
            case "substring":
            case "endsWith":{
                return "boolean";
            }
            default: {
                return "string";
            }
        }
    }


    getMethodName(): string {
        return this._methodName;
    }

    setMethodName(value: string) {
        this._methodName = value;
    }

    getIdentifier(): SymbolicExpression {
        return this._identifier;
    }

    setIdentifier(value: SymbolicExpression) {
        this._identifier = value;
    }

    getParamters(): Array<SymbolicExpression> {
        return this._paramters;
    }

    setParamters(value: Array<SymbolicExpression>) {
        this._paramters = value;
    }
}
