import * as vtu from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HelloWorld.vue", () => {
    it("run example test", () => {
        const msg = "banana";
        const wrapper = vtu.mount(HelloWorld, {
            propsData: { message: msg },
        });
        const vm = wrapper.vm;
        expect(vm.message).toMatch(msg);
    });
});
