import * as _ from "lodash";
import { ISubEvent, IEvent } from "./event_manager";
import { EventBus } from "../vue/event_bus";
import { DAG } from "../three/dag";
import { to_event } from "./event_manager";
import { IVector3 } from "../three/three_tools";
// -----------------------------------------------------------------------------

export class Mouse {
    public constructor(dag: DAG) {
        this.__dag = dag;
    }

    private __dag: DAG;

    public _mode: string = "normal";

    public _area: IVector3[] = [];

    /**
     * Current mouse coordinates. Object with x, y coordinates.
     */
    public _coordinates: IVector3 = {x: 0, y: 0, z: 0};

    /**
     * Event handler for mouse movements. Assigns mouse coordinates to mouse
     * member.
     * @returns Event handler
     */
    public get on_mouse_move() {
        return function (event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this._coordinates.x = (event.clientX / this.__dag._width) * 2 - 1;
            this._coordinates.y = -(event.clientY / this.__dag._height) * 2 + 1;

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

            this._mode = "left_click";
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
            console.log(this._area);

            const event: IEvent = to_event(
                "dag-scene-scene-mouse_up", "mouse_up"
            );

            this._mode = "normal";
            EventBus.$emit(event.name, event);
        }.bind(this);
    }
}