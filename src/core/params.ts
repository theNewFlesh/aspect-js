import * as _ from "lodash";
import { Scaffold } from "./scaffold";
import {
    ISceneParams,
    IEdgeParams,
    INodeParams,
    IPortParams,
} from "./iparams";
import { MeshLambertMaterial } from 'three';
// -----------------------------------------------------------------------------

export class Params {
    public constructor(data: object) {
        this.__data = new Scaffold().from_object(data);
    }

    private __data: Scaffold;

    public _to_children(type: string): object[] {
        let temp: Scaffold;
        if (type === "graph") {
            temp = this.filter_graph(".*?").__data;
        }
        else if (type === "node") {
            temp = this.filter_node(".*?").__data;
        }
        else if (type === "edge") {
            temp = this.filter_edge(".*?").__data;
        }
        else if (type === "inport") {
            temp = this.filter_inport(".*?").__data;
        }
        else if (type === "outport") {
            temp = this.filter_outport(".*?").__data;
        }
        const regex: RegExp = new RegExp(type + "_(.*?)\/");
        const data: object[] = temp
            .filter(x => x.match(regex),
            "key")
            .assign(x => x.key.match(regex)[1], "id")
            .group_by(x => x.to_object(), "id")
            .to_array();
        const output: object[] = [];
        for (const port of data) {
            output.push( new Params(port).strip_id().strip_display().to_object() );
        }
        return output;
    }
    // -------------------------------------------------------------------------

    public to_object(): object {
        return this.__data.to_object();
    }

    public to_array(): object[] {
        return this.__data.to_array();
    }

    public print(): void {
        this.__data.print();
    }

    public get length(): number {
        return _.keys(this.to_object()).length;
    }

    public update(dict: object): Params {
        const data: object = Object.assign(this.to_object(), dict);
        return new Params(data);
    }

    public strip_id(): Params {
        const regex: RegExp = new RegExp(".*(inport|outport|node|edge|graph|scene)_.*?\/");
        const data: object = this.__data
            .assign(x => x.key.replace(regex, ""), "key")
            .to_object();
        return new Params(data);
    }

    public strip_display(): Params {
        const regex: RegExp = new RegExp(".*display\/");
        const data: object = this.__data
            .assign(x => x.key.replace(regex, ""), "key")
            .to_object();
        return new Params(data);
    }

    public to_ids(): string[] {
        const data: object[] = this.__data
        .filter(x => x.match("\/id$"), "key")
        .dropna("value", "any")
        .to_array();
        let output: string[] = data.map(x => x["value"]);
        output = _.uniq(output);
        return output;
    }

    public has_component(id: string): boolean {
        return this.to_ids().includes(id);
    }

    public drop_non_ids(): Params {
        const data: object = this.__data
            .filter(x => x.key.match(".*\/id$"), "key")
            .to_object();
        return new Params(data);
    }

    public to_key_header(id: string): string {
        const data: object = this.__data
        .filter(x => x.match(id), "key")
        .to_object();
        if (_.keys(data).length === 0) {
            return null;
        }
        let output: string = _.keys(data)[0];
        output = output.match(".*" + id)[0] + "/";
        return output;
    }

    public resolve_ids(): Params {
        const regex: RegExp = new RegExp("(inport|outport|node|edge|graph|scene)");
        const data: object = this.to_object();
        const keys: string[] = _.keys(data);
        for (const key of keys) {
            let id_key: any = _.filter(key.split("/"), x => x.match(regex));
            const id: string = id_key[id_key.length - 1];
            id_key =  _.join(id_key, "/") + "/id";
            if (id_key.match(".*_.*")) {
                if (!keys.includes(id_key)) {
                    data[id_key] = id;
                }
            }
        }
        return new Params(data);
    }

    public drop_display(): Params {
        const data: object = this.__data
            .filter(x => !x.match("display\/"), "key")
            .to_object();
        return new Params(data);
    }

    public diff(params: Params, keep_ids: boolean = true): Params {
        const a: object = this.to_object();
        const b: object = params.to_object();

        const data: object = {};
        for (const key of _.keys(a)) {
            if (a[key] !== b[key]) {
                data[key] = a[key];
            }
        }

        if (_.keys(data).length === 0) {
            return new Params({});
        }

        if (keep_ids) {
            const key_re: RegExp = new RegExp("(.*(?:inport|outport|node|edge|graph|scene)_.*?\/)");
            const val_re: RegExp = new RegExp(".*((?:inport|outport|node|edge|graph|scene)_.*?)\/");
            for (const key of _.keys(data)) {
                if (key.match(key_re)) {
                    const temp: string = key.match(key_re)[1] + "id";
                    if (!data.hasOwnProperty(temp)) {
                        data[temp] = key.match(val_re)[1];
                    }
                }
            }
        }

        return new Params(data);
    }

    public get_parent_id(id: string): string {
        return this.__data.filter(x => x.match("\/id$"), "key")
            .filter(x => !x.match("source/id$|destination/id$"), "key")
            .assign(x => _.split(x.key, "/").slice(-3, -2)[0], "parent")
            .filter(x => x.match(id), "value")
            .to_array()[0]["parent"];
    }

    public to_component(id: string): object {
        const type: string = _.split(id, "_")[0];

        if (type === "scene"){
            return this.to_scene(id);
        }
        else if (type === "graph"){
            return this.to_graph(id);
        }
        else if (type === "node") {
            return this.to_node(id);
        }
        else if (type === "edge") {
            return this.to_edge(id);
        }
        else if (type === "inport") {
            return this.to_inport(id);
        }
        else if (type === "outport") {
            return this.to_outport(id);
        }
        else {
            throw new Error(`invalid id: ${id}`);
        }
    }

    public get_dependencies(id: string): string[] {
        const ids: string[] = new Params(this.to_component(id)).to_ids();

        const key: string = this.__data
        .filter(x => x.match(id + "\/id$"), "key")
        .to_array()[0]["key"];
        for (const ancestor of _.split(key, "/")) {
            if (this.has_component(ancestor)) {
                ids.push(ancestor);
            }
        }
        return ids;
    }
    // -------------------------------------------------------------------------

    public filter_scene(id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => !x.match("graph|node|edge|inport|outport"), "key")
        if (!full) {
            data = data.filter(x => !x.match("graph|node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    public to_scene(id: string): ISceneParams {
        return this.filter_scene(id).strip_id().to_object();
    }

    public get_scene_id(): string {
        return _.split( _.keys( this.to_object() )[0], "/")[0];
    }
    // -------------------------------------------------------------------------

    public filter_graph(graph_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match(graph_id + "\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    public to_graph(graph_id: string): object {
        return this.filter_graph(graph_id)
            .strip_id()
            .strip_display()
            .to_object();
    }

    public to_graphs(): object[] {
        return this._to_children("graph");
    }
    // -------------------------------------------------------------------------

    public filter_node(node_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match(node_id + "\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    public to_node(node_id: string): INodeParams {
        return this.filter_node(node_id)
            .strip_id()
            .strip_display()
            .to_object();
    }

    public to_nodes(): INodeParams[] {
        return this._to_children("node");
    }
    // -------------------------------------------------------------------------

    public filter_edge(edge_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(edge_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_edge(edge_id: string): IEdgeParams {
        return this.filter_edge(edge_id).strip_id().strip_display().to_object();
    }

    public to_edges(): IEdgeParams[] {
        return this._to_children("edge");
    }
    // -------------------------------------------------------------------------

    public filter_inport(inport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(inport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_inport(inport_id: string): IPortParams {
        return this.filter_inport(inport_id)
            .strip_id()
            .strip_display()
            .to_object();
    }

    public to_inports(): IPortParams[] {
        return this._to_children("inport");
    }
    // -------------------------------------------------------------------------

    public filter_outport(outport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(outport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_outport(outport_id: string): IPortParams {
        return this.filter_outport(outport_id)
            .strip_id()
            .strip_display()
            .to_object();
    }

    public to_outports(): IPortParams[] {
        return this._to_children("outport");
    }
}
