export class AbstractZ3Variable {
    public newName: string;
    public type: string;
    public oldName: string;

    constructor(name: string, type: string, oldName: string) {
        this.newName = name;
        this.type = type;
        this.oldName = oldName;
    }
}
