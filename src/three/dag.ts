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
    private __state: Params = new Params({});
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

    public _create_graph(params: Params, id: string): void {
        let temp: object = params.to_graph(id);
        temp = this.__to_graph_params(temp);
        const graph: Graph = new Graph(this._container);
        this._components["graphs"][id] = graph;
        graph.create(temp);
    }

    public _link_graph(params: Params, id: string): void {
        const graph: Graph = this._components["graphs"][id];
        const pid: string = params.get_parent_id(id);
        let parent: any = this._container;
        if (this._components["graphs"].hasOwnProperty(pid)) {
            parent = this._components["graphs"][pid]._components["graph"]._item;
        }
        graph.link(parent);
    }

    public _create_node(params: Params, id: string): void {
        const pid: string = params.get_parent_id(id);
        let parent: any = this._container;
        const graphs: object = this._components["graphs"];
        if (_.keys(graphs).includes(pid)) {
            parent = graphs[pid]._item;
        }

        const node: Node = new Node(parent);
        this._components["nodes"][id] = node;
        node.create(params, id);
    }

    public create(state: object): void {
        const params: Params = new Params(state).diff(this.__state);
        for (const graph of params.to_graphs()) {
            this._create_graph(params, graph["id"]);
        }

        for (const id of _.keys(this._components["graphs"])) {
            this._link_graph(params, id);
        }

        for (const node of params.to_nodes()) {
            this._create_node(params, node["id"]);
        }

        // for (const inport of params.to_inports()) {
        //     this._create_inport(inport);
        // }

        // for (const outport of params.to_outports()) {
        //     this._create_outport(outport);
        // }

        // for (const edge of params.to_edges()) {
        //     this._create_edge(edge);
        // }

        this.__state = new Params(state);
    }
}
