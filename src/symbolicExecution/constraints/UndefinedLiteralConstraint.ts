import {Constraint} from "./Constraint";
import {Z3Keyword} from "../z3convert/Z3Keyword";

export class UndefinedLiteralConstraint extends Constraint{
    toZ3Text(): string {
        return Z3Keyword.NULL;
    }

}
