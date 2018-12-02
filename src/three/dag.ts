import * as _ from "lodash";
import * as three_tools from "./three_tools";
import * as tools from "../core/tools";
import * as test_tools from "../../test/test_tools";
import * as test_scene from "../../test/test_scene";
import * as THREE from "three";
import { Scene } from "./scene";
import { Graph } from "./graph";
import { Edge } from "./edge";
import { Node } from "./node";
import { Port } from "./port";
import { Params } from "../core/params";
import { Scaffold } from "../core/scaffold";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export class DAG {
    public get THREE() { return THREE; }
    public get three_tools() { return three_tools; }
    public get test_tools() { return test_tools; }
    public get test_scene() { return test_scene.scene; }
    public get tools() { return tools; }
    public get scaffold() { return Scaffold; }
    public get params() { return Params; }

    public self = this;
    public _item: any;
    public _params: Params = new Params({});
    public _children: object = {};
    public _scene: Scene;
    // -------------------------------------------------------------------------

    public _create_component(
        type: string,
        params: Params,
        id: string = null,
        parent: any,
    ): void {
        let child: any;
        let data: object;
        if (type === "scene") {
            child = Scene;
            data = params.to_scene();
        }
        else if (type === "graph") {
            child = Graph;
            data = params.to_graph(id);
        }
        else if (type === "node") {
            child = Node;
            data = params.to_node(id);
        }
        else if (type === "edge") {
            child = Edge;
            data = params.to_edge(id);
        }
        else if (type === "inport") {
            child = Port;
            data = params.to_inport(id);
        }
        else if (type === "outport") {
            child = Port;
            data = params.to_outport(id);
        }

        const item: any = new child(parent);
        this._children[id] = item;
        item.create(data);
    }

    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this._children[pid];
    }

    public _create_ports(params: Params, type: string) {
        for (const item of params.to_nodes()) {
            const node: Node = this._children[item["id"]];
            const x: number = node.read()["translate/x"];
            const y: number = node.read()["translate/y"];
            const z: number = node.read()["translate/z"];

            let ports: object[] = params.to_inports();
            if (type === "outport") {
                ports = params.to_outports();
            }

            let start: number = Math.ceil(x - (ports.length / 2));
            let height: number = y + 4;
            if (type === "outport") {
                height = y - 4;
            }

            const output: Port[] = [];
            for (const p of ports) {
                const port: Port = new Port(node);
                const params: object = this.__to_port_params(p);
                params["translate/x"] = start;
                params["translate/y"] = height;
                params["translate/z"] = z;

                port.create(params);
                output.push(port);
                start++;
            }
            return output;
        }
    }

    public _create_scene(params: Params): void {
        this._item = new THREE.Scene();
        const scene: Scene = new Scene(this.self);
        scene.create(params.to_scene());
        const id: string = params.to_scene()["id"];
        this._children[id] = scene;
        this._scene = scene;
    }

    public _link_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            const graph: Graph = this._children[id];
            const pid: string = params.get_parent_id(id);
            let parent: any = this._item;
            if (this._children.hasOwnProperty(pid)) {
                parent = this._children[pid];
            }
            graph.link(parent);
        }
    }

    public _create_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            this._create_component("graph", params, item["id"], this._scene);
        }
    }

    public _create_nodes(params: Params): void {
        for (const item of params.to_nodes()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("node", params, item["id"], parent);
        }
    }

    public _create_edges(params: Params): void {
        for (const item of params.to_edges()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("edge", params, item["id"], parent);
        }
    }

    public _create_inports(params: Params): void {
        for (const item of params.to_inports()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("inport", params, item["id"], parent);
        }
    }

    public _create_outports(params: Params): void {
        for (const item of params.to_outports()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("outport", params, item["id"], parent);
        }
    }

    public create(state: object): void {
        const params: Params = new Params(state).diff(this._params);
        this._create_scene(params);
        this._create_graphs(params);
        this._link_graphs(params);
        this._create_nodes(params);
        // this._create_inports(params);
        // this._create_outports(params);
        this._create_edges(params);
        this._params = new Params(state);
    }
}
