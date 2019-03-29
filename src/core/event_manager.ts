import { EventBus } from "../vue/event_bus";
import { IVector3 } from "../three/three_tools";
import * as _ from "lodash";
import * as Mousetrap from "mousetrap";
// -----------------------------------------------------------------------------

/**
 * Subevent interface for internal use of EventManager
 */
export interface ISubEvent {
    name: string;
    value: any;
}

/**
 * Event interface for decomoposing event names into usefull context fields
 */
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

/**
 * Converts an event name into IEvent object
 * @param name Name of event
 * @param value Value of event
 * @param row NodePane row object
 * @param column NodePane column object
 * @returns IEvent object
 */
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

/**
 * Class for managing all aspect-js events.
 * 
 * EventManager receives a config object which map user keyboard and mouse
 * events to event handlers. EventManages also has maintains state on various
 * modes of interaction:
 * - gui_mode: mouse position over GUI areas
 * - interaction_mode: types of selection such as area and deselect
 * - selection_mode: for selecting different DAG components
 */
export class EventManager {
    constructor(config: object) {
        this.config = config;
        const interactions: object = config["interactions"];

        for (const itype of _.keys(interactions)) {
            for (const key of _.keys(interactions[itype])) {
                const method: string = "on_" + interactions[itype][key];
                if (typeof this[method] === "function") {
                    Mousetrap.bind(
                        key,
                        this[method].bind(this),
                        itype
                    );
                }
            }
        }

        window.addEventListener("mousemove", this.on_mouse_move, false);
        window.addEventListener("mousedown", this.on_mouse_down, false);
        window.addEventListener("mouseup", this.on_mouse_up, false);

        EventBus.$on("vertical-pane-separator-update", this.on_vertical_pane_separator_update);
        EventBus.$on("node_pane-cell-inport-update", this.on_node_pane_cell_inport_update);
    }

    /**
     * Keyboard/mouse event -> event handler configuration
     */
    public config: object;

    /**
     * Mode representing what main GUI element a user's mouse if hovering over
     * Options include: dag_pane, node_pane and search_pane
     */
    public _gui_mode: string = "dag_pane";

    /**
     * Mode representation of a users intended interations with a DAG component
     * Options include: highlight, select, deselect, select_area and deselect_area
     */
    public _interaction_mode: string = "highlight";

    /**
     * Mode for selecting different DAG components
     * Options include: any, graph, node and edge
     */
    public _selection_mode: string = "any";

    /**
     * Vertical pane separator position (separating DagPane from NodePane) as a
     * percentage of app width from left to right
     */
    public _vertical_pane_separator: number = 75;

    /**
     * Pair of IVector3 objects representing a 3D rectilnear prism of DAG
     * component selection
     */
    public _selection_area: IVector3[] = [];

    /**
     * Current mouse coordinates. Object with x, y coordinates.
     */
    public _coordinates: IVector3 = { x: 0, y: 0, z: 0 };

    /**
     * Event handler for changes to the vertical pane separator
     * @param width percentage of app width from left to right
     */
    public on_vertical_pane_separator_update(width: number): void {
        this._vertical_pane_separator = width;
    }

    /**
     * Converts IEvent object to EventManager event handler method
     * @param event IEvent object
     * @return Referebce to EventManager method
     */
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

    /**
     * Generic event handler method which looks up an event handler using with
     * a given event and then calls that handler with the event
     * @param event IEvent to be used
     */
    public on_event(event: IEvent): void {
        const handler: any = this._lookup_handler(event);
        handler(event);
    }

    public on_node_pane_cell_inport_update(event: IEvent): void {
    }

    public _create_mouse_event_name(event_type: string): string {
        return [
            this._gui_mode,
            this._selection_mode,
            this._interaction_mode,
            event_type,
        ].join("_");
    }
    // -------------------------------------------------------------------------

    public on_set_selection_mode(event: IEvent): void {
        this._selection_mode = event.value;
    }

    public on_set_selection_mode_any(): void {
        this._selection_mode = "any";
    }

    public on_set_selection_mode_graph(): void {
        this._selection_mode = "graph";
    }

    public on_set_selection_mode_node(): void {
        this._selection_mode = "node";
    }

    public on_set_selection_mode_edge(): void {
        this._selection_mode = "edge";
    }
    // -------------------------------------------------------------------------

    public on_set_interaction_mode(event: IEvent): void {
        this._interaction_mode = event.value;
    }

    public on_set_interaction_mode_highlight(): void {
        this._interaction_mode = "highlight";
    }

    public on_set_interaction_mode_select(): void {
        this._interaction_mode = "select";
    }

    public on_set_interaction_mode_deselect(): void {
        this._interaction_mode = "deselect";
    }

    public on_set_interaction_mode_select_area(): void {
        this._interaction_mode = "select_area";
    }

    public on_set_interaction_mode_deselect_area(): void {
        this._interaction_mode = "deselect_area";
    }
    // -------------------------------------------------------------------------

    /**
     * Event handler for mouse movements. Assigns mouse coordinates to mouse
     * member.
     * @returns Event handler
     */
    public get on_mouse_move() {
        return function handler(event: any) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this._coordinates.x = (event.clientX / window.outerWidth) * 2 - 1;
            this._coordinates.y = -(event.clientY / window.outerHeight) * 2 + 1;

            if (this._interaction_mode === "select_area") {
                this._selection_area = [
                    _.cloneDeep(this._selection_area[0]),
                    _.cloneDeep(this._coordinates)
                ];
            }

            const sep: number = (this._vertical_pane_separator / 100) * 2 - 1;
            if (this._gui_mode !== "search_pane") {
                if (this._coordinates.x < sep) {
                    this._gui_mode = "dag_pane";
                }
                else {
                    this._gui_mode = "node_pane";
                }
            }

            const subevent: ISubEvent = {
                name: this._create_mouse_event_name("mouse_move"),
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
            this._selection_area = [
                _.cloneDeep(this._coordinates),
                _.cloneDeep(this._coordinates)
            ];

            const subevent: ISubEvent = {
                name: this._create_mouse_event_name("mouse_down"),
                value: this._coordinates,
            };
            EventBus.$emit(subevent.name, subevent);
        }.bind(this);
    }

    /**
     * Event handler for mouse left click release events.
     * @returns Event handler
     */
    public get on_mouse_up() {
        return function handler(value: any) {
            this._selection_area = [
                _.cloneDeep(this._selection_area[0]),
                _.cloneDeep(this._coordinates)
            ];

            const subevent: ISubEvent = {
                name: this._create_mouse_event_name("mouse_up"),
                value: this._coordinates,
            };
            EventBus.$emit(subevent.name, subevent);
        }.bind(this);
    }
}
