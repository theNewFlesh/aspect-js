import * as _ from "lodash";
import * as THREE from "three";
import * as three_tools from "./three_tools";
import { Scene } from "./scene";
import { Graph } from "./graph";
import { Edge } from "./edge";
import { Node } from "./node";
import { Port } from "./port";
import { Params } from "../core/params";
// -----------------------------------------------------------------------------

export class DAG {
    public _parent: THREE.Scene;
    public _params: Params = new Params({});
    public _components: object = {};

    public constructor() {
        // pass
    }
    // -------------------------------------------------------------------------

    private __to_graph_params(params: object): object {
        let output: object = {
            "name":        three_tools.get_name(params, "graph"),
            "visible":     params["visible"],
            "translate/x": params["translate/x"],
            "translate/y": params["translate/y"],
            "translate/z": params["translate/z"],
            "scale/x":     params["scale/x"],
            "scale/y":     params["scale/y"],
            "scale/z":     params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
    // -------------------------------------------------------------------------

    public _create_component(
        type: string,
        params: Params,
        id: string = null,
        container: any,
    ): void {
        let Component: any;
        let data: object;
        if (type === "scene") {
            Component = Scene;
            data = params.to_scene();
        }
        else if (type === "graph") {
            Component = Graph;
            data = params.to_graph(id);
        }
        else if (type === "node") {
            Component = Node;
            data = params.to_node(id);
        }
        else if (type === "edge") {
            Component = Edge;
            data = params.to_edge(id);
        }
        else if (type === "inport") {
            Component = Port;
            data = params.to_inport(id);
        }
        else if (type === "outport") {
            Component = Port;
            data = params.to_outport(id);
        }

        const item: any = new Component(container);
        this._components[id] = item;
        item.create(data);
    }

    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this._components[pid];
    }

    public _create_scene(params: Params): void {
        const scene: Scene = new Scene(new THREE.Scene());
        scene.create(params.to_scene());
        const id: string = params.to_scene()["id"];
        this._components[id] = scene;
        this._parent = scene._item;
    }

    public _link_graphs(params: Params): void {
        for (const item of params.to_graphs()) {
            const id: string = item["id"];
            const graph: Graph = this._components[id];
            const pid: string = params.get_parent_id(id);
            let parent: any = this._parent;
            if (this._components.hasOwnProperty(pid)) {
                parent = this._components[pid];
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
        // this._create_nodes(params);
        // this._create_edges(params);
        this._params = new Params(state);
    }
}
