import * as _ from "lodash";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import * as CreateOrbitControls from "three-orbit-controls";
import MENLO_REGULAR from "../static/fonts/menlo_regular.json";

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
    public edges: object = {};
    public nodes: object = {};
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
            color: 0xA4A4A4,
            transparent: true
        });
        const text = new THREE.Mesh(geo, material);
        this.scene.add(text);

        this.texts[text.uuid] = text;
        return text.uuid;
    }

    public create_node(): string {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7ec4cf,
            transparent: true,
        });
        const node = new THREE.Mesh(geo, material);
        this.scene.add(node);

        this.nodes[node.uuid] = node;
        return node.uuid;
    }

    public update_node(id: string, params: any) {
        const node = this.nodes[id];
        const geo = node.geometry;

        // scale
        geo.scale.x = params.scale.x;
        geo.scale.x = params.scale.y;
        geo.scale.x = params.scale.z;

        // translate
        geo.translateX(params.translate.x);
        geo.translateY(params.translate.y);
        geo.translateZ(params.translate.z);

        // rotate
        geo.rotateX(params.rotate.x);
        geo.rotateY(params.rotate.y);
        geo.rotateZ(params.rotate.z);

        // color
        node.material.color.set(params.color);
    }

    public create_edge(): string {
        // create line geometry
        const geo = new THREE.Geometry();
        geo.vertices.push(new THREE.Vector3(0, 0, 0));
        geo.vertices.push(new THREE.Vector3(0, -10, 0));

        // create line
        const line = new MeshLine();
        const line_width: number = 10;

        function set_line_width(p) {
            return 0.1;
        }

        line.setGeometry(geo, set_line_width);

        // assign line material
        const line_material = new MeshLineMaterial({
            color: new THREE.Color(0x444444)
        });

        // draw line
        const edge = new THREE.Mesh(line.geometry, line_material);
        this.scene.add(edge);

        this.edges[edge.uuid] = edge;
        return edge.uuid;
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
