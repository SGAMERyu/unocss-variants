<script lang="ts">
interface Props {
  name: string
}
const props = defineProps<Props>()
</script>

<template>
  <div>hello unocss variants</div>
</template>

<style lang="ts">
defineUnocss({
  '123'
})
</style>
