import * as _ from "lodash";
import * as tiny_color from "tinycolor2";
import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import * as fancy_frame from "../core/fancy_frame";
import { Params } from "../core/params";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import * as test_tools from "../../test/test_tools";
import * as test_scene from "../../test/test_scene";
import { DAG } from "./dag";
import { Node } from "./node";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export class Scene {
    public constructor(params: any) {
        this.width = params.width;
        this.height = params.height;
        this.scene = new THREE.Scene();
        this.create_light();
        this.create_camera();

        this.node  = new Node(this.scene);
        this.node.create(test_scene.scene, "n0");

        // this.dag = new DAG(this.scene);
        // this.dag.create(test_scene.scene);
    }

    public scene: any;
    public light: any;
    public camera: any;
    public renderer: any;
    public controls: any;
    public width: number;
    public height: number;
    public dag: any;
    public node: any;

    public get aspect_ratio(): number {
        return this.width / this.height;
    }

    public create_light() {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 0 , 6);
        this.scene.add(light);
        this.light = light;
    }

    public create_camera() {
        const w = this.width;
        const h = this.height;
        // create camera
        const camera = new THREE.OrthographicCamera(
            -5 * this.aspect_ratio,
            10 * this.aspect_ratio,
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
        this.controls = controls;
        this.camera = camera;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 6;
    }

    public render(element: any) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x141414);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // mount scene
        const elem = document.getElementById("scene");
        element.appendChild(this.renderer.domElement);
    }

    public render_update() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    public get THREE() {
        return THREE;
    }

    public get three_tools() {
        return three_tools;
    }

    public get test_tools() {
        return test_tools;
    }

    public get test_scene() {
        return test_scene.scene;
    }

    public get tools() {
        return tools;
    }

    public get fancy_frame() {
        return fancy_frame;
    }

    public get params() {
        return Params;
    }

    public get tiny_color() {
        return tiny_color;
    }
}
