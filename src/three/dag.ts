import * as _ from "lodash";
import * as three_tools from "./three_tools";
import * as tools from "../core/tools";
import * as test_tools from "../../test/test_tools";
import * as test_scene from "../../test/test_scene";
import * as THREE from "three";
import uuidv4 from "uuid/v4";
import { Scene } from "./scene";
import { Graph } from "./graph";
import { Edge } from "./edge";
import { Node } from "./node";
import { Inport } from "./inport";
import { Outport } from "./outport";
import { Params } from "../core/params";
import { Scaffold } from "../core/scaffold";
import { IPortParams, INodeParams, IEdgeParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class DAG {
    public get THREE() { return THREE; }
    public get three_tools() { return three_tools; }
    public get test_tools() { return test_tools; }
    public get test_scene() { return test_scene.scene; }
    public get tools() { return tools; }
    public get scaffold() { return Scaffold; }
    public get params() { return Params; }

    public _id: string;
    public _state: Params = new Params({});
    public parent: any;
    public _children: object = {};
    public three_item: any;
    // -------------------------------------------------------------------------

    public has_child(id: string): boolean {
        return this._children.hasOwnProperty(id);
    }

    public get_child(id: string): any {
        if (!this.has_child(id)) {
            throw new Error(`id: ${id} child does not exist`);
        }
        return this._children[id];
    }

    public set_child(key: string, value: any): void {
        this._children[key] = value;
    }

    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this.get_child(pid);
    }

    public _resolve_port_translation(node: INodeParams, port: IPortParams): object {
        const output: object = {
            "translate/x": node["translate/x"] + port["translate/x"],
            "translate/y": node["translate/y"] + port["translate/y"],
            "translate/z": node["translate/z"] + port["translate/z"],
        };
        return output;
    }

    public _resolve_edge_params(
        params: Params,
        edge_params: object,
        source_id: string,
        destination_id: string
    ): IEdgeParams {

        let src: object = this.get_child(source_id).read();
        if (src["type"] === "node") {
            src = {
                "translate/x": 0,
                "translate/y": 0,
                "translate/z": 0,
            };
        }
        else if (src["type"] === "outport") {
            if (!this.has_child(source_id)) {
                throw new Error(`child does not exist. id: ${source_id}`);
            }
            src = this._resolve_port_translation(
                this._get_parent(params, source_id).read(),
                this.get_child(source_id).read(),
            );
        }

        let dst: object = this.get_child(destination_id).read();
        if (dst["type"] === "node") {
            dst = {
                "translate/x": 0,
                "translate/y": 0,
                "translate/z": 0,
            };
        }
        else if (dst["type"] === "inport") {
            if (!this.has_child(destination_id)) {
                throw new Error(`child does not exist. id: ${destination_id}`);
            }
            dst = this._resolve_port_translation(
                this._get_parent(params, destination_id).read(),
                this.get_child(destination_id).read(),
            );
        }

        const output: IEdgeParams = {
            "id":                      edge_params["id"],
            "source/id":               source_id,
            "source/translate/x":      src["translate/x"],
            "source/translate/y":      src["translate/y"],
            "source/translate/z":      src["translate/z"],
            "destination/id":          destination_id,
            "destination/translate/x": dst["translate/x"],
            "destination/translate/y": dst["translate/y"],
            "destination/translate/z": dst["translate/z"],
        };
        for (const key of _.keys(edge_params)) {
            if (!output.hasOwnProperty(key)) {
                output[key] = edge_params[key];
            }
        }
        return output;
    }
    // -------------------------------------------------------------------------

    public _create_scene(params: Params, id: string): void {
        const item: object = params.to_scene(id);
        this.three_item = new THREE.Scene();
        const scene: Scene = new Scene(this.three_item);
        scene.create(item, this);
        this.set_child(id, scene);
        this.parent = scene;
        this._id = id;
    }

    public _update_scene(params: Params, id: string): void {
        this.get_child(id).update(params.to_scene(id));
    }
    // -------------------------------------------------------------------------

    public _create_graph(params: Params, id: string): void {
        const graph: Graph = new Graph(this.three_item);
        graph.create(params.to_graph(id), this.parent);
        this.set_child(id, graph);
    }

    public _update_graph(params: Params, id: string): void {
        this.get_child(id).update(params.to_graph(id));
    }
    // -------------------------------------------------------------------------

    public _create_node(params: Params, id: string): void {
        const parent: any = this._get_parent(params, id);
        const node: Node = new Node(this.three_item);
        node.create(params.to_node(id), parent);
        this.set_child(id, node);
    }

    public _update_node(params: Params, id: string): void {
        this.get_child(id).update(params.to_node(id));
    }
    // -------------------------------------------------------------------------

    public _create_edge(params: Params, id: string): void {
        let item: IEdgeParams = params.to_edge(id);
        item = this._resolve_edge_params(
            params, item, item["source/id"], item["destination/id"]
        );
        const parent: any = this._get_parent(params, id);

        const edge: Edge = new Edge(this.three_item);
        this.set_child(id, edge);
        edge.create(item, parent);
    }

    public _update_edge(params: Params, id: string): void {
        let edge_params: IEdgeParams = this.get_child(id).read();
        Object.assign(edge_params, params.to_edge(id));
        edge_params = this._resolve_edge_params(
            params,
            edge_params,
            edge_params["source/id"],
            edge_params["destination/id"]
        );
        this.get_child(id).update(edge_params);
    }
    // -------------------------------------------------------------------------

    public _create_inport(params: Params, id: string): void {
        const pid: string = params.get_parent_id(id);
        const count: number = params.filter_node(pid, true).to_inports().length;
        const ip: object = params.to_inport(id);

        let x_offset: number = 0;
        if (count > 1) {
            if (count % 2 === 0) {
                x_offset = count / 2.0;
            }
            else {
                x_offset = (count / 2.0) - 0.5;
            }
        }

        const pos: object = {
            "translate/x": ip["order"] - x_offset,
            "translate/y": 2,
        };
        Object.assign(ip, pos);

        const parent: any = this._get_parent(params, id);
        const inport: Inport = new Inport(this.three_item);
        inport.create(ip, parent);
        this.set_child(id, inport);
    }

    public _update_inport(params: Params, id: string): void {
        this.get_child(id).update(params.to_inport(id));
    }
    // -------------------------------------------------------------------------

    public _create_outport(params: Params, id: string): void {
        const pid: string = params.get_parent_id(id);
        const count: number = params.filter_node(pid, true).to_outports().length;
        const op: object = params.to_outport(id);

        let x_offset: number = 0;
        if (count > 1) {
            if (count % 2 === 0) {
                x_offset = count / 2.0;
            }
            else {
                x_offset = (count / 2.0) - 0.5;
            }
        }

        const pos: object = {
            "translate/x": op["order"] - x_offset,
            "translate/y": -2,
        };
        Object.assign(op, pos);

        const parent: any = this._get_parent(params, id);
        const outport: Outport = new Outport(this.three_item);
        outport.create(op, parent);
        this.set_child(id, outport);
    }

    public _update_outport(params: Params, id: string): void {
        this.get_child(id).update(params.to_outport(id));
    }
    // -------------------------------------------------------------------------

    public _get_edge_dependency_lut(): object {
          // create dep_id / edge_id lut
          const edges: object[] = this._state.to_edges();
          const lut: object = {};
          for (const edge of edges) {
              const eid: string = edge["id"];
              const sid: string = edge["source/id"];
              const did: string = edge["destination/id"];
              if (!lut.hasOwnProperty(sid)) {
                  lut[sid] = [];
              }
              if (!lut.hasOwnProperty(did)) {
                  lut[did] = [];
              }
              lut[sid].push(eid);
              lut[did].push(eid);
          }
          return lut;
    }

    public get_schedule(partial_state: object, mode: string): Scaffold {
        if (!["edit", "delete"].includes(mode)) {
            throw new Error(`invalid mode: ${mode}`);
        }

        const command_lut = {
            "delete_absent_absent":   "ignore",
            "delete_absent_present":  "delete",
            "delete_present_present": "delete",
            "delete_present_absent":  "ignore",
            "edit_absent_absent":     "create",
            "edit_absent_present":    "update",
            "edit_present_present":   "update",
            "edit_present_absent":    "create",
        };

        const order_lut: object = {
              "scene": 0,
              "graph": 1,
               "node": 2,
             "inport": 3,
            "outport": 4,
               "edge": 5,
        };

        const temp_ids: string[] = new Params(partial_state).to_ids();
        const edge_dep_lut: object = this._get_edge_dependency_lut();
        let ids: string[] = _.clone(temp_ids);
        for (const id of temp_ids) {
            if (edge_dep_lut.hasOwnProperty(id)) {
                for (const eid of edge_dep_lut[id]) {
                    ids.push(eid);
                }
            }
        }
        ids = _.uniq(ids);

        const schedule: object[] = [];
        for (const id of ids) {
            const row: object = {
                id: id,
                type: _.split(id, "_")[0],
                mode: mode,
                param_state: this._state.has_component(id) ? "present" : "absent",
                three_state: this.has_child(id) ? "present" : "absent",
            };
            const key: string = [
                row["mode"],
                row["param_state"],
                row["three_state"],
            ].join("_");
            row["command"] = command_lut[key];
            row["order"] = order_lut[row["type"]];
            row["dependencies"] = new Params(partial_state).get_dependencies(id, false);
            schedule.push(row);
        }

        const output: Scaffold = new Scaffold()
        .from_array(schedule)
        .sort_by(x => x, "order");
        return output;
    }

    public _add_edges_for_nodes(partial_state: object): object {
        const params: Params = new Params(partial_state);
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
                Object.assign(partial_state, edge);
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
                Object.assign(partial_state, edge);
            }
        }

        return partial_state;
    }

    public edit(partial_state: object): void {
        partial_state = new Params(partial_state).resolve_ids().to_object();
        partial_state = this._add_edges_for_nodes(partial_state);
        const schedule: Scaffold = this.get_schedule(partial_state, "edit");
        const state: Params = this._state.update(partial_state);

        schedule.print();

        for (const row of schedule.to_array()) {
            if (row["command"] !== "ignore") {
                const cmd: string = "_" + row["command"] + "_" + row["type"];
                this[cmd](state, row["id"]);
            }
        }
        this._state = state;
    }

    public delete(partial_state: object): void {
        partial_state = new Params(partial_state).resolve_ids().to_object();
        const schedule: Scaffold = this.get_schedule(partial_state, "delete");
        const state: Params = this._state; //.update(partial_state);

        schedule.print();

        for (const row of schedule.to_array()) {
            if (row["command"] !== "ignore") {
                this.get_child(row["id"]).delete();
                delete this._children[row["id"]];
            }
        }
        this._state = state;
    }

    public destroy(): void {
        this.three_item.remove(this.three_item.children[0]);
        this._children = {};
        this._state = new Params({});
    }
}
