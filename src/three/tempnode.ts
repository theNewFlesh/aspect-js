import * as _ from "lodash";
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

export class Node {
    private __id: string = null;
    public _parent: any;
    public _children: object = {};

    public constructor(parent: any) {
        this._parent = parent;
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
            "visible":                 subnode["visible"],
            "source/translate/x":      inport["translate/x"],
            "source/translate/y":      inport["translate/y"],
            "source/translate/z":      inport["translate/z"],
            "source/visible":          false,
            "destination/translate/x": subnode["translate/x"],
            "destination/translate/y": subnode["translate/y"],
            "destination/translate/z": subnode["translate/z"],
            "destination/visible":     false,
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
            "visible":                 subnode["visible"],
            "source/translate/x":      subnode["translate/x"],
            "source/translate/y":      subnode["translate/y"],
            "source/translate/z":      subnode["translate/z"],
            "source/visible":          false,
            "destination/translate/x": outport["translate/x"],
            "destination/translate/y": outport["translate/y"],
            "destination/translate/z": outport["translate/z"],
            "destination/visible":     false,
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

    public _create_group(node_params: object, parent: any): Group {
        const grp: Group = new Group(parent);
        grp.create(this.__to_group_params(node_params));
        return grp;
    }

    public _create_subnode(node_params, parent): SubNode {
        const subnode: SubNode = new SubNode(parent);
        subnode.create(this.__to_subnode_params(node_params));
        return subnode;
    }

    public _create_ports(
        ports: object[],
        subnode: SubNode,
        type: string,
        parent: Group
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
            const port: Port = new Port(parent);
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
        parent: Group
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
            const edge: Edge = new Edge(parent);
            edge.create( func(sub, port.read()) );
            output.push(edge);
        }
        return output;
    }

    public create(params: INodeParams): void {
        this.__id = params["id"];

        const node: object       = params.to_node(id);
        const inports: object[]  = params.to_inports();
        const outports: object[] = params.to_outports();

        const grp: Group       = this._create_group(params, this._parent);
        const subnode: SubNode = this._create_subnode(params, grp._item);
        const ips: Port[]      = this._create_ports(inports, subnode, "inport", grp._item);
        const ops: Port[]      = this._create_ports(outports, subnode, "outport", grp._item);

        this._children["group"]         = grp;
        this._children["subnode"]       = subnode;
        this._children["inports"]       = ips;
        this._children["outports"]      = ops;
        this._children["inport_edges"]  = this._create_port_edges(ips, subnode, "inport", grp._item);
        this._children["outport_edges"] = this._create_port_edges(ops, subnode, "outport", grp._item);
    }

    public update(params: Params): void {
        const node_params: object = params.to_node(this.__id);
        const group: Group        = this._children["group"];
        const subnode: SubNode    = this._children["subnode"];
        const inports: Port[]     = this._children["inports"];
        const outports: Port[]    = this._children["outports"];

        group.update(this.__to_group_params(node_params));
        subnode.update(this.__to_subnode_params(node_params));
        for (const port of inports) {
            let temp: object = params.to_inport(port.read()["id"]);
            temp = this.__to_port_params(temp);
            port.update(temp);
        }
        for (const port of outports) {
            let temp: object = params.to_outport(port.read()["id"]);
            temp = this.__to_port_params(temp);
            port.update(temp);
        }
    }
}
