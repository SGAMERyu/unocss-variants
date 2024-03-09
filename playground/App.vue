<script lang="ts" setup>
const test = defineUnoCssVariant({
  base: 'text-sm font-500 text-red',
})
</script>

<template>
  <div :class="test()">hello unocss variants</div>
</template>
