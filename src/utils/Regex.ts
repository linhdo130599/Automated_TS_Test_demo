export class Regex {
    public static readonly OPEN_BRACKET="\\[";
    public static readonly CLOSE_BRACKET="\\]";
    public static readonly EXPRESSION_IN_BRACKET= Regex.OPEN_BRACKET + "([\\(\\)\\s0-9\\.\\+\\-\\*\\/]+)" + Regex.CLOSE_BRACKET;
    public static readonly SPACE_REGEX : string= "\\s";
    public static readonly INTEGER_NUMBER_REGEX : string= "[\\+\\-\\d][\\d]*";

}