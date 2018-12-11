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
import { Scheduler } from "./scheduler";
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

    public delete_child(id: string): void {
        this.get_child(id).delete();
        delete this._children[id];
    }

    public get children(): object {
        return this._children;
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
            params,
            item,
            item["source/id"],
            item["destination/id"]
        );
        const parent: any = this._get_parent(params, id);

        const edge: Edge = new Edge(this.three_item);
        edge.create(item, parent);
        this.set_child(id, edge);
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

    public edit(fragment: object): void {
        const scheduler: Scheduler = new Scheduler(this._state).edit(fragment, this);
        scheduler.print();

        const temp: any = scheduler.to_state_and_schedule();
        const state: Params = temp[0];
        const schedule: object[] = temp[1];

        for (const row of schedule) {
            if (row["command"] !== "ignore") {
                const cmd: string = "_" + row["command"] + "_" + row["type"];
                this[cmd](state, row["id"]);
            }
        }
        this._state = state;
    }

    public _sweep_edges(): void {
        for (const id of this._state.filter_edges().to_ids()) {
            if (this.has_child(id)) {
                const edge: Edge = this.get_child(id);
                const src: string = edge.read()["source/id"];
                const dst: string = edge.read()["destination/id"];
                for (const pid of [src, dst]) {
                    if (!this.has_child(pid)) {
                        const temp: object = this._state.filter_edge(id).to_object();
                        this.delete(temp, false);
                    }
                }
            }
        }
    }

    public delete(fragment: object, sweep: boolean = true): void {
        const scheduler: Scheduler = new Scheduler(this._state).delete(fragment, this);
        scheduler.print();

        const temp: any = scheduler.to_state_and_schedule();
        const state: Params = temp[0];
        const schedule: object[] = temp[1];

        for (const row of schedule) {
            if (row["command"] !== "ignore") {
                this.delete_child(row["id"]);
            }
        }
        this._state = state;
        // if (sweep) {
        //     this._sweep_edges();
        // }
    }

    public destroy(): void {
        this.three_item.remove(this.three_item.children[0]);
        this._children = {};
        this._state = new Params({});
    }
}
