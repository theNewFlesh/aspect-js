import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as three_tools from "./three_tools";
import { Group } from "./group";
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

    private __to_group_params(params: object): object {
        let output: object = {
            "name":        three_tools.get_name(params, "group"),
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

    private __to_node_params(params: object): object {
        let output: object = {
            "name":                  three_tools.get_name(params, "node"),
            "visible":               params["display/visible"],
            "translate/x":           params["display/translate/x"],
            "translate/y":           params["display/translate/y"],
            "translate/z":           params["display/translate/z"],
            "scale/x":               params["display/scale/x"],
            "scale/y":               params["display/scale/y"],
            "scale/z":               params["display/scale/z"],
            "color/hue":             params["display/color/hue"],
            "color/saturation":      params["display/color/saturation"],
            "color/value":           params["display/color/value"],
            "color/alpha":           params["display/color/alpha"],
            "font/color/hue":        params["display/font/color/hue"],
            "font/color/saturation": params["display/font/color/saturation"],
            "font/color/value":      params["display/font/color/value"],
            "font/color/alpha":      params["display/font/color/alpha"],
            "font/text":             params["display/font/text"],
            "font/family":           params["display/font/family"],
            "font/style":            params["display/font/style"],
            "font/size":             params["display/font/size"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_edge_params(params: object): object {
        // const id0: object = tools.port_id_to_node_id(params["from"]);
        // const id1: object = tools.port_id_to_node_id(params["to"]);

        // const node0: object = this._nodes[id0].read();
        // const node1: object = this._nodes[id1].read();

        let output: object = {
            "name":             three_tools.get_name(params, "edge"),
            "visible":          params["display/visible"],
            // "from/translate/x": node0["translate/x"],
            // "from/translate/y": node0["translate/y"],
            // "from/translate/z": node0["translate/z"],
            "from/visible":     params["display/from/visible"],
            // "to/translate/x":   node1["translate/x"],
            // "to/translate/y":   node1["translate/y"],
            // "to/translate/z":   node1["translate/z"],
            "to/visible":       params["display/to/visible"],
            "scale/x":          params["display/scale/x"],
            "scale/y":          params["display/scale/y"],
            "scale/z":          params["display/scale/z"],
            "radius":           params["display/radius"],
            "color/hue":        params["display/color/hue"],
            "color/saturation": params["display/color/saturation"],
            "color/value":      params["display/color/value"],
            "color/alpha":      params["display/color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_inport_params(params: object): object {
        let output: object = {
            "name":                  three_tools.get_name(params, "inport"),
            "visible":               params["display/visible"],
            "translate/x":           params["display/translate/x"],
            "translate/y":           params["display/translate/y"],
            "translate/z":           params["display/translate/z"],
            "scale/x":               params["display/scale/x"],
            "scale/y":               params["display/scale/y"],
            "scale/z":               params["display/scale/z"],
            "color/hue":             params["display/color/hue"],
            "color/saturation":      params["display/color/saturation"],
            "color/value":           params["display/color/value"],
            "color/alpha":           params["display/color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_outport_params(params: object): object {
        let output: object = {
            "name":                  three_tools.get_name(params, "outport"),
            "visible":               params["display/visible"],
            "translate/x":           params["display/translate/x"],
            "translate/y":           params["display/translate/y"],
            "translate/z":           params["display/translate/z"],
            "scale/x":               params["display/scale/x"],
            "scale/y":               params["display/scale/y"],
            "scale/z":               params["display/scale/z"],
            "color/hue":             params["display/color/hue"],
            "color/saturation":      params["display/color/saturation"],
            "color/value":           params["display/color/value"],
            "color/alpha":           params["display/color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
     // -------------------------------------------------------------------------

    public _create_graph(params: Params, id: string): void {
        let temp: object = params.to_graph(id);
        temp = this.__to_group_params(temp);
        const graph: Group = new Group(this._container);
        this._components["graphs"][id] = graph;
        graph.create(temp);
    }

    public _link_graph(params: Params, id: string): void {
        const graph: Group = this._components["graphs"][id];
        const pid: string = params.get_parent_id(id);
        let parent: any = this._container;
        if (this._components["graphs"].hasOwnProperty(pid)) {
            parent = this._components["graphs"][pid]._components["group"]._item;
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

        let temp: object = params.to_node(id);
        temp = this.__to_node_params(temp);
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
