import { Group } from "./group";

export class Graph extends Group {
    public link(component: any): void {
        component._item.add(this._item);
        this._parent = component._item;
    }
}
