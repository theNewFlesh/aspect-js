import { EventBus } from "../vue/event_bus";
import { IVector3 } from "../three/three_tools";
import * as _ from "lodash";
import * as Mousetrap from "mousetrap";
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
    id?: string;
    key?: string;
    value: any;
}

export function to_event(name: string, value: any, row?: object, column?: string): IEvent {
    const fields: string[] = name.split("-");
    const output: IEvent = {
        name: name,
        context: fields[0],
        class: fields[1],
        component: fields[2],
        action: fields[3],
        value: value,
    };
    if (row !== undefined) {
        output["id"] = row["id"];
        if (column !== undefined) {
            output["key"] = row["key_header"] + column;
        }
    }

    return output;
}

export class EventManager {
    constructor(config: object) {
        this.config = config;

        for (const key of _.keys(config["hotkeys"])) {
            const method: string = config["hotkeys"][key];
            Mousetrap.bind(
                key,
                this["__" + method],
            );
        }

        window.addEventListener("mousemove", this.on_mouse_move, false);
        window.addEventListener("mousedown", this.on_mouse_down, false);
        window.addEventListener("mouseup", this.on_mouse_up, false);

        EventBus.$on("dag-width-update", this.on_dag_width_update);
        EventBus.$on("dag-height-update", this.on_dag_width_update);
        EventBus.$on("node_pane-cell-inport-update", this.on_node_pane_cell_inport_update);
    }

    public config: object;
    public _gui_mode: string = "dag_pane";
    public _interaction_mode: string = "highlight";
    public _selection_mode: string = "any";
    public _width: number = 75;
    public _height: number = 100;
    public _area: IVector3[] = [];

    /**
     * Current mouse coordinates. Object with x, y coordinates.
     */
    public _coordinates: IVector3 = { x: 0, y: 0, z: 0 };

    public on_dag_width_update(width: number): void {
        this._width = width;
    }

    public on_dag_height_update(height: number): void {
        this._height = height;
    }

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
        // console.log(event);
    }

    /**
     * Event handler for mouse movements. Assigns mouse coordinates to mouse
     * member.
     * @returns Event handler
     */
    public get on_mouse_move() {
        return function handler(event: any) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this._coordinates.x = (event.clientX / this._width) * 2 - 1;
            this._coordinates.y = -(event.clientY / this._height) * 2 + 1;

            const subevent: ISubEvent = {
                name: "mouse_move",
                value: this._coordinates,
            };
            EventBus.$emit(subevent.name, subevent);
        }.bind(this);
    }

    /**
     * Event handler for mouse left click events.
     * @returns Event handler
     */
    public get on_mouse_down() {
        return function handler(value: any) {
            const event: IEvent = to_event(
                "dag-scene-scene-mouse_down", "mouse_down"
            );
            EventBus.$emit(event.name, event);

            this._area = [_.cloneDeep(this._mouse)];
        }.bind(this);
    }

    /**
     * Event handler for mouse left click release events.
     * @returns Event handler
     */
    public get on_mouse_up() {
        return function handler(value: any) {
            this._area.push(this._mouse);

            const event: IEvent = to_event(
                "dag-scene-scene-mouse_up", "mouse_up"
            );

            EventBus.$emit(event.name, event);
        }.bind(this);
    }
}
