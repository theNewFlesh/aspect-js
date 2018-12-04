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
import { Port } from "./port";
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
    public _params: Params = new Params({});
    public parent: any;
    public children: object = {};
    public three_item: any;
    // -------------------------------------------------------------------------

    public has_child(id: string): boolean {
        return this.children.hasOwnProperty(id);
    }

    public get_child(id: string): any {
        if (!this.has_child(id)) {
            throw new Error(`id: ${id} child does not exist`);
        }
        return this.children[id];
    }

    public set_child(key: string, value: any): void {
        this.children[key] = value;
    }

    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this.get_child(pid);
    }

    public _update_port_positions(params: Params, offset: number = 2) {
        for (const node of params.to_nodes()) {
            const pos: object = this.get_child(node["id"]).read();
            const x: number = pos["translate/x"];
            const y: number = pos["translate/y"];
            const z: number = pos["translate/z"];

            const inports: IPortParams[] = params.filter_node(node["id"], true).to_inports();
            let ipstart: number = Math.ceil(x - (inports.length / 2));
            for (const inport of inports) {
                const port: Port = this.get_child(inport["id"]);
                port.update({
                    "translate/x": ipstart - x,
                    "translate/y": offset,
                    "translate/z": 0,
                });
                ipstart++;
            }

            const outports: IPortParams[] = params.filter_node(node["id"], true).to_outports();
            let opstart: number = Math.ceil(x - (outports.length / 2));
            for (const outport of outports) {
                const port: Port = this.get_child(outport["id"]);
                port.update({
                    "translate/x": opstart - x,
                    "translate/y": -offset,
                    "translate/z": 0,
                });
                opstart++;
            }
        }
    }

    public _resolve_edge_params(
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

        let dst: object = this.get_child(destination_id).read();
        if (dst["type"] === "node") {
            dst = {
                "translate/x": 0,
                "translate/y": 0,
                "translate/z": 0,
            };
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

    public _create_node_edges(params: Params): void {
        for (const node of params.to_nodes()) {
            const parent: Node = this.get_child(node["id"]);
            for (const inport of params.filter_node(node["id"], true).to_inports()) {
                const temp: object = {
                    "id": "edge_" + uuidv4(),
                };
                const edge_params: IEdgeParams = this._resolve_edge_params(
                    temp, inport["id"], node["id"]
                );
                this._create_edge(params, parent, edge_params);
            }

            for (const outport of params.filter_node(node["id"], true).to_outports()) {
                const temp: object = {
                    "id": "edge_" + uuidv4(),
                };
                const edge_params: IEdgeParams = this._resolve_edge_params(
                    temp, node["id"], outport["id"]
                );
                this._create_edge(params, parent, edge_params);
            }
        }
    }

    public _link_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            const graph: Graph = this.get_child(id);
            const pid: string = params.get_parent_id(id);
            let parent: any = this.parent;
            if (this.has_child(pid)) {
                parent = this.get_child(pid);
            }

            graph.parent = parent;
        }
    }
    // -------------------------------------------------------------------------

    public _update_scene(params: Params): void {
        const id: string = params.get_scene_id();
        const item: object = params.to_scene(id);
        if (!this.has_child(id)) {
            this.three_item = new THREE.Scene();
            const scene: Scene = new Scene();
            scene.create(item, this);
            this.set_child(id, scene);
            this.parent = scene;
            this._id = id;
        }
        else {
            this.get_child(id).update(item);
        }
    }
    // -------------------------------------------------------------------------

    public _update_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const graph: Graph = new Graph();
                graph.create(item, this.parent);
                this.set_child(id, graph);
            }
            else {
                this.get_child(id).update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_nodes(params: Params): void {
        for (const item of params.to_nodes()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const node: Node = new Node();
                node.create(item, parent);
                this.set_child(id, node);
            }
            else {
                this.get_child(id).update(item);
            }
        }
    }
    // -------------------------------------------------------------------------
    public _create_edge(params: Params, parent: any, edge_params: IEdgeParams): void {
        const edge: Edge = new Edge();
        this.set_child(edge_params["id"], edge);
        edge.create(edge_params, parent);
    }

    public _update_edges(params: Params): void {
        for (let item of params.to_edges()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                item = this._resolve_edge_params(item, item["source/id"], item["destination/id"]);
                const parent: any = this._get_parent(params, id);
                this._create_edge(params, parent, item);
            }
            else {
                const temp: IEdgeParams = this.get_child(item["id"]).read();
                Object.assign(temp, item);
                item = this._resolve_edge_params(temp, temp["source/id"], temp["destination/id"]);
                this.get_child(id).update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_inports(params: Params): void {
        for (const item of params.to_inports()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const inport: Port = new Port();
                inport.create(item, parent);
                this.set_child(id, inport);
            }
            else {
                this.get_child(id).update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_outports(params: Params): void {
        for (const item of params.to_outports()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const outport: Port = new Port();
                outport.create(item, parent);
                this.set_child(id, outport);
            }
            else {
                this.get_child(id).update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public update(state: object): void {
        const params: Params = new Params(state).diff(this._params, true);
        if (params.length === 0) {
            return;
        }

        this._update_scene(params);
        this._update_graphs(params);
        this._link_graphs(params);

        this._update_nodes(params);
        this._update_inports(params);
        this._update_outports(params);
        this._update_port_positions(params);
        this._create_node_edges(params);

        this._update_edges(params);
        this._params = new Params(state);
    }

    public delete(state: object): void {
        this.three_item.remove(this.three_item.children[0]);
        this._params = new Params({});
    }
}
