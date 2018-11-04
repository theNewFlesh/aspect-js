import * as _ from "lodash";
import * as THREE from "three";
import * as CreateOrbitControls from "three-orbit-controls";
import { Cube } from "./cube";
import { Cylinder } from "./cylinder";
import { Text } from "./text";
import { TextBox } from "./text_box";
import { Sprite } from "./sprite";
// -----------------------------------------------------------------------------

export class Scene {
    public constructor(params: any) {
        this.width = params.width;
        this.height = params.height;
        this.create_scene();
        this.create_light();
        this.create_camera();
        this.cylinder = new Cylinder(this.scene);
        this.cylinder.create({
            "height": 10,
            "radius/top": 0.05,
            "radius/bottom": 0.05,
        });
        this.cube = new Cube(this.scene);
        this.cube.create({
            "scale/x": 5.25,
            "scale/y": 0.75,
            "scale/z": 0.1,
        });

        this.textbox = new TextBox(this.scene);
        this.textbox.create({
            "scale/x": 5.25,
            "scale/y": 0.75,
            "scale/z": 0.1,
        });
        // this.text = new Text(this.scene);
        // this.text.create({
        //     // "translate/z": 0.1
        // });
        // this.sprite = new Sprite(this.scene);
        // this.sprite.create({
        //     "color/hue": 0.5
        // });
    }

    public scene: any;
    public light: any;
    public camera: any;
    public renderer: any;
    public controls: any;
    public width: number;
    public height: number;
    public cylinder: any;
    public sprite: any;
    public cube: any;
    public textbox: any;
    public text: any;

    public get aspect_ratio(): number {
        return this.width / this.height;
    }

    public create_scene() {
        this.scene = new THREE.Scene();
    }

    public create_light() {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        this.scene.add(light);
        this.light = light;
    }

    public create_camera() {
        // create camera
        const camera = new THREE.PerspectiveCamera(60, this.aspect_ratio, 0.1, 1000);

        // create view controls
        const orbit = new CreateOrbitControls(THREE);
        const controls = new orbit(camera);
        this.controls = controls;
        this.camera = camera;

        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 4;
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
}
