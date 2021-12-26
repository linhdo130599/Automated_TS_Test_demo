import {CfgNode} from "./CfgNode";
import {ICfgNode} from "./ICfgNode";
import {factory} from "../../ConfigLog4j";

export class ScopeCfgNode extends CfgNode{
    public static logger = factory.getLogger("ScopeCfgNode");

    public static readonly OPEN_SCOPE: string = "{";
    public static readonly CLOSE_SCOPE: string = "}";

    constructor(content: string) {
        super(content);
    }

    public static newOpenScope(...branch: Array<ICfgNode>): ScopeCfgNode {
        let openScope: ScopeCfgNode = new ScopeCfgNode(this.OPEN_SCOPE);
        if (branch.length == 1) {
            openScope.setBranch(branch[0]);
        } else if (branch.length > 1) {
            ScopeCfgNode.logger.error("next brand of openScope greater than 1! this value must <= 1");
        }
        return openScope;
    }

    public static newCloseScope(...branch: Array<ICfgNode>): ScopeCfgNode {
        let closeScope: ScopeCfgNode = new ScopeCfgNode(this.CLOSE_SCOPE)
        if (branch.length == 1) {
            closeScope.setBranch(branch[0]);
        } else if (branch.length > 1) {
            throw Error("next brand of closeScope greater than 1! this value must <= 1");
        }
        return closeScope;
    }
}
