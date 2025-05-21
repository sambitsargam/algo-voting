<template>
    <button 
        @click="$emit('on-click')"
        :style="{ background: color }"
    >
        {{ text }}
    </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Button',
    props: {
        color: String,
        text: String,
    },
    emits: ['on-click']
})
</script>

<style scoped>
button {
    display: inline-block;
    background: #000;
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    font-size: 15px;
    font-family: inherit;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover {
    background-color: #333;
    transform: scale(1.05);
}

button:active {
    background-color: #555;
    transform: scale(0.95);
}
</style>
