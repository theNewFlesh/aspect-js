import { EventBus } from "./event_bus";
// -----------------------------------------------------------------------------

export interface ISubEvent {
    name: string;
    value: any;
}

export interface IEvent {
    name: string;
    context: string;
    class: string;
    component: string;
    action: string;
    id: string;
    key: string;
    value: any;
}

export function to_event(name: string, value: any, row: object, column: string): IEvent {
    const fields: string[] = name.split("-");
    const output: IEvent = {
        name: name,
        context: fields[0],
        class: fields[1],
        component: fields[2],
        action: fields[3],
        id: row["id"],
        key: row["key_header"] + column,
        value: value,
    };
    return output;
}

export class EventManager {
    constructor(config: object) {
        this.config = config;

        EventBus.$on(
            "node_pane-cell-inport-update",
            this.on_node_pane_cell_inport_update
        );

        EventBus.$on(
            "dag_scene_scene_mouse_move",
            this.on_dag_scene_scene_mouse_move
        );
    }

    public config: object;

    public _lookup_handler(event: IEvent): string {
        let key: string = [
            "on",
            event.context,
            event.class,
            event.component,
            event.action
        ].join("_");
        key = this.config[key];
        return this[key];
    }

    public on_event(event: IEvent): void {
        const handler: any = this._lookup_handler(event);
        handler(event);
    }

    public on_node_pane_cell_inport_update(event: IEvent): void {
        console.log(event);
    }

    public on_dag_scene_scene_mouse_move(event: IEvent): void {
        console.log(event);
    }
}
