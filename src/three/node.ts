import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import { Params } from "../core/params";
import * as three_tools from "./three_tools";
import { Group } from "./group";
import { SubNode } from "./subnode";
import { Port } from "./port";
import { Edge } from "./edge";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export interface INodeParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
    "font/color/hue"?: number;
    "font/color/saturation"?: number;
    "font/color/value"?: number;
    "font/color/alpha"?: number;
    "font/text"?: string;
    "font/family"?: string;
    "font/style"?: string;
    "font/size"?: number;
}
// -----------------------------------------------------------------------------

export class Node {
    private __id: string;
    public _container: any;
    public _components: object = {};

    public constructor(container: any) {
        this._container = container;
        this.__id = null;
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

    private __to_subnode_params(params: object): object {
        let output: object = {
            "name":                  three_tools.get_name(params, "subnode"),
            "id":                    params["id"],
            "visible":               params["visible"],
            "translate/x":           params["translate/x"],
            "translate/y":           params["translate/y"],
            "translate/z":           params["translate/z"],
            "scale/x":               params["scale/x"],
            "scale/y":               params["scale/y"],
            "scale/z":               params["scale/z"],
            "color/hue":             params["color/hue"],
            "color/saturation":      params["color/saturation"],
            "color/value":           params["color/value"],
            "color/alpha":           params["color/alpha"],
            "font/color/hue":        params["font/color/hue"],
            "font/color/saturation": params["font/color/saturation"],
            "font/color/value":      params["font/color/value"],
            "font/color/alpha":      params["font/color/alpha"],
            "font/text":             params["font/text"],
            "font/family":           params["font/family"],
            "font/style":            params["font/style"],
            "font/size":             params["font/size"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_port_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "port"),
            "id":               params["id"],
            "visible":          params["visible"],
            "translate/x":      params["translate/x"],
            "translate/y":      params["translate/y"],
            "translate/z":      params["translate/z"],
            "scale/x":          params["scale/x"],
            "scale/y":          params["scale/y"],
            "scale/z":          params["scale/z"],
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_inport_edge_params(subnode: object, inport: object): object {
        let output: object = {
            "name":                    three_tools.get_name(subnode, "inport_edge"),
            "id":                      uuidv4(),
            "visible":                 subnode["visible"],
            "source/translate/x":      inport["translate/x"],
            "source/translate/y":      inport["translate/y"],
            "source/translate/z":      inport["translate/z"],
            "source/visible":          false,
            "destination/translate/x": subnode["translate/x"],
            "destination/translate/y": subnode["translate/y"],
            "destination/translate/z": subnode["translate/z"],
            "destination/visible":     false,
            // "scale/x":                 subnode["scale/x"],
            // "scale/y":                 subnode["scale/y"],
            // "scale/z":                 subnode["scale/z"],
            "radius":                  subnode["radius"],
            "color/hue":               subnode["color/hue"],
            "color/saturation":        subnode["color/saturation"],
            "color/value":             subnode["color/value"],
            "color/alpha":             subnode["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_outport_edge_params(subnode: object, outport: object): object {
        let output: object = {
            "name":                    three_tools.get_name(subnode, "outport_edge"),
            "id":                      uuidv4(),
            "visible":                 subnode["visible"],
            "source/translate/x":      subnode["translate/x"],
            "source/translate/y":      subnode["translate/y"],
            "source/translate/z":      subnode["translate/z"],
            "source/visible":          false,
            "destination/translate/x": outport["translate/x"],
            "destination/translate/y": outport["translate/y"],
            "destination/translate/z": outport["translate/z"],
            "destination/visible":     false,
            // "scale/x":                 subnode["scale/x"],
            // "scale/y":                 subnode["scale/y"],
            // "scale/z":                 subnode["scale/z"],
            "radius":                  subnode["radius"],
            "color/hue":               subnode["color/hue"],
            "color/saturation":        subnode["color/saturation"],
            "color/value":             subnode["color/value"],
            "color/alpha":             subnode["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
    // -------------------------------------------------------------------------

    public _create_group(node_params: object, container: any): Group {
        const grp: Group = new Group(container);
        grp.create(this.__to_group_params(node_params));
        return grp;
    }

    public _create_subnode(node_params, container): SubNode {
        const subnode: SubNode = new SubNode(container);
        subnode.create(this.__to_subnode_params(node_params));
        return subnode;
    }

    public _create_ports(
        ports: object[],
        subnode: SubNode,
        type: string,
        container: Group
    ): Port[] {

        const x: number = subnode.read()["translate/x"];
        const y: number = subnode.read()["translate/y"];
        const z: number = subnode.read()["translate/z"];

        let start: number = Math.ceil(x - (ports.length / 2));
        let height: number = y + 4;
        if (type === "outport") {
            height = y - 4;
        }

        const output: Port[] = [];
        for (const ip of ports) {
            const port: Port = new Port(container);
            const params: object = this.__to_port_params(ip);
            params["translate/x"] = start;
            params["translate/y"] = height;
            params["translate/z"] = z;

            port.create(params);
            output.push(port);
            start++;
        }
        return output;
    }

    public _create_port_edges(
        ports: Port[],
        subnode: SubNode,
        port_type: string,
        container: Group
    ): Edge[] {

        let func: any = null;
        if (port_type === "inport") {
            func = this.__to_inport_edge_params;
        }
        else if (port_type === "outport") {
            func = this.__to_outport_edge_params;
        }

        const sub: object = subnode.read();
        const output: Edge[] = [];
        for (const port of ports) {
            const edge: Edge = new Edge(container);
            edge.create( func(sub, port.read()) );
            output.push(edge);
        }
        return output;
    }

    public create(dict: object, id: string): void {
        this.__id = id;

        const params: Params     = new Params(dict);
        const node: object       = params.to_node(id);
        const inports: object[]  = params.to_inports(id);
        const outports: object[] = params.to_outports(id);

        const grp: Group       = this._create_group(node, this._container);
        const subnode: SubNode = this._create_subnode(node, grp._item);
        const ips: Port[]      = this._create_ports(inports, subnode, "inport", grp._item);
        const ops: Port[]      = this._create_ports(outports, subnode, "outport", grp._item);

        this._components["group"]         = grp;
        this._components["subnode"]       = subnode;
        this._components["inports"]       = ips;
        this._components["outports"]      = ops;
        this._components["inport_edges"]  = this._create_port_edges(ips, subnode, "inport", grp._item);
        this._components["outport_edges"] = this._create_port_edges(ops, subnode, "outport", grp._item);
    }
}
