<template>
    <DappList listName="My Matches" :dapps="myMatches"></DappList>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DappList from '../components/DappList.vue'

export default defineComponent({
    components: {
        DappList
    },
    computed: {
        myMatches() {
            return this.$store.state.activeDapps;
        }
    }
})
</script>
