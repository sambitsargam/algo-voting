<template>
  <button @click="toggle">{{ enabled ? '🌙' : '☀️' }}</button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType } from 'vue'

export default defineComponent({
  name: 'DarkModeSwitch',
  props: {
    initialState: {
      type: Boolean as PropType<boolean>,
      default: false,
    }
  },
  emits: ['switched'],
  setup(props, { emit }) {
    const enabled = ref(props.initialState)
    onMounted(() => {
      enabled.value = props.initialState
    })
    function toggle() {
      enabled.value = !enabled.value
      emit('switched', enabled.value)
    }
    return { enabled, toggle }
  }
})
</script>
