import * as _ from "lodash";
import uuidv4 from "uuid/v4";
import { Params } from "../core/params";
import { DAG } from "./dag";
import { OrderedDict } from "../core/tools";
import { Scaffold } from "../core/scaffold";
// -----------------------------------------------------------------------------

interface IScheduleRow {
    id: string;
    type: string;
    mode: string;
    param_state: string;
    three_state: string;
    command: string;
    order: string;
    dependencies: string[];
}

export class Scheduler {
    public constructor(state: Params, schedule: IScheduleRow[] = []) {
        this.__state = state;
        this.__schedule = schedule;
    }

    private __state: Params;
    private __schedule: IScheduleRow[];

    private static __command_lut = {
        "delete_absent_absent":   "ignore",
        "delete_absent_present":  "delete",
        "delete_present_present": "delete",
        "delete_present_absent":  "ignore",
        "edit_absent_absent":     "create",
        "edit_absent_present":    "update",
        "edit_present_present":   "update",
        "edit_present_absent":    "create",
    };

    private static __order_lut: object = {
          "scene": 0,
          "graph": 1,
           "node": 2,
         "inport": 3,
        "outport": 4,
           "edge": 5,
    };

    public print(): void {
        new Scaffold().from_array(this.__schedule).print();
    }

    public to_state_and_schedule(): any[] {
        return [this.__state, this.__schedule];
    }

    public to_schedule(): object[] {
        return this.__schedule;
    }

    public to_state(): Params {
        return this.__state;
    }

    public edit(fragment: object, dag: DAG): Scheduler {
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

    public delete(fragment: object, dag: DAG): Scheduler {
        fragment = new Params(fragment).resolve_ids().to_object();
        const next: Params = this.__state.subtract(fragment, true);

        const lut: OrderedDict = new OrderedDict({}, []);
        for (const edge of this.__state.to_edges()) {
            if (edge["source/id"] !== undefined) {
                lut[edge["source/id"]] = edge["id"];
            }
            if (edge["destination/id"] !== undefined) {
                lut[edge["destination/id"]] = edge["id"];
            }
        }

        let ids: string[] = new Params(fragment).to_ids();
        for (const id of _.clone(ids)) {
            if (lut.has(id)) {
                for (const i of lut[id]) {
                    ids.push(i);
                }
            }
        }
        ids = _.uniq(ids);

        let data: IScheduleRow[] = _.clone(this.__schedule);
        for (const id of ids) {
            data.push(this._get_row(id, "delete", next, dag));
        }

        data = new Scaffold()
            .from_array(data)
            .sort_by(x => x, "order", true)
            .to_array();
        return new Scheduler(next, data);
    }

    public _get_row(id: string, mode: string, next: Params, dag: DAG): IScheduleRow {
        const param_state: string = this.__state.has_component(id) ? "present" : "absent";
        const three_state: string = dag.has_child(id) ? "present" : "absent";
        const key: string = [mode, param_state, three_state].join("_");
        const type: string = _.split(id, "_")[0];

        const row: IScheduleRow = {
            id: id,
            type: type,
            mode: mode,
            param_state: param_state,
            three_state: three_state,
            command: Scheduler.__command_lut[key],
            order: Scheduler.__order_lut[type],
            dependencies: next.get_dependencies(id, false),
        };
        return row;
    }

    public _add_edges_for_nodes(fragment: object, next: Params): Params {
        const params: Params = new Params(fragment);
        for (const inport of params.to_inports()) {
            const id: string = inport["id"];
            const pid: string = params.get_parent_id(id);

            const key: any = params.to_key_header(pid);
            if (key !== null) {
                const edge: object = {};
                const eid: string = "edge_" + uuidv4();
                edge[key + eid + "/id"] = eid;
                edge[key + eid + "/source/id"] = id;
                edge[key + eid + "/destination/id"] = pid;
                next = next.update(edge);
            }
        }

        for (const outport of params.to_outports()) {
            const id: string = outport["id"];
            const pid: string = params.get_parent_id(id);

            const key: any = params.to_key_header(pid);
            if (key !== null) {
                const edge: object = {};
                const eid: string = "edge_" + uuidv4();
                edge[key + eid + "/id"] = eid;
                edge[key + eid + "/source/id"] = pid;
                edge[key + eid + "/destination/id"] = id;
                next = next.update(edge);
            }
        }

        return next;
    }
}
