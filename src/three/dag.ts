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

    public self = this;
    public _params: Params = new Params({});
    public parent: any;
    public children: object = {};
    public three_item: any;
    // -------------------------------------------------------------------------

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
                    "translate/x": ipstart,
                    "translate/y": y + offset,
                    "translate/z": z,
                });
                ipstart++;
            }

            const outports: IPortParams[] = params.filter_node(node["id"], true).to_outports();
            let opstart: number = Math.ceil(x - (outports.length / 2));
            for (const outport of outports) {
                const port: Port = this.children[outport["id"]];
                port.update({
                    "translate/x": opstart,
                    "translate/y": y - offset,
                    "translate/z": z,
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
                const inport: IPortParams = this.children[ip["id"]].read();
                const edge_params: object = {
                    "id":                      "edge_" + uuidv4(),
                    "source/translate/x":      inport["translate/x"],
                    "source/translate/y":      inport["translate/y"],
                    "source/translate/z":      inport["translate/z"],
                    "destination/translate/x": node["translate/x"],
                    "destination/translate/y": node["translate/y"],
                    "destination/translate/z": node["translate/z"],
                };
                this._create_edge(params, parent, edge_params);
            }

            for (const op of params.filter_node(n["id"], true).to_outports()) {
                const outport: IPortParams = this.children[op["id"]].read();
                const edge_params: object = {
                    "id":                      "edge_" + uuidv4(),
                    "source/translate/x":      node["translate/x"],
                    "source/translate/y":      node["translate/y"],
                    "source/translate/z":      node["translate/z"],
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

    public _create_scene(params: Params): void {
        this.three_item = new THREE.Scene();
        const scene: Scene = new Scene(this);
        scene.create(params.to_scene());
        const id: string = params.to_scene()["id"];
        this.children[id] = scene;
        this.parent = scene;
    }

    public _create_graphs(params: Params): void {
        for (const three_item of params.to_graphs()) {
            const graph: Graph = new Graph(this.parent);
            this.children[three_item["id"]] = graph;
            graph.create(three_item);
        }
    }

    public _create_nodes(params: Params): void {
        for (const three_item of params.to_nodes()) {
            const parent: any = this._get_parent(params, three_item["id"]);
            const node: Node = new Node(parent);
            this.children[three_item["id"]] = node;
            node.create(three_item);
        }
    }

    public _create_edge(params: Params, parent: any, edge_params: IEdgeParams): void {
        const edge: Edge = new Edge(parent);
        this.children[edge_params["id"]] = edge;
        edge.create(edge_params);
    }

    public _create_edges(params: Params): void {
        for (const three_item of params.to_edges()) {
            const parent: any = this._get_parent(params, three_item["id"]);
            this._create_edge(params, parent, three_item);
        }
    }

    public _create_inports(params: Params): void {
        for (const three_item of params.to_inports()) {
            const parent: any = this._get_parent(params, three_item["id"]);
            const inport: Port = new Port(parent);
            this.children[three_item["id"]] = inport;
            inport.create(three_item);
        }
    }

    public _create_outports(params: Params): void {
        for (const three_item of params.to_outports()) {
            const parent: any = this._get_parent(params, three_item["id"]);
            const outport: Port = new Port(parent);
            this.children[three_item["id"]] = outport;
            outport.create(three_item);
        }
    }
    // -------------------------------------------------------------------------

    public create(state: object): void {
        const params: Params = new Params(state).diff(this._params);
        this._create_scene(params);
        this._create_graphs(params);
        this._link_graphs(params);

        this._create_nodes(params);
        this._create_inports(params);
        this._create_outports(params);
        this._update_port_positions(params);
        this._create_node_edges(params);

        this._create_edges(params);
        this._params = new Params(state);
    }
}
