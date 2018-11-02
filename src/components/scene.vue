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
    import { SceneManager } from "./scene_manager";
    // -------------------------------------------------------------------------

    @Component
    export default class Scene extends Vue {
        public scene_manager;

        @Prop({ required: true })
        public width: number;

        @Prop({ required: true })
        public height: number;

        public created() {
            this.scene_manager = new SceneManager({
                width: this.width,
                height: this.height,
            })
        }

        public mounted() {
            const scn = this.scene_manager;
            scn.create_scene();
            const cam: string = scn.create_camera();
            scn.update_camera(
                cam,
                {
                    position: {
                        x: 1,
                        y: 1,
                        z: 2,
                    }
                }
            );
            scn.create_light();
            scn.create_node();
            scn.create_edge();

            const elem = document.getElementById("scene");
            scn.render(elem);
            this.animate();
        }

        public animate() {
            requestAnimationFrame(this.animate);
            this.scene_manager.render_update()
        }
    }
</script>

<style scoped>
    /* canvas {
        width: 75vw;
        height: 75vh;
    } */
</style>
