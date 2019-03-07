import * as _ from "lodash";
import { ISubEvent } from "./event_manager";
import { EventBus } from "../vue/event_bus";
import * as THREE from "three";
import { DAG } from "../three/dag";
import { to_event } from "./event_manager";
// -----------------------------------------------------------------------------

export class Mouse {
    public constructor(dag: DAG) {
        this.__dag = dag;
    }

    private __dag: DAG;

    public _mode: string = "normal";

    /**
     * Current mouse coordinates. Object with x, y coordinates.
     */
    public _coordinates: THREE.Vector2 = new THREE.Vector2(0, 0)

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

            const ids: string[] = this.__dag.get_selected_ids();
            if (ids.length > 0) {
                const subevent: ISubEvent = {
                    name: "dag_scene_scene_mouse_move",
                    value: ids
                };
                EventBus.$emit(subevent.name, subevent);
            }
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
            this._highlight_box = [_.cloneDeep(this._mouse)];
        }.bind(this);
    }

    /**
     * Event handler for mouse left click release events.
     * @returns Event handler
     */
    public get on_mouse_up() {
        return function handler(value: any) {
            this._highlight_box.push(this._mouse);
            console.log(this._highlight_box);

            const event: IEvent = to_event(
                "dag-scene-scene-mouse_up", "mouse_up"
            );

            this._mode = "normal";
            EventBus.$emit(event.name, event);
        }.bind(this);
    }
}