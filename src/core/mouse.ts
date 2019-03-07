import * as _ from "lodash";
import { ISubEvent } from "./event_manager";
import { EventBus } from "../vue/event_bus";
import * as THREE from "three";
import { DAG } from "../three/dag";
// -----------------------------------------------------------------------------

export class Mouse {
    public constructor(dag: DAG) {
        this.__dag = dag;
    }

    private __dag: DAG;

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
}