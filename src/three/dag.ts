import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { Group } from "./group";
import { Node } from "./node";
import { Edge } from "./edge";
// -----------------------------------------------------------------------------

export class DAG {
    private __id: string;
    public _container: any;
    public _graphs: object = {};
    public _nodes: object = {};
    public _edges: object = {};
    public _ports: object = {};

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
    }
    // -------------------------------------------------------------------------

    private __to_group_params(params: object): object {
        // const new_params: object = tools.strip_id_keys(params);
        const new_params: object = params;
        let output: object = {
            "name":        three_tools.get_name(new_params, "graph"),
            "visible":     new_params["display/visible"],
            "translate/x": new_params["display/translate/x"],
            "translate/y": new_params["display/translate/y"],
            "translate/z": new_params["display/translate/z"],
            "rotate/x":    new_params["display/rotate/x"],
            "rotate/y":    new_params["display/rotate/y"],
            "rotate/z":    new_params["display/rotate/z"],
            "scale/x":     new_params["display/scale/x"],
            "scale/y":     new_params["display/scale/y"],
            "scale/z":     new_params["display/scale/z"],
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
        let output: object = {
            "name":             three_tools.get_name(params, "edge"),
            "visible":          params["display/visible"],
            "from/translate/x": params["display/from/translate/x"],
            "from/translate/y": params["display/from/translate/y"],
            "from/translate/z": params["display/from/translate/z"],
            "from/visible":     params["display/from/visible"],
            "to/translate/x":   params["display/to/translate/x"],
            "to/translate/y":   params["display/to/translate/y"],
            "to/translate/z":   params["display/to/translate/z"],
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
     // -------------------------------------------------------------------------

    public _create_group(params: object, container: any): Group {
        const group = new Group(container);
        const group_params = this.__to_group_params(params);
        group.create(group_params);
        return group;
    }

    public _create_node(params: object, container: any): Node {
        const node = new Node(container);
        const node_params = this.__to_node_params(params);
        node.create(node_params);
        return node;
    }

    public _create_edge(params: object, container: any): Edge {
        const edge = new Edge(container);
        const edge_params = this.__to_edge_params(params);
        edge.create(edge_params);
        return edge;
    }

    public _resolve_container(id: string): any {
        const graph: any = id.match("(.*/graph_.*?/)");
        if (graph !== null) {
            return this._graphs[graph[1]]._item;
        }
        return this._container;
    }
    // -------------------------------------------------------------------------

    public get _default_params(): object {
        return {
            "name":    "dag",
            "visible": true,
        };
    }

    public create(params: object): void {
        const temp: three_tools.IParams = three_tools.resolve_params(
            params, this._default_params
        );
        let new_params: object = this._default_params;
        Object.assign(new_params, temp);
        new_params = three_tools.remove_empty_keys(new_params);

        const g_lut = tools.to_graph_lut(params);
        for (const id of _.keys(g_lut)) {
            const graph = g_lut[id];
            this._graphs[id] = this._create_group(graph, this._container);
        }

        const n_lut = tools.to_node_lut(params);
        for (const id of _.keys(n_lut)) {
            const node = n_lut[id];
            const cont = this._resolve_container(id);
            this._nodes[id] = this._create_node(node, cont);
        }

        const e_lut = tools.to_edge_lut(params);
        for (const id of _.keys(e_lut)) {
            const edge = e_lut[id];
            const cont = this._resolve_container(id);
            this._edges[edge["id"]] = this._create_edge(edge, cont);
        }
    }

    // public read(): IDAGParams {
    //     const grp = this._primitives["group"].read();
    //     const cube = this._primitives["cube"].read();
    //     const textbox = this._primitives["textbox"].read();

    //     let params: IDAGParams = {
    //         "name":                  grp["name"],
    //         "visible":               grp["visible"],
    //         "translate/x":           grp["translate/x"],
    //         "translate/y":           grp["translate/y"],
    //         "translate/z":           grp["translate/z"],
    //         "rotate/x":              grp["rotate/x"],
    //         "rotate/y":              grp["rotate/y"],
    //         "rotate/z":              grp["rotate/z"],
    //         "scale/x":               grp["scale/x"],
    //         "scale/y":               grp["scale/y"],
    //         "scale/z":               grp["scale/z"],
    //         "color/hue":             cube["color/hue"],
    //         "color/saturation":      cube["color/saturation"],
    //         "color/value":           cube["color/value"],
    //         "color/alpha":           cube["color/alpha"],
    //     };
    //     params = three_tools.remove_empty_keys(params);
    //     return params;
    // }

    // public update(params: IDAGParams): void {
    //     let new_params: IDAGParams = this.read();
    //     new_params = three_tools.resolve_params(params, new_params);

    //     this._primitives["group"].update(this.__to_group_params(new_params));
    //     this._primitives["cube"].update(this.__to_cube_params(new_params));
    //     this._primitives["textbox"].update(this.__to_textbox_params(new_params));
    // }

    // public delete(): void {
    //     const prims = this._primitives;
    //     let keys = _.keys(prims);
    //     const grp = this._primitives["group"];
    //     keys = _.filter(keys, key => key !== "group");
    //     keys.map(key => prims[key].delete());
    //     this._container.remove(grp._item);
    // }
}
