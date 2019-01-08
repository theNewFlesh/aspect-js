import * as _ from "lodash";
import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import { Component } from "./component";
import { ISceneParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Scene extends Component {
    public _class: string = "scene";
    public _camera: any;
    public _controls: any;
    public _light: any;
    public _renderer: any;
    public _width: number;
    public _height: number;
    public _raycaster: THREE.Raycaster;
    public _mouse: THREE.Vector2 = new THREE.Vector2(0, 0);

    public get on_mouse_move() {
        return function(event) {
            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components

            this._mouse.x = (event.clientX / this._width) * 2 - 1;
            this._mouse.y = -(event.clientY / this._height) * 2 + 1;

            const ids: string[] = this.get_selected_ids();
            console.log(ids);
        }.bind(this);
    }

    public create_light() {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0 , 6);
        this.three_item.add(light);
        this._light = light;
    }

    public create_camera() {
        const aspect: number =  this._width / this._height;
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

    public get_selected_ids(): string[] {
        const pos: any = this._camera.position;
        const origin: THREE.Vector3 = new THREE.Vector3(pos.x, pos.y, pos.z);

        // update the picking ray with the camera and mouse position
        this._raycaster = new THREE.Raycaster(origin);
        this._raycaster.setFromCamera(this._mouse, this._camera);

        // calculate meshes intersecting the picking ray
        const selected = this._raycaster.intersectObjects(this.parent.three_item.children, true);
        const output: string[] = _.uniq(_.map(selected, x => x.object["component_id"]));
        return output;
    }

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

    public render_update() {
        this._controls.update();
        this._renderer.render(this.parent.three_item, this._camera);
    }

    public get _default_params(): ISceneParams {
        return {
            "name": this._class,
        };
    }

    public create(params: ISceneParams, parent: any): void {
        this._width = params["session/width"];
        this._height = params["session/height"];
        super.create(params, parent);

        this.create_light();
        this.create_camera();
    }

    public update(params: ISceneParams): void {
        // pass
    }
}
