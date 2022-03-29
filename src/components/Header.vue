<template>
    <header>
        <h1>{{text}}</h1>
        
    </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: "Header",
    props: {
        text: String
    }
})
</script>
