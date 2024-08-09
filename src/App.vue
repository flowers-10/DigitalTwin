<template>
  <div
    class="w-screen h-screen flex justify-center items-center text-9xl"
  >
    <canvas class="webgl" ref="canvasDom"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import useThree from "@hook/useThree";
const canvasDom = ref();
const instance = ref();

onMounted(() => {
  instance.value = useThree(canvasDom.value);
});
onBeforeUnmount(() => {
  instance.value.dispose();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
</style>
