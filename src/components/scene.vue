<template>
    <div id="scene" ref="scene">
    </div>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from "vue-property-decorator";
    import * as _ from "lodash";
    import * as THREE from "three";
    import { MeshLine, MeshLineMaterial } from "three.meshline";
    import * as CreateOrbitControls from "three-orbit-controls";

    @Component
    export default class Scene extends Vue {
        public _camera: any = null;
        public _scene: any = null;
        public _renderer: any = null;
        public _geometry: any = null;
        public _controls: any = null;

        @Prop({ required: true })
        public width: number;

        @Prop({ required: true })
        public height: number;

        private __init() {
            // create scene
            this._scene = new THREE.Scene();

            // create camera
            this._camera = new THREE.PerspectiveCamera(
                // 60, this.aspect_ratio, 0.1, 1000
                60, this.aspect_ratio, 0.1, 1000
            );

            // create view controls
            const OrbitControls = new CreateOrbitControls(THREE);
            this._controls = new OrbitControls(this._camera);

            // set camera position
            this._camera.position.x = 1;
            this._camera.position.y = 1;
            this._camera.position.z = 2;

            // create light
            const light = new THREE.DirectionalLight(0xffffff, 0.1);
            this._scene.add(light);

            // create cube
            this._geometry = new THREE.BoxGeometry(1, 1, 0.1);
            const material = new THREE.MeshBasicMaterial( { color: 0x444444 } );
            const cube = new THREE.Mesh(this._geometry, material );
            this._scene.add(cube);

            // create line geometry
            const line_geo = new THREE.Geometry();
            line_geo.vertices.push(new THREE.Vector3(-10, 0, 0));
            line_geo.vertices.push(new THREE.Vector3(10, 0, 0));

            // create line
            const line = new MeshLine();
            const line_width: number = 10;
            line.setGeometry(line_geo, function f(p) { return 0.1; });

            // assign line material
            const line_material = new MeshLineMaterial({
                color: new THREE.Color(0xff0000),
            });

            // draw line
            const line_mesh = new THREE.Mesh(line.geometry, line_material);
            this._scene.add(line_mesh);

            // render scene
            this._renderer = new THREE.WebGLRenderer({antialias: true});
            this._renderer.setSize(this.width, this.height);
            this._renderer.setClearColor(0x141414);
            this._renderer.setPixelRatio(window.devicePixelRatio);

            // mount scene
            const elem = document.getElementById("scene");
            elem.appendChild(this._renderer.domElement);
        }

        public _animate() {
            requestAnimationFrame(this._animate);
            this._controls.update();
            this._renderer.render(this._scene, this._camera);
        }

        public get aspect_ratio(): number {
            return this.width / this.height;
        }

        public mounted() {
            this.__init();
            this._animate();
        }
    }
</script>

<style scoped>
    canvas {
        width: 75vw;
        height: 75vh;
    }
</style>
