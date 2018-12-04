import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import { IPrimitive } from "./primitive_base";
import { Component } from "./component";
import { ISceneParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Scene extends Component {
    public _camera: any;
    public _controls: any;
    public _light: any;
    public _renderer: any;
    public _width: number;
    public _height: number;

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
    }

    public render(element: any, window: any) {
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._renderer.setSize(this._width, this._height);
        this._renderer.setClearColor(0x141414);
        this._renderer.setPixelRatio(window.devicePixelRatio);

        // mount scene
        const elem = document.getElementById("dag-pane");
        element.appendChild(this._renderer.domElement);
    }

    public render_update() {
        this._controls.update();
        this._renderer.render(this.parent.three_item, this._camera);
    }

    public create(params: ISceneParams, parent: any): void {
        this._width = params["width"];
        this._height = params["height"];
        super.create(params, parent);

        this.create_light();
        this.create_camera();
    }

    public update(params: ISceneParams): void {
        // pass
    }
}
