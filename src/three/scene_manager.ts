import * as _ from "lodash";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import * as CreateOrbitControls from "three-orbit-controls";
import MENLO_REGULAR from "../static/fonts/menlo_regular.json";
import { Box } from "./box";

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
    public boxes: object = {};
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
        const key: string = params.font_family + "_" + params.font_weight;
        const font = new THREE.Font(FONTS[key]);
        const geo = new THREE.TextGeometry(params.text, {
            font: font,
            size: 1,
            height: 0.01,
        });

        const material = new THREE.MeshBasicMaterial({
            color: 0xa4a4a4,
            transparent: true
        });
        const text = new THREE.Mesh(geo, material);
        this.scene.add(text);

        this.texts[text.uuid] = text;
        return text.uuid;
    }

    public create_box(): string {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7ec4cf,
            transparent: true
        });
        const box = new THREE.Mesh(geo, material);
        this.scene.add(box);

        this.boxes[box.uuid] = box;
        return box.uuid;
    }

    public get THREE() {
        return THREE;
    }

    public create_cylinder(): string {
        const geo = new THREE.CylinderGeometry(0.1, 0.1, 10, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true
        });
        const cylinder = new THREE.Mesh(geo, material);
        this.scene.add(cylinder);

        this.cylinders[cylinder.uuid] = cylinder;
        return cylinder.uuid;
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
