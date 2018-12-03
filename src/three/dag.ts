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

    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this.children[pid];
    }

    public _update_port_positions(params: Params, offset: number = 2) {
        for (const node of params.to_nodes()) {
            const pos: object = this.children[node["id"]].read();
            const x: number = pos["translate/x"];
            const y: number = pos["translate/y"];
            const z: number = pos["translate/z"];

            const inports: IPortParams[] = params.filter_node(node["id"], true).to_inports();
            let ipstart: number = Math.ceil(x - (inports.length / 2));
            for (const inport of inports) {
                const port: Port = this.children[inport["id"]];
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
                const port: Port = this.children[outport["id"]];
                port.update({
                    "translate/x": opstart - x,
                    "translate/y": -offset,
                    "translate/z": 0,
                });
                opstart++;
            }
        }
    }

    public _create_node_edges(params: Params): void {
        for (const n of params.to_nodes()) {
            const parent: Node = this.children[n["id"]]
            const node: INodeParams = parent.read();
            for (const ip of params.filter_node(n["id"], true).to_inports()) {
                const id: string = ip["id"];
                const inport: IPortParams = this.children[id].read();
                const edge_params: object = {
                    "id":                      "edge_" + uuidv4(),
                    "source/translate/x":      inport["translate/x"],
                    "source/translate/y":      inport["translate/y"],
                    "source/translate/z":      inport["translate/z"],
                    "destination/translate/x": 0,
                    "destination/translate/y": 0,
                    "destination/translate/z": 0,
                };
                this._create_edge(params, parent, edge_params);
            }

            for (const op of params.filter_node(n["id"], true).to_outports()) {
                const id: string = op["id"];
                const outport: IPortParams = this.children[id].read();
                const edge_params: object = {
                    "id":                      "edge_" + uuidv4(),
                    "source/translate/x":      0,
                    "source/translate/y":      0,
                    "source/translate/z":      0,
                    "destination/translate/x": outport["translate/x"],
                    "destination/translate/y": outport["translate/y"],
                    "destination/translate/z": outport["translate/z"],
                };
                this._create_edge(params, parent, edge_params);
            }
        }
    }

    public _link_graphs(params: Params): void {
        for (const three_item of params.to_graphs()) {
            const id: string = three_item["id"];
            const graph: Graph = this.children[id];
            const pid: string = params.get_parent_id(id);
            let parent: any = this.parent;
            if (this.children.hasOwnProperty(pid)) {
                parent = this.children[pid];
            }

            parent._three_item.add(graph._three_item);
            graph._parent = parent;
        }
    }
    // -------------------------------------------------------------------------

    public _update_scene(params: Params): void {
        const id: string = params.get_scene_id();
        const item: object = params.to_scene(id);
        if (!this.has_child(id)) {
            this.three_item = new THREE.Scene();
            const scene: Scene = new Scene(this);
            scene.create(item);
            this.children[id] = scene;
            this.parent = scene;
            this._id = id;
        }
        // else {
        //     this.children[id].update(item);
        // }
    }
    // -------------------------------------------------------------------------

    public _update_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const graph: Graph = new Graph(this.parent);
                this.children[id] = graph;
                graph.create(item);
            }
            else {
                this.children[id].update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_nodes(params: Params): void {
        for (const item of params.to_nodes()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const node: Node = new Node(parent);
                this.children[id] = node;
                node.create(item);
            }
            else {
                this.children[id].update(item);
            }
        }
    }
    // -------------------------------------------------------------------------
    public _create_edge(params: Params, parent: any, edge_params: IEdgeParams): void {
        const edge: Edge = new Edge(parent);
        this.children[edge_params["id"]] = edge;
        edge.create(edge_params);
    }

    public _update_edges(params: Params): void {
        for (const item of params.to_edges()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                this._create_edge(params, parent, item);
            }
            else {
                this.children[id].update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_inports(params: Params): void {
        for (const item of params.to_inports()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const inport: Port = new Port(parent);
                this.children[id] = inport;
                inport.create(item);
            }
            else {
                this.children[id].update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public _update_outports(params: Params): void {
        for (const item of params.to_outports()) {
            const id: string = item["id"];
            if (!this.has_child(id)) {
                const parent: any = this._get_parent(params, id);
                const outport: Port = new Port(parent);
                this.children[id] = outport;
                outport.create(item);
            }
            else {
                this.children[id].update(item);
            }
        }
    }
    // -------------------------------------------------------------------------

    public update(state: object): void {
        const params: Params = new Params(state).diff(this._params, true);
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
