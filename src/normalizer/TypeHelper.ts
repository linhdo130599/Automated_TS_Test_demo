export class TypeHelper {
    public static readonly OBJECT_TYPE=0;
    public static readonly NUMBER_LITERAL_TYPE: number = 1;
    public static readonly STRING_LITERAL_TYPE: number = 2;
    public static readonly BOOLEAN_LITERAL_TYPE: number = 3;
    public static readonly NUMBER_OBJECT_TYPE: number = 4;
    public static readonly STRING_OBJECT_TYPE: number = 5;
    public static readonly BOOLEAN_OBJECT_TYPE: number = 6;
    public static readonly ANY_TYPE: number = 7;

    static checkType(type: string): number {
        switch (type) {
            case "number": {
                return TypeHelper.NUMBER_LITERAL_TYPE;
            }
            case "string":
                return TypeHelper.STRING_LITERAL_TYPE;
            case "boolean":
                return TypeHelper.BOOLEAN_LITERAL_TYPE;
            case "Number":
                return TypeHelper.NUMBER_OBJECT_TYPE;
            case "String":
                return TypeHelper.STRING_OBJECT_TYPE;
            case "Boolean":
                return TypeHelper.BOOLEAN_OBJECT_TYPE;
            case "any":
                return TypeHelper.ANY_TYPE;
            default:
                return TypeHelper.OBJECT_TYPE;
        }
    }

}
