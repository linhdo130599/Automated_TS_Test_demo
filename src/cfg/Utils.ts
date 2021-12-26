import {
    BinaryExpression,
    Expression,
    ParenthesizedExpression,
    PrefixUnaryExpression
} from "ts-morph";

export class Utils {
    public static shortenASTCondition(expression: Expression): Expression {
        let tmp : Expression = expression;
        if (tmp instanceof ParenthesizedExpression) {
            tmp = this.shortenParenthesizedExpression(tmp);
        }
        if (tmp instanceof BinaryExpression) {
            // console.log("Binary expression", tmp.getText());
            return tmp;
        } else if (tmp instanceof PrefixUnaryExpression) {
            console.log("Prefix Unary Expression", tmp.getText());
            return tmp;
        }
        return tmp;
    }

    public static shortenParenthesizedExpression(expression: Expression): Expression {
        while (expression instanceof ParenthesizedExpression) {
            let tmp : ParenthesizedExpression = expression;
            expression = tmp.getExpression();
        }
        return expression;
    }
}