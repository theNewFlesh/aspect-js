import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as three_tools from "./three_tools";
import { Graph } from "./graph";
import { Node } from "./node";
import { Edge } from "./edge";
import { Port } from "./port";
import { Params } from "../core/params";
// -----------------------------------------------------------------------------

export class DAG {
    private __id: string;
    public _params: Params = new Params({});
    public _container: any;
    public _components: object = {
        graphs: {},
        nodes: {},
        edges: {},
        inports: {},
        outports: {},
    };

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
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

    public _create_graphs(params: Params): void {
        for (const temp of params.to_graphs()) {
            const id: string = temp["id"];
            const p = this.__to_graph_params(temp);
            const graph: Graph = new Graph(this._container);
            this._components["graphs"][id] = graph;
            graph.create(p);
        }
    }

    public _link_graphs(params: Params): void {
        for (const id of _.keys(this._components["graphs"])) {
            const graph: Graph = this._components["graphs"][id];
            const pid: string = params.get_parent_id(id);
            let parent: any = this._container;
            if (this._components["graphs"].hasOwnProperty(pid)) {
                parent = this._components["graphs"][pid]._components["graph"]._item;
            }
            graph.link(parent);
        }
    }

    public _get_parent(params: Params, id: string, parent_type: string): any {
        const pid: string = params.get_parent_id(id);
        let parent: any = this._container;
        const comps: object = this._components[parent_type + "s"];
        if (_.keys(comps).includes(pid)) {
            parent = comps[pid]._item;
        }
        return parent;
    }

    public _create_nodes(params: Params): void {
        for (const n of params.to_nodes()) {
            const id: string = n["id"];
            const parent: any = this._get_parent(params, id, "graph");

            const node: Node = new Node(parent);
            this._components["nodes"][id] = node;
            node.create(params, id);
        }
    }

    public _create_edges(params: Params): void {
        for (const e of params.to_edges()) {
            const id: string = e["id"];
            const parent: any = this._get_parent(params, id, "graph");

            const edge: Edge = new Edge(parent);
            this._components["edges"][id] = edge;
            edge.create(params, id);
        }
    }

    public create(state: object): void {
        const params: Params = new Params(state).diff(this._params);
        this._create_graphs(params);
        this._link_graphs(params);
        this._create_nodes(params);
        this._create_edges(params);
        this._params = new Params(state);
    }
}
