import { Group } from "./group";

export class Graph extends Group {
    public link(parent: any): void {
        parent._item.add(this._item);
        this._parent = parent;
    }
}
