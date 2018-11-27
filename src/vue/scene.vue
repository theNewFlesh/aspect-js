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
    import { Scene as ThreeScene } from "../three/scene";
    // -------------------------------------------------------------------------

    @Component
    export default class Scene extends Vue {
        public scene;

        @Prop({ required: true })
        public width: number;

        @Prop({ required: true })
        public height: number;

        public created() {
            this.scene = new ThreeScene({
                width: this.width,
                height: this.height,
            });
        }

        public mounted() {
            const scn = this.scene;
            const elem = document.getElementById("scene");
            scn.render(elem);
            this.animate();
        }

        public animate() {
            requestAnimationFrame(this.animate);
            this.scene.render_update();
        }
    }
</script>

<style lang="less">
</style>
