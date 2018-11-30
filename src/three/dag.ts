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

    public _parent: THREE.Scene;
    public _params: Params = new Params({});
    public _children: object = {};
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

    public _create_scene(params: Params): void {
        const scene: Scene = new Scene(new THREE.Scene());
        scene.create(params.to_scene());
        const id: string = params.to_scene()["id"];
        this._children[id] = scene;
        this._parent = scene._item;
    }

    public _link_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            const graph: Graph = this._children[id];
            const pid: string = params.get_parent_id(id);
            let parent: any = this._parent;
            if (this._children.hasOwnProperty(pid)) {
                parent = this._children[pid];
            }
            graph.link(parent);
        }
    }

    public _create_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            this._create_component("graph", params, item["id"], this._parent);
        }
    }

    public _create_nodes(params: Params): void {
        for (const item of params.to_nodes()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("node", params, item["id"], parent._item);
        }
    }

    public _create_edges(params: Params): void {
        for (const item of params.to_edges()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("edge", params, item["id"], parent._item);
        }
    }

    public _create_inports(params: Params): void {
        for (const item of params.to_inports()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("inport", params, item["id"], parent._item);
        }
    }

    public _create_outports(params: Params): void {
        for (const item of params.to_outports()) {
            const parent: any = this._get_parent(params, item["id"]);
            this._create_component("outport", params, item["id"], parent._item);
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
        // this._create_edges(params);
        this._params = new Params(state);
    }
}
