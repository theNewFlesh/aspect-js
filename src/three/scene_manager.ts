import * as _ from "lodash";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import * as CreateOrbitControls from "three-orbit-controls";
import * as MENLO_REGULAR from "../fonts/helvetiker_regular.json";
import { Cube } from "./cube";
import { Cylinder } from "./cylinder";
import { Text } from "./text";

const FONTS: object = {
    menlo_regular: MENLO_REGULAR,
}
// -----------------------------------------------------------------------------

export class SceneManager {
    public constructor(params: any) {
        this.width = params.width;
        this.height = params.height;
    }

    public scenes: object = {};
    public lights: object = {};
    public cameras: object = {};
    public cylinders: object = {};
    public cubes: object = {};
    public texts: object = {};

    public renderer;
    public controls;
    public width: number;
    public height: number;

    public get aspect_ratio(): number {
        return this.width / this.height;
    }

    // TODO: deeprecate this
    public get scene() {
        return this.scenes[_.keys(this.scenes)[0]];
    }

    // TODO: deeprecate this
    public get camera() {
        return this.cameras[_.keys(this.cameras)[0]];
    }

    public create_scene(): string {
        const scene = new THREE.Scene();
        this.scenes[scene.uuid] = scene;
        return scene.uuid;
    }

    public create_text(params: any) {
        const prim = new Text(this.scene);
        prim.create(params);

        this.texts['foo'] = prim;
        return 'ajksds';
    }

    public create_cube(): string {
        const prim = new Cube(this.scene);
        prim.create();

        this.cubes['foo'] = prim;
        return 'ajksds';
    }

    public get THREE() {
        return THREE;
    }

    public create_cylinder(): string {
        const prim = new Cylinder(this.scene);
        prim.create();

        this.cylinders['foo'] = prim;
        return 'ajksds';
    }

    public create_camera(): string {
        // create camera
        const camera = new THREE.PerspectiveCamera(60, this.aspect_ratio, 0.1, 1000);

        // create view controls
        const OrbitControls = new CreateOrbitControls(THREE);
        const controls = new OrbitControls(camera);
        this.controls = controls;

        this.cameras[camera.uuid] = camera;
        return camera.uuid;
    }

    public create_light(): string {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        this.scene.add(light);

        this.lights[light.uuid] = light;
        return light.uuid;
    }

    public update_item(id: string, type: string, params: any) {
        const item = this[type + "s"][id];
        const geo = item.geometry;

        // name
        item.name = params.name;

        // translate
        geo.translateX(params.translate.x);
        geo.translateY(params.translate.y);
        geo.translateZ(params.translate.z);

        // rotate
        geo.rotateX(params.rotate.x);
        geo.rotateY(params.rotate.y);
        geo.rotateZ(params.rotate.z);

        // scale
        geo.scale.x = params.scale.x;
        geo.scale.y = params.scale.y;
        geo.scale.z = params.scale.z;

        // color
        item.material.color.set(params.color);
        item.material.opacity = params.opacity;

        // visibility
        item.visible = params.visible;
    }

    public update_camera(id: string, params: any) {
        // set camera position
        const camera = this.cameras[id];
        camera.position.x = params.position.x;
        camera.position.y = params.position.y;
        camera.position.z = params.position.z;
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
}
