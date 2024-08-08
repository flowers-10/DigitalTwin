<template>
  <div class="w-screen h-screen flex justify-center items-center text-9xl" id="">
    <canvas class="webgl" ref="aa"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,onBeforeUnmount } from "vue";
import useThree from "@hook/useThree";
const canvasDom = ref();
const instance = ref();

onMounted(() => { 
  instance.value = useThree(canvasDom.value);
  instance.value.renderer.info()

});
onBeforeUnmount(() => {
  instance.value.dispose();
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
