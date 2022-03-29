<template>
    <DappList listName="My Vote" :dapps="myMatches"></DappList>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DappList from '../components/DappList.vue'

export default defineComponent({
    components: {
        DappList
    },
    watch: {
        myMatches() {
            console.log(this.myMatches)
        }
    },
    computed: {
        myMatches() {
            return this.$store.state.activeDapps;
        }
    }
})
</script>
