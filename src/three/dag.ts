import * as _ from "lodash";
import * as tools from "../core/tools";
import { Mouse } from "../core/mouse";
import * as three_tools from "./three_tools";
import * as test_scene from "../../test/test_scene";
import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import { Scene } from "./scene";
import { Graph } from "./graph";
import { Edge } from "./edge";
import { Node } from "./node";
import { Inport } from "./inport";
import { Outport } from "./outport";
import { Params } from "../core/params";
import { Scaffold } from "../core/scaffold";
import { Scheduler } from "../core/scheduler";
import { IPortParams, INodeParams, IEdgeParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Class for generating editing and rendering a Directed Acyclic Graph in ThreeJS
 * DAG's consist of a Scene with one or more Graphs inside of which are Node,
 * which are connected to each other via Edges.
 */
export class DAG {
    public constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._mouse = new Mouse(this);
    }

    public _width: number;
    public _height: number;

    // TODO: remove these dev methods
    public get THREE() { return THREE; }
    public get three_tools() { return three_tools; }
    public get test_scene() { return test_scene.scene; }
    public get tools() { return tools; }
    public get scaffold() { return Scaffold; }
    public get params() { return Params; }

    /**
     *  The id of the DAG instance
     */
    public _id: string;

    /**
     * The state of the DAG as defined by a Params instance
     */
    public _state: Params = new Params({});

    /**
     * Needed for instantiating a Scene component
     */
    public parent: any;

    /**
     * Lut of child components of the DAG
     */
    public _children: object = {};

    /**
     * A THREE.Scene instance, needed by all components
     */
    public three_item: any;

    /**
     * Scene component
     */
    private __scene: Scene;

    /**
     * Mouse
     */
    public _mouse: Mouse;

    /**
     * ThreeJS orthographic camera used for viewing components
     */
    public _camera: any;

    /**
     * ThreeJS camera controls
     */
    public _controls: any;

    /**
     * ThreeJS light
     */
    public _light: any;

    /**
     * ThreeJS renderer
     */
    public _renderer: THREE.WebGLRenderer;

    public _hightlight: string[] = [];
    public _selection: string[] = [];
    public _selection_mode: string = "node";
    // -------------------------------------------------------------------------

    /**
     * Creates ThreeJS directional light and assigns it to light member.
     */
    public create_light() {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0, 6);
        this.three_item.add(light);
        this._light = light;
    }

    /**
     * Creates ThreeJS orthographic camera
     */
    public create_camera() {
        const aspect: number = this._width / this._height;
        const camera = new THREE.OrthographicCamera(
            -5 * aspect,
            10 * aspect,
            10,
            -10,
            0,
            10
        );

        // create view controls
        const orbit = new CreateOrbitControls(THREE);
        const controls = new orbit(camera);
        controls.mouseButtons = {
            ORBIT: null,
            ZOOM: THREE.MOUSE.MIDDLE,
            PAN: THREE.MOUSE.RIGHT,
        };
        this._controls = controls;
        this._camera = camera;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 6;

        camera.lookAt(this.three_item.position);
    }

    /**
     * Render a ThreeJS scene inside a given element.
     * @param element DOM element which houses ThreeJS scene
     * @param window DOM window object
     */
    public render(element: any, window: any) {
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setSize(this._width, this._height);
        this._renderer.setClearColor(0x141414);
        this._renderer.setPixelRatio(window.devicePixelRatio);

        // mount scene
        const elem = document.getElementById("dag-pane");
        element.appendChild(this._renderer.domElement);

        window.addEventListener("mousemove", this._mouse.on_mouse_move, false);
        window.addEventListener("mousedown", this._mouse.on_mouse_down, false);
        window.addEventListener("mouseup", this._mouse.on_mouse_up, false);
    }

    /**
     * Rerender ThreeJS scene.
     */
    public render_update() {
        this._controls.update();
        this._renderer.render(this.three_item, this._camera);
    }
    // -------------------------------------------------------------------------

    /**
     * Determines whether DAG contains child component
     * @param id Component id
     */
    public has_child(id: string): boolean {
        return this._children.hasOwnProperty(id);
    }

    /**
     * Get a child component given a compoenent id
     * @param id Component id
     * @throws Error if id not found in children keys
     * @returns Child component of DAG
     */
    public get_child(id: string): any {
        if (!this.has_child(id)) {
            throw new Error(`id: ${id} child does not exist`);
        }
        return this._children[id];
    }

    /**
     * Assigns a component to children
     * @param id Component id
     * @param component Component
     */
    public set_child(id: string, component: any): void {
        this._children[id] = component;
    }

    /**
     * Calls delete method on child component and removes it from children
     * @param id Component id
     */
    public delete_child(id: string): void {
        this.get_child(id).delete();
        delete this._children[id];
    }

    /**
     * Returns a lut of child components
     */
    public get children(): object {
        return this._children;
    }

    /**
     * Searchs a params object and returns the discovered parent component of a
     * given child component id
     * @param params Params object to be searched
     * @param id Child component id
     * @returns Component
     */
    public _get_parent(params: Params, id: string): any {
        const pid: string = params.get_parent_id(id);
        return this.get_child(pid);
    }

    /**
     * Translates port position relative to node position
     * @param node Node params object
     * @param port Port params object
     * @returns Port position in world-space coordinates
     */
    public _resolve_port_translation(node: INodeParams, port: IPortParams): object {
        const output: object = {
            "translate/x": node["translate/x"] + port["translate/x"],
            "translate/y": node["translate/y"] + port["translate/y"],
            "translate/z": node["translate/z"] + port["translate/z"],
        };
        return output;
    }

    /**
     * Resolves the world-space coordinates of an Edge's source and destination
     * fields
     * @param params Params that contain edge and its dependencies
     * @param edge_params Edge params
     * @param source_id Component id of a Node or a Port the edge starts at
     * @param destination_id Component id of a Node or a Port the edge ends at
     * @throws Error if source or destination components do not exist
     * @returns Edge params with correct source and destination fields
     */
    public _resolve_edge_params(
        params: Params,
        edge_params: object,
        source_id: string,
        destination_id: string
    ): IEdgeParams {

        let src: object = this.get_child(source_id).read();
        if (src["type"] === "node") {
            // set edge source to center of node
            src = {
                "translate/x": 0,
                "translate/y": 0,
                "translate/z": 0,
            };
        }
        else if (src["type"] === "outport") {
            if (!this.has_child(source_id)) {
                throw new Error(`child does not exist. id: ${source_id}`);
            }
            // assign source new x, y, z coordinates
            src = this._resolve_port_translation(
                this._get_parent(params, source_id).read(),
                this.get_child(source_id).read(),
            );
        }

        let dst: object = this.get_child(destination_id).read();
        if (dst["type"] === "node") {
            // set edge destination to center of node
            dst = {
                "translate/x": 0,
                "translate/y": 0,
                "translate/z": 0,
            };
        }
        else if (dst["type"] === "inport") {
            if (!this.has_child(destination_id)) {
                throw new Error(`child does not exist. id: ${destination_id}`);
            }
            // assign destination new x, y, z coordinates
            dst = this._resolve_port_translation(
                this._get_parent(params, destination_id).read(),
                this.get_child(destination_id).read(),
            );
        }

        const output: IEdgeParams = {
            "id": edge_params["id"],
            "source/id": source_id,
            "source/translate/x": src["translate/x"],
            "source/translate/y": src["translate/y"],
            "source/translate/z": src["translate/z"],
            "destination/id": destination_id,
            "destination/translate/x": dst["translate/x"],
            "destination/translate/y": dst["translate/y"],
            "destination/translate/z": dst["translate/z"],
        };

        // update output with edge_params
        for (const key of _.keys(edge_params)) {
            if (!output.hasOwnProperty(key)) {
                output[key] = edge_params[key];
            }
        }
        return output;
    }

    /**
     * Creates an InPort or OutPort and assigns it to children.
     * Short circuits if inport subtype is not "node" or "both".
     * @param params Params that contain port and its parent
     * @param id Port id
     * @param type Port type
     */
    public _create_port(params: Params, id: string, type: string): void {
        const pid: string = params.get_parent_id(id);
        let count: number;
        let temp: object;
        let y: number = 2;
        let port: any;

        if (type === "inport") {
            // get number of ports of subtype "both" or "node"
            count = params.filter_node(pid, true)
                .to_inports(["both", "node"])
                .length;

            // get port params
            temp = params.to_inport(id);

            // cancel if port subtype is not meant to be displayed
            if (!["node", "both"].includes(temp["subtype"])) {
                return;
            }
            port = new Inport(this.three_item);
        }
        else if (type === "outport") {
            count = params.filter_node(pid, true).to_outports().length;
            temp = params.to_outport(id);
            y *= -1;
            port = new Outport(this.three_item);
        }

        // offset port x translation based on count of ports
        let x_offset: number = 0;
        if (count > 1) {
            x_offset = (count / 2.0) + 0.5;
        }

        // influence port x offset by port order
        const pos: object = {
            "translate/x": temp["order"] - x_offset,
            "translate/y": y,
        };
        Object.assign(temp, pos);

        // create port and assign it to children
        const parent: any = this._get_parent(params, id);
        port.create(temp, parent);
        this.set_child(id, port);
    }
    // -------------------------------------------------------------------------

    /**
     * Create a Scene component and assign it to children
     * @param params Params that contain scene
     * @param id Scene id
     */
    public _create_scene(params: Params, id: string): void {
        const item: object = params.to_scene(id);
        this.three_item = new THREE.Scene();
        const scene: Scene = new Scene(this.three_item);
        scene.create(item, this);
        this.set_child(id, scene);
        this.parent = scene;
        this.__scene = scene;
        this._id = id;

        this.create_light();
        this.create_camera();
    }

    /**
     * Update Scene component with new params
     * @param params Params that contain scene
     * @param id Scene id
     */
    public _update_scene(params: Params, id: string): void {
        this.get_child(id).update(params.to_scene(id));
    }
    // -------------------------------------------------------------------------

    /**
     * Create a Graph component and assign it to children
     * @param params Params that contain graph
     * @param id Graph id
     */
    public _create_graph(params: Params, id: string): void {
        const graph: Graph = new Graph(this.three_item);
        graph.create(params.to_graph(id), this.parent);
        this.set_child(id, graph);
    }

    /**
     * Update Graph component with new params
     * @param params Params that contain graph
     * @param id Graph id
     */
    public _update_graph(params: Params, id: string): void {
        this.get_child(id).update(params.to_graph(id));
    }
    // -------------------------------------------------------------------------

    /**
     * Create a Node component and assign it to children
     * @param params Params that contain node
     * @param id Node id
     */
    public _create_node(params: Params, id: string): void {
        const parent: any = this._get_parent(params, id);
        const node: Node = new Node(this.three_item);
        node.create(params.to_node(id), parent);
        this.set_child(id, node);
    }

    /**
     * Update Node component with new params
     * @param params Params that contain node
     * @param id Node id
     */
    public _update_node(params: Params, id: string): void {
        this.get_child(id).update(params.to_node(id));
    }
    // -------------------------------------------------------------------------

    /**
     * Creates an Edge component, by first resolving its params, then assigning
     * it to children
     * @param params Params that contain edge and its dependencies
     * @param id Edge id
     */
    public _create_edge(params: Params, id: string): void {
        let item: IEdgeParams = params.to_edge(id);
        item = this._resolve_edge_params(
            params,
            item,
            item["source/id"],
            item["destination/id"]
        );
        const parent: any = this._get_parent(params, id);

        const edge: Edge = new Edge(this.three_item);
        edge.create(item, parent);
        this.set_child(id, edge);
    }

    /**
     * Updates an Edge component with new params
     * @param params Params that contain edge and its dependencies
     * @param id Edge id
     */
    public _update_edge(params: Params, id: string): void {
        // update existing edge params with new edge params
        let edge_params: IEdgeParams = this.get_child(id).read();
        Object.assign(edge_params, params.to_edge(id));

        // resolve edge translate coordinates
        edge_params = this._resolve_edge_params(
            params,
            edge_params,
            edge_params["source/id"],
            edge_params["destination/id"]
        );

        // update edge
        this.get_child(id).update(edge_params);
    }
    // -------------------------------------------------------------------------

    /**
     * Create an Inport component and assign it to children
     * @param params Params that contain inport
     * @param id Inport id
     */
    public _create_inport(params: Params, id: string): void {
        this._create_port(params, id, "inport");
    }

    /**
     * Update InPort component with new params
     * @param params Params that contain node
     * @param id InPort id
     */
    public _update_inport(params: Params, id: string): void {
        this.get_child(id).update(params.to_inport(id));
    }
    // -------------------------------------------------------------------------

    /**
     * Create an OutPort component and assign it to children
     * @param params Params that contain outport
     * @param id OutPort id
     */
    public _create_outport(params: Params, id: string): void {
        this._create_port(params, id, "outport");
    }

    /**
     * Update OutPort component with new params
     * @param params Params that contain outport
     * @param id OutPort id
     */
    public _update_outport(params: Params, id: string): void {
        this.get_child(id).update(params.to_outport(id));
    }
    // -------------------------------------------------------------------------

    /**
     * Updates DAG with params fragment. Adds or edits DAG information.
     * Schedules update calls to affected children and updates state params upon
     * finishing.
     * @param fragment A piece of a full DAG description
     */
    public edit(fragment: object): void {
        // get new params state and creation/update schedule
        let scheduler: Scheduler = new Scheduler(this._state).edit(fragment, this);
        scheduler.print();
        scheduler = scheduler.remove_ignores();
        const state: Params = scheduler.to_state();
        const schedule: object[] = scheduler.to_schedule();

        // update child components according to commands
        for (const row of schedule) {
            const cmd: string = "_" + row["command"] + "_" + row["type"];
            this[cmd](state, row["id"]);
        }
        this._state = state;
    }

    /**
     * Deletes components from DAG from those found in fragment.
     * @param fragment A piece of a full DAG description containing component ids
     */
    public delete(fragment: object): void {
        // get new params state and deletion schedule
        let scheduler: Scheduler = new Scheduler(this._state).delete(fragment, this);
        scheduler.print();
        scheduler = scheduler.remove_ignores();
        const state: Params = scheduler.to_state();
        const schedule: object[] = scheduler.to_schedule();

        // delete children listed in schedule
        for (const row of schedule) {
            this.delete_child(row["id"]);
        }
        this._state = state;
    }

    /**
     * Destroy THREE.Scene, remove all chidlren and wipe state
     */
    public destroy(): void {
        this.three_item.remove(this.three_item.children[0]);
        this._children = {};
        this._state = new Params({});
    }
    // -------------------------------------------------------------------------

    /**
     * Get ids of items which intersect the mouse selection ray
     * @returs Array of ids
     */
    public get_selected_ids(): string[] {
        const pos: any = this._camera.position;
        const origin: THREE.Vector3 = new THREE.Vector3(pos.x, pos.y, pos.z);

        // update the selection ray with the camera and mouse position
        const raycaster: THREE.Raycaster = new THREE.Raycaster(origin);
        raycaster.setFromCamera(this._mouse._coordinates, this._camera);

        // calculate meshes intersecting the selection ray
        const selected = raycaster.intersectObjects(this.three_item.children, true);
        const temp: string[] = _.uniq(_.map(selected, x => x.object["component_id"]));

        // sort output by component type
        const types: string[] = ["node", "inport", "outport", "edge"];
        const output: string[] = [];
        for (const type of types) {
            for (const item of temp) {
                const head: string = item.split("_")[0];
                if (head === type) {
                    output.push(item);
                }
            }
        }

        return output;
    } 

}
