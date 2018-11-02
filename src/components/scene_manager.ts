import * as _ from "lodash";
import * as THREE from "three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import * as CreateOrbitControls from "three-orbit-controls";
import * as uuidv4 from "uuid/v4";
// -----------------------------------------------------------------------------

export class SceneManager {
    public constructor(params: any) {
        this.width = params.width;
        this.height = params.height;
    }

    public scenes = {};
    public lights = {};
    public cameras = {};
    public edges = {};
    public nodes = {};

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
        const id: string = uuidv4();
        this.scenes[id] = scene;
        return id;
    }

    public create_node(): string {
        const geo = new THREE.BoxGeometry(3, 1, 0.2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7ec4cf
        });
        const node = new THREE.Mesh(geo, material);
        this.scene.add(node);

        const id: string = uuidv4();
        this.nodes[id] = node;
        return id;
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

        const id: string = uuidv4();
        this.edges[id] = edge;
        return id;
    }

    public create_camera(): string {
        // create camera
        const camera = new THREE.PerspectiveCamera(60, this.aspect_ratio, 0.1, 1000);

        // create view controls
        const OrbitControls = new CreateOrbitControls(THREE);
        const controls = new OrbitControls(camera);
        this.controls = controls;

        const id: string = uuidv4();
        this.cameras[id] = camera;
        return id;
    }

    public create_light(): string {
        const color = 0xffffff;
        const intensity: number = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        this.scene.add(light);

        const id: string = uuidv4();
        this.lights[id] = light;
        return id;
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
