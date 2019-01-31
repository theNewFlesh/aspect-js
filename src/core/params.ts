import * as _ from "lodash";
import { Scaffold } from "./scaffold";
import {
    ISceneParams,
    IEdgeParams,
    INodeParams,
    IPortParams,
} from "./iparams";
// -----------------------------------------------------------------------------

/**
 * The Params class is responsible for all transforms applied to an Aspect
 * scene description. It transforms a flat object into a Scaffold (a table of
 * rows, one per key). Methods transform data in this table, convert it to flat
 * object and then to a new Scaffold.
 * <p></p>
 * Its constructor receives a scene object and internally creates a new Scaffold
 * from it. This class is hygenic. That means that every method applies a
 * transformation to the classes current data and supplies this to a new Params
 * instance. This design ensures that Params instances are functionally stateless.
 */
export class Params {
    public constructor(data: object) {
        this.__data = new Scaffold().from_object(data);
    }

    private __data: Scaffold;

    /**
     * Filters rows by component type and outputs Array of component
     * compatible objects
     * @param type Component type (scene, graph, node, inport, outport, edge)
     * @returns Array of component objects
     */
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
            .filter(x => x.match(regex), "key")
            .assign(x => x.key.match(regex)[1], "id")
            .group_by(x => x.to_object(), "id")
            .to_array();
        const output: object[] = [];
        for (const port of data) {
            output.push(new Params(port)
                .strip_headers()
                .strip_display()
                .to_object()
            );
        }
        return output;
    }
    // -------------------------------------------------------------------------

    /**
     * Params as a single object
     */
    public to_object(): object {
        return this.__data.to_object();
    }

    /**
     * Params as an array of row objects
     */
    public to_array(): object[] {
        return this.__data.to_array();
    }

    /**
     * Prints data to console
     */
    public print(): void {
        this.__data.print();
    }

    /**
     * Number of rows of data
     */
    public get length(): number {
        return _.keys(this.to_object()).length;
    }

    /**
     * Updates data with data from given object
     * @param dict Data to be assigned
     * @returns Params updated with dict data
     */
    public update(dict: object): Params {
        const data: object = Object.assign(this.to_object(), dict);
        return new Params(data);
    }

    /**
     * Subtracts given dict from data
     * @param dict Data to be subtracted
     * @param full Delete component's children
     * @returns Params minus dict data
     */
    public subtract(dict: object, full: boolean = true): Params {
        const temp: Params = new Params(dict);
        const ids: string[] = temp.to_ids();
        const headers: string[] = _.map(ids, id => temp.to_key_header(id));
        let drop_re: string = headers.join("|");
        if (!full) {
            drop_re = "(" + drop_re + ")(?!inport|outport|node|edge|graph|scene)";
        }

        const data: object = this.__data
            .filter(x => !x.match(drop_re), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Validates that all given ids are in Params
     * @param ids Array of id strings
     * @throws Error if id doesn't exist
     */
    public ids_exist(ids: string[]): void {
        const extant: string[] = this.to_ids();
        for (const id of ids) {
            if (!extant.includes(id)) {
                throw new Error(`id: ${id} does not exist`);
            }
        }
    }

    /**
     * Strips out header fields from keys. For instance,
     * "/scene_001/graph_001/node_001/id" becomes "id".
     * @returns Params without header fields in its keys
     */
    public strip_headers(): Params {
        const regex: RegExp = new RegExp(".*(inport|outport|node|edge|graph|scene)_.*?\/");
        const data: object = this.__data
            .assign(x => x.key.replace(regex, ""), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Removes all keys in which the display field is found
     * @returns Params without display keys
     */
    public strip_display(): Params {
        const regex: RegExp = new RegExp(".*display\/");
        const data: object = this.__data
            .assign(x => x.key.replace(regex, ""), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * A unique Array of all the ids found in Params
     */
    public to_ids(): string[] {
        const data: object[] = this.__data
            .filter(x => x.match("\/id$"), "key")
            .dropna("value", "any")
            .to_array();
        let output: string[] = data.map(x => x["value"]);
        output = _.uniq(output);
        return output;
    }

    /**
     * Filters Params values by a given list of ids
     * @param ids An Array of id strings
     * @returns Params with rows that match one of the given ids
     */
    public filter_ids(ids: string[]): Params {
        const data: object = this.__data
            .filter(x => ids.includes(x), "value")
            .to_object();
        return new Params(data);
    }

    /**
     * Determines whether component id is found in values
     * @param id A string indicating a components unique id
     */
    public has_component(id: string): boolean {
        return this.to_ids().includes(id);
    }

    /**
     * Removes keys that do not indicate a component's id (ie the don't end in "id")
     * @returns Params of only ids
     */
    public drop_non_ids(): Params {
        const data: object = this.__data
            .dropna("key")
            .filter(x => x.match(".*\/id$"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Appends header information to given id
     * @param id Component id
     * @returns Key
     * <p></p>
     * <b>Example</b>
     * <pre>
     * >>> new Params(data).to_key_header("node_001");
     * "/scene_001/graph_001/node_001/"
     * </pre>
     */
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

    /**
     * Create id keys and append them to data if they do not exist
     * @returns Params in which all components have id keys
     */
    public resolve_ids(): Params {
        const regex: RegExp = new RegExp("(inport|outport|node|edge|graph|scene)");
        const data: object = this.to_object();
        const keys: string[] = _.keys(data);
        for (const key of keys) {
            let id_key: any = _.filter(key.split("/"), x => x.match(regex));
            const id: string = id_key[id_key.length - 1];
            id_key = _.join(id_key, "/") + "/id";
            if (id_key.match(".*_.*")) {
                if (!keys.includes(id_key)) {
                    data[id_key] = id;
                }
            }
        }
        return new Params(data);
    }

    /**
     * Filters out display keys except for those indicated in keep_re
     * @param keep_re Regular expression indicating display keys to be preserved
     * @returns Params without certain display keys
     */
    public drop_display(keep_re: string = null): Params {
        let regex: any = "display\/";
        if (keep_re !== null) {
            regex += `(?!${keep_re})`;
        }
        regex = new RegExp(regex);

        const data: object = this.__data
            .filter(x => !x.match(regex), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Finds keys that do not exist in given Params
     * @param params Params to diff from
     * @param keep_ids Ensure all components have id keys
     * @returns Params with keys not found in given Params
     */
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

    /**
     * Finds the id a component's parent
     * @param id Component id
     * @returns Parent id
     */
    public get_parent_id(id: string): string {
        return this.__data.filter(x => x.match("\/id$"), "key")
            .filter(x => !x.match("source/id$|destination/id$"), "key")
            .assign(x => _.split(x.key, "/").slice(-3, -2)[0], "parent")
            .filter(x => x.match(id), "value")
            .to_array()[0]["parent"];
    }

    /**
     * Extracts proper component data given a component id
     * @param id Component id
     * @returns Object with appropriate component data
     */
    public to_component(id: string): object {
        const type: string = _.split(id, "_")[0];

        if (type === "scene") {
            return this.to_scene(id);
        }
        else if (type === "graph") {
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

    /**
     * Filters data according to a given component id
     * @param id Component id
     * @param full Whether to include the component's children
     * @returns Params only containing given component
     */
    public filter_component(id: string, full: boolean = false): Params {
        const type: string = _.split(id, "_")[0];

        if (type === "scene") {
            return this.filter_scene(id, full);
        }
        else if (type === "graph") {
            return this.filter_graph(id, full);
        }
        else if (type === "node") {
            return this.filter_node(id, full);
        }
        else if (type === "edge") {
            return this.filter_edge(id);
        }
        else if (type === "inport") {
            return this.filter_inport(id);
        }
        else if (type === "outport") {
            return this.filter_outport(id);
        }
        else {
            throw new Error(`invalid id: ${id}`);
        }
    }

    /**
     * Filters data according to a given component ids
     * @param ids Array of component ids
     * @param full Whether to include each component's children
     * @returns Params only containing given components
     */
    public filter_components(ids: string[], full: boolean = false): Params {
        const data: object = {};
        for (const id of ids) {
            Object.assign(data, this.filter_component(id, full).to_object());
        }
        return new Params(data);
    }

    /**
     * Gets dependencies of given component. As in its ancestors, ports (if its
     * a node) and nodes (if its an edge).
     * @param id Component id
     * @param full Whether to include the component's ancestors
     */
    public get_dependencies(id: string, full: boolean = true): string[] {
        let output: string[] = [];

        if (full) {
            output = new Params(this.to_component(id)).to_ids();
            const key: string = this.__data
                .filter(x => x.match(id + "\/id$"), "key")
                .to_array()[0]["key"];
            for (const ancestor of _.split(key, "/")) {
                if (this.has_component(ancestor)) {
                    output.push(ancestor);
                }
            }
        }

        let ports: string[] = [];
        const type: string = _.split(id, "_")[0];
        if (["node"].includes(type)) {
            const inports: string[] = this.filter_node(id, true).filter_inports().to_ids();
            const outports: string[] = this.filter_node(id, true).filter_outports().to_ids();
            ports = _.concat(inports, outports);
        }

        const ids: any = new Params(this.to_component(id))
            .__data.filter(x => x.match("(source|destination)\/id$"), "key")
            .to_object();
        output = _.concat(output, _.values(ids), ports);
        return output;
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given scene id
     * @param scene_id Scene id
     * @param full WHether to include child components
     * @returns Params with only keys matching the given scene
     */
    public filter_scene(scene_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => !x.match("graph|node|edge|inport|outport"), "key");
        if (!full) {
            data = data.filter(x => !x.match("graph|node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    /**
     * Creates an ISceneParams object for a Scene component
     * @param scene_id Scene id
     * @returns Object for Scene component
     */
    public to_scene(scene_id: string): ISceneParams {
        return this.filter_scene(scene_id).strip_headers().to_object();
    }

    /**
     * Id of the scene in data
     */
    public get_scene_id(): string {
        return _.split(_.keys(this.to_object())[0], "/")[0];
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given graph id
     * @param graph_id Graph id
     * @param full Whether to include child components
     * @returns Params with only keys matching the given graph
     */
    public filter_graph(graph_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match(graph_id + "\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    /**
     * Filter keys as to only include graph components
     * @param full Include child components
     * @returns Params with only graph compoents
     */
    public filter_graphs(full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match("graph_.*?\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    /**
     * Creates an IGraphParams object for a Graph component
     * @param graph_id Graph id
     * @returns Object for Graph component
     */
    public to_graph(graph_id: string): object {
        return this.filter_graph(graph_id)
            .strip_headers()
            .strip_display()
            .to_object();
    }

    /**
     * Creates an Array of IGraphsParam objects for all graphs in data
     * @returns Array of graph params
     */
    public to_graphs(): object[] {
        return this._to_children("graph");
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given node id
     * @param node_id Node id
     * @param full Whether to include child components
     * @returns Params with only keys matching the given node
     */
    public filter_node(node_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match(node_id + "\/"), "key")
            .filter(x => !x.match("edge"), "key");
        if (!full) {
            data = data.filter(x => !x.match("inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    /**
     * Filter keys as to only include node components
     * @param full Include child components
     * @returns Params with only node compoents
     */
    public filter_nodes(full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match("node.*?\/"), "key")
            .filter(x => !x.match("edge"), "key");
        if (!full) {
            data = data.filter(x => !x.match("inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    /**
     * Creates an INodeParams object for a node component
     * @param node_id Node id
     * @returns Object for Node component
     */
    public to_node(node_id: string): INodeParams {
        return this.filter_node(node_id)
            .strip_headers()
            .strip_display()
            .to_object();
    }

    /**
     * Creates an Array of INodeParam objects for all nodes in data
     * @returns Array of node params
     */
    public to_nodes(): INodeParams[] {
        return this._to_children("node");
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given edge id
     * @param edge_id Edge id
     * @param full Whether to include child components
     * @returns Params with only keys matching the given edge
     */
    public filter_edge(edge_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(edge_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Filter keys as to only include edge components
     * @returns Params with only edge compoents
     */
    public filter_edges(): Params {
        const data: object = this.__data
            .filter(x => x.match("edge.*?\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Creates an IEdgeParams object for a edge component
     * @param edge_id Edge id
     * @returns Object for Edge component
     */
    public to_edge(edge_id: string): IEdgeParams {
        return this.filter_edge(edge_id)
            .strip_headers()
            .strip_display()
            .to_object();
    }

    /**
     * Creates an Array of IEdgeParam objects for all edges in data
     * @returns Array of edge params
     */
    public to_edges(): IEdgeParams[] {
        return this._to_children("edge");
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given inport id
     * @param inport_id Inport id
     * @param full Whether to include child components
     * @returns Params with only keys matching the given inport
     */
    public filter_inport(inport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(inport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Filter keys as to only include inport components
     * @returns Params with only inport compoents
     */
    public filter_inports(): Params {
        const data: object = this.__data
            .filter(x => x.match("inport_.*?\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Creates an IPortParams object for an Inport component
     * @param inport_id Inport id
     * @returns Object for Inport component
     */
    public to_inport(inport_id: string): IPortParams {
        return this.filter_inport(inport_id)
            .strip_headers()
            .strip_display()
            .to_object();
    }

    /**
     * Creates an Array of IPortParam objects for all inports in data
     * @param subtypes Which type of ports to include
     * @returns Array of port params
     */
    public to_inports(
        subtypes: string[] = ["both", "none", "widget", "node"]
    ): IPortParams[] {
        let output: object[] = this._to_children("inport");
        output = _.filter(output, x => subtypes.includes(x["subtype"]));
        return output;
    }
    // -------------------------------------------------------------------------

    /**
     * Filters keys by ones that match given outport id
     * @param outport_id Outport id
     * @param full Whether to include child components
     * @returns Params with only keys matching the given outport
     */
    public filter_outport(outport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match(outport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Filter keys as to only include outport components
     * @returns Params with only outport compoents
     */
    public filter_outports(): Params {
        const data: object = this.__data
            .filter(x => x.match("outport_.*?\/"), "key")
            .to_object();
        return new Params(data);
    }

    /**
     * Creates an IOutportParams object for a ouTport component
     * @param outport_id Outport id
     * @returns Object for Outport component
     */
    public to_outport(outport_id: string): IPortParams {
        return this.filter_outport(outport_id)
            .strip_headers()
            .strip_display()
            .to_object();
    }

    /**
     * Creates an Array of IPortParam objects for all outports in data
     * @returns Array of port params
     */
    public to_outports(): IPortParams[] {
        return this._to_children("outport");
    }
    // -------------------------------------------------------------------------

    /**
     * Creates specialized output for NodePane Vue component
     * @returns Array containing a data and an index
     */
    public to_node_pane(): any[] {
        const ids: string[] = this.filter_nodes().to_ids();
        const data: object[] = [];
        let i: number = 0;
        for (const id of ids) {
            const node: object = this.to_node(id);
            const rows: object[] = this.filter_node(id, true)
                .drop_display("name|options|widget")
                .to_inports(["both", "widget"]);

            for (const row of rows) {
                const datum: object = {};
                datum["name"] = row["name"];
                datum["value"] = row["value"];
                datum["default_value"] = row["default_value"];
                datum["widget"] = row["widget"];
                datum["lock"] = row["lock"];
                // datum["node/id"]       = node["id"];
                datum["node/name"] = node["name"];
                // datum["node/function"] = node["function"];
                // datum["node/module"]   = node["module"];
                // datum["node/info"]     = node["info"];
                // datum["node/version"]  = node["version"];
                // datum["node/order"]    = node["order"];
                // datum["node/selected"] = node["selected"];
                // datum["node/visible"]  = node["visible"];
                // TODO: remove me and fixe widgets
                datum["display"] = { "options": row["options"][0] };
                datum["__index"] = i;
                data.push(datum);
                i++;
            }
        }

        const cols: string[][] = [
            ["node/name"],
            [
                "name",
                "value",
                "default_value",
                "widget",
                "lock",
            ]
        ];
        const index: object[] = [];
        for (const col of cols) {
            index.push({
                columns: col,
                group: col[0],
                indent: true,
                hide_headers: false,
            });
        }
        return [data, index];
    }
}
