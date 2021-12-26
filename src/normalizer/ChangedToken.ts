export class ChangedToken {
    private _oldText: string;
    private _newText: string;


    constructor(oldText: string, newText: string) {
        this._oldText = oldText;
        this._newText = newText;
    }

    getOldText(): string {
        return this._oldText;
    }

    setOldText(value: string) {
        this._oldText = value;
    }

    getNewText(): string {
        return this._newText;
    }

    setNewText(value: string) {
        this._newText = value;
    }
}
