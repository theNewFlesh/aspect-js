import * as _ from "lodash";
import uuidv4 from "uuid/v4";
import { Params } from "../core/params";
import { DAG } from "./dag";
import { Scaffold } from "../core/scaffold";
import * as tools from "../core/tools";
// -----------------------------------------------------------------------------

/**
 * Interface for a single row within a schedule
 */
interface IScheduleRow {
    id: string;
    type: string;
    mode: string;
    param_state: string;
    three_state: string;
    state_diff: boolean;
    command: string;
    order: string;
    dependencies: string[];
}

/**
 * The scheduler is responsible for building a table which fully defines the
 * transformations to the scene required to make it correctly mirror the scene
 * state specified by the given params.
 */
export class Scheduler {
    /**
     * @param state Desired scene state
     * @param schedule Array of IScheduleRows if one exists
     */
    public constructor(state: Params, schedule: IScheduleRow[] = []) {
        this.__state = state;
        this.__schedule = schedule;
    }

    /**
     * Desired scene state
     */
    private __state: Params;

    /**
     * Table of IScheduleRows used for defining scene transformations
     */
    private __schedule: IScheduleRow[];

    /**
     * Look up table that maps:
     * <pre>
     * +------------------------+
     * | mode,                  |
     * | param_state,           |
     * | three_state,           | --> command
     * | diff of current state  |
     * | and desired state      |
     * +------------------------+
     * </pre>
     */
    private static __command_lut = {
        "delete_absent_absent_true": "ignore",
        "delete_absent_present_true": "delete",
        "delete_present_present_true": "delete",
        "delete_present_absent_true": "ignore",
        "edit_absent_absent_true": "create",
        "edit_absent_present_true": "update",
        "edit_present_present_true": "update",
        "edit_present_absent_true": "create",
        "delete_absent_absent_false": "ignore",
        "delete_absent_present_false": "ignore",
        "delete_present_present_false": "ignore",
        "delete_present_absent_false": "ignore",
        "edit_absent_absent_false": "ignore",
        "edit_absent_present_false": "ignore",
        "edit_present_present_false": "ignore",
        "edit_present_absent_false": "ignore",
    };

    /**
     * Order in which component actions are carried out.
     * Edge must be at bottom because it depends on components above.
     */
    private static __order_lut: object = {
        "scene": 0,
        "graph": 1,
        "node": 2,
        "inport": 3,
        "outport": 4,
        "edge": 5,
    };

    /**
     * Prints schedule to console
     */
    public print(): void {
        new Scaffold().from_array(this.__schedule).print();
    }

    /**
     * Returns schedule table
     */
    public to_schedule(): object[] {
        return this.__schedule;
    }

    /**
     * Return desired state
     */
    public to_state(): Params {
        return this.__state;
    }

    /**
     * Adds or updates components of DAG with fragment.
     * Short circuits if fragment is empty.
     * @param fragment Fragment used to edit scene
     * @param dag DAG instance
     * @returns Scheduler which contains correct transformations
     */
    public edit(fragment: object, dag: DAG): Scheduler {
        if (tools.is_empty(fragment)) {
            return this;
        }

        fragment = new Params(fragment).resolve_ids().to_object();
        let next: Params = this.__state.update(fragment);
        next = this._add_edges_for_nodes(fragment, next);

        let data: IScheduleRow[] = _.clone(this.__schedule);
        for (const id of next.to_ids()) {
            data.push(this._get_row(id, "edit", next, dag));
        }

        data = new Scaffold()
            .from_array(data)
            .sort_by(x => x, "order", true)
            .to_array();
        return new Scheduler(next, data);
    }

    /**
     * Deletes components found within given fragment
     * @param fragment Fragment containing components
     * @param dag Dag instance
     */
    public delete(fragment: object, dag: DAG): Scheduler {
        if (tools.is_empty(fragment)) {
            return this;
        }

        // get desired state component ids
        const temp_ids: string[] = new Params(fragment)
            .resolve_ids()
            .to_ids();

        // ensure all ids exist
        this.__state.ids_exist(temp_ids);

        // create current state fragment with only component ids
        let frag: object = {};
        frag = this.__state
            .filter_components(temp_ids, true)
            .drop_non_ids()
            .to_object();

        // create a lut: (ports/nodes) -> (connected edges) for current state
        const lut: object = {};
        for (const edge of this.__state.to_edges()) {
            const sid: string = edge["source/id"];
            if (sid !== undefined) {
                if (!lut.hasOwnProperty(sid)) {
                    lut[sid] = [];
                }
                lut[sid].push(edge["id"]);
            }

            const did: string = edge["destination/id"];
            if (did !== undefined) {
                if (!lut.hasOwnProperty(did)) {
                    lut[did] = [];
                }
                lut[did].push(edge["id"]);
            }
        }

        // get ids from current state frag
        let ids: string[] = new Params(frag).to_ids();
        ids = this.__state
            .filter_components(ids, true)
            .to_ids();

        // iterate through current state ids and add their connected edges if
        // found in lut
        for (const id of _.clone(ids)) {
            if (lut.hasOwnProperty(id)) {
                for (const i of lut[id]) {
                    ids.push(i);
                }
            }
        }

        // create new current state fragment from new unique set of ids
        ids = _.uniq(ids);
        frag = this.__state
            .filter_ids(ids)
            .drop_non_ids()
            .to_object();

        // subtract fragment from current state to create next state
        const next: Params = this.__state.subtract(frag, false);

        // add a delete row for each component id
        let data: IScheduleRow[] = _.clone(this.__schedule);
        for (const id of ids) {
            data.push(this._get_row(id, "delete", next, dag));
        }

        // create schedule table
        data = new Scaffold()
            .from_array(data)
            .sort_by(x => x, "order", true)
            .to_array();
        return new Scheduler(next, data);
    }

    /**
     * Remove rows with "ignore" commands
     * @returns Scheduler without ignore rows
     */
    public remove_ignores(): Scheduler {
        const data: IScheduleRow[] = new Scaffold()
            .from_array(this.__schedule)
            .drop(x => x === "ignore", "command")
            .to_array();
        return new Scheduler(this.__state, data);
    }

    /**
     * Creates a row for a component
     * @param id Component id
     * @param mode "edit" or "delete"
     * @param next Next state fully defined
     * @param dag DAG instance
     */
    public _get_row(id: string, mode: string, next: Params, dag: DAG): IScheduleRow {
        // does component exists within current params?
        const param_state: string = this.__state.has_component(id) ? "present" : "absent";

        // does a component instance exist for this id?
        const three_state: string = dag.has_child(id) ? "present" : "absent";

        // does the component differ in each state?
        const state_diff: boolean = tools.different(
            dag._state.to_component(id), next.to_component(id)
        );

        // build a key for the command lut
        const key: string = [mode, param_state, three_state, String(state_diff)].join("_");

        // get component type for order lut
        const type: string = _.split(id, "_")[0];

        // create row
        // hand in key to get command
        // hand in type to get order
        const row: IScheduleRow = {
            id: id,
            type: type,
            mode: mode,
            param_state: param_state,
            three_state: three_state,
            state_diff: state_diff,
            command: Scheduler.__command_lut[key],
            order: Scheduler.__order_lut[type],
            dependencies: next.get_dependencies(id, false),
        };
        return row;
    }

    /**
     * Create edges which connect a node to its ports
     * @param fragment Fragment with fuly defined node (includes ports)
     * @param next Desired state
     * @returns New desired state with added node edges
     */
    public _add_edges_for_nodes(fragment: object, next: Params): Params {
        const params: Params = new Params(fragment);
        const inports: object[] = params.to_inports(["both", "node"]);
        for (const inport of inports) {
            const id: string = inport["id"];

            // get node
            const pid: string = params.get_parent_id(id);

            // find node header key "/scene_id/graph_id/node_id/"
            const key: any = params.to_key_header(pid);

            if (key !== null) {
                // create edge object with inport as source and node as destination
                const edge: object = {};
                const eid: string = "edge_" + uuidv4();
                edge[key + eid + "/id"] = eid;
                edge[key + eid + "/source/id"] = id;
                edge[key + eid + "/destination/id"] = pid;

                // add edge to next state
                next = next.update(edge);
            }
        }

        // same thing for outports
        for (const outport of params.to_outports()) {
            const id: string = outport["id"];
            const pid: string = params.get_parent_id(id);

            const key: any = params.to_key_header(pid);
            if (key !== null) {
                // create an edge object with node as the source and outport as
                // the destination
                const edge: object = {};
                const eid: string = "edge_" + uuidv4();
                edge[key + eid + "/id"] = eid;
                edge[key + eid + "/source/id"] = pid;
                edge[key + eid + "/destination/id"] = id;

                // add outport to desired state
                next = next.update(edge);
            }
        }

        return next;
    }
}
