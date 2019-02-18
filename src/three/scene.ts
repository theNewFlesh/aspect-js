import * as _ from "lodash";
import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import { Component } from "./component";
import { ISceneParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * A Scene component is responsible for containing Graph components.
 * It is the principle component rendered by the DAG.
 */
export class Scene extends Component {
    /**
     * "scene"
     */
    public _class: string = "scene";

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
    public _renderer: any;

    /**
     * Window width
     */
    public _width: number;

    /**
     * Window height
     */
    public _height: number;

    /**
     * Casts rays from the camera and mouse coordinates and checks for ThreeJS
     * item intersections.
     */
    public _raycaster: THREE.Raycaster;

    /**
     * Current mouse coordinates. Object with x, y coordinates.
     */
    public _mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

    /**
     * Event handler for mouse movements. Assigns mouse coordinates to _mouse
     * member.
     * @returns Event handler
     */
    public get on_mouse_move() {
        return function (event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this._mouse.x = (event.clientX / this._width) * 2 - 1;
            this._mouse.y = -(event.clientY / this._height) * 2 + 1;

            const ids: string[] = this.get_selected_ids();
            console.log(ids);
        }.bind(this);
    }

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
        // controls.mouseButtons = {
        //     ORBIT: THREE.MOUSE.LEFT,
        //     ZOOM: THREE.MOUSE.RIGHT,
        //     PAN: THREE.MOUSE.MIDDLE
        // };
        this._controls = controls;
        this._camera = camera;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 6;

        camera.lookAt(this.parent.three_item.position);
    }

    /**
     * Get ids of items which intersect the mouse selection ray
     * @returs Array of ids
     */
    public get_selected_ids(): string[] {
        const pos: any = this._camera.position;
        const origin: THREE.Vector3 = new THREE.Vector3(pos.x, pos.y, pos.z);

        // update the selection ray with the camera and mouse position
        this._raycaster = new THREE.Raycaster(origin);
        this._raycaster.setFromCamera(this._mouse, this._camera);

        // calculate meshes intersecting the selection ray
        const selected = this._raycaster.intersectObjects(this.parent.three_item.children, true);
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

        window.addEventListener("mousemove", this.on_mouse_move, false);
    }

    /**
     * Rerender ThreeJS scene.
     */
    public render_update() {
        this._controls.update();
        this._renderer.render(this.parent.three_item, this._camera);
    }

    /**
     * Returns an object with a name field.
     */
    public get _default_params(): ISceneParams {
        return {
            "name": this._class,
        };
    }

    /**
     * Creates scene component from given params
     * @param params Scene params
     * @param parent Object with THREE.Scene as its three_item
     */
    public create(params: ISceneParams, parent: any): void {
        this._width = params["session/width"];
        this._height = params["session/height"];
        super.create(params, parent);

        this.create_light();
        this.create_camera();
    }

    /**
     * Update component with params.
     * Currently does nothing.
     * @param params Scene params
     */
    public update(params: ISceneParams): void {
        // pass
    }
}
