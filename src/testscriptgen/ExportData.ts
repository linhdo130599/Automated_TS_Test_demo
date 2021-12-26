import {
    CallExpression, ElementAccessExpression,
    Expression,
    FunctionDeclaration,
    Identifier,
    MethodDeclaration,
    PropertyAccessExpression,
    Type
} from "ts-morph";

export class ExportData {
    private _usedTypes: Map<string, Type> = new Map<string, Type>();
    private _functions: Map<string, FunctionDeclaration> = new Map<string, FunctionDeclaration>();
    private _staticMethods: Map<string, MethodDeclaration> = new Map<string, MethodDeclaration>();
    private _usedExternalExpression: Map<string,Expression> = new Map<string, Expression>();

    constructor(usedTypes?: Map<string, Type>, functions?: Map<string, FunctionDeclaration>, staticMethods?: Map<string, MethodDeclaration>) {
        this._usedTypes = usedTypes;
        this._functions = functions;
        this._staticMethods = staticMethods;
    }

    getUsedTypes(): Map<string, Type> {
        return this._usedTypes;
    }

    setUsedTypes(value: Map<string, Type>) {
        this._usedTypes = value;
    }

    getFunctions(): Map<string, FunctionDeclaration> {
        return this._functions;
    }

    setFunctions(value: Map<string, FunctionDeclaration>) {
        this._functions = value;
    }

    getStaticMethods(): Map<string, MethodDeclaration> {
        return this._staticMethods;
    }

    setStaticMethods(value: Map<string, MethodDeclaration>) {
        this._staticMethods = value;
    }


    getUsedExternalExpression(): Map<string, Expression> {
        return this._usedExternalExpression;
    }

    setUsedExternalExpression(value: Map<string, Expression>) {
        this._usedExternalExpression = value;
    }

    addNewType(qualifierPath: string, type: Type): void {
        if (this._usedTypes) this._usedTypes.set(qualifierPath, type);
        else {
            this._usedTypes = new Map<string, Type>();
            this._usedTypes.set(qualifierPath, type);
        }
    }

    addNewFunction(qualifierPath: string, externalFunction: FunctionDeclaration): void {
        if (this._functions) this._functions.set(qualifierPath, externalFunction);
        else {
            this._functions = new Map<string, FunctionDeclaration>();
            this._functions.set(qualifierPath, externalFunction);
        }
    }

    addNewStaticMethod(qualifierPath: string, staicMethod: MethodDeclaration): void {
        if (this._staticMethods) this._staticMethods.set(qualifierPath, staicMethod);
        else {
            this._staticMethods = new Map<string, MethodDeclaration>();
            this._staticMethods.set(qualifierPath, staicMethod);
        }
    }

    addNewExpression(startIndex: number, expression: Expression): void {
        if (this._usedExternalExpression) this._usedExternalExpression.set(String(startIndex),expression);
        else {
            this._usedExternalExpression = new Map<string, Expression>()
            this._usedExternalExpression.set(String(startIndex), expression);
        }
    }

    static getFirstIdentifier(expression: Expression): Identifier {
        if (expression instanceof Identifier) return expression;
        else if (expression instanceof PropertyAccessExpression) {
            let subExpression = expression.getExpression();
            return this.getFirstIdentifier(subExpression);
        } else if (expression instanceof CallExpression) {
            let propertyAccessExpression = expression.getExpression();
            return this.getFirstIdentifier(propertyAccessExpression);
        } else if (expression instanceof ElementAccessExpression) {
            let subExpression = expression.getExpression();
            return this.getFirstIdentifier(subExpression)
        }
    }

    getFirstIdentifierOfAllExpression(): Array<Identifier> {
        let array = new Array<Identifier>();
        this._usedExternalExpression.forEach(value => {
            array.push(ExportData.getFirstIdentifier(value));
        });
        return array;
    }
}
