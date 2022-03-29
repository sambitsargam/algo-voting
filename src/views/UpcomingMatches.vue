<template>
    <DappList listName="Upcoming Voting" :dapps="upcomingMatches"></DappList>
    <DappList v-if="expiredMatches.length !== 0" listName="Past Votings" :dapps="expiredMatches"></DappList>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DappList from '../components/DappList.vue'

export default defineComponent({
    components: {
        DappList
    },
    computed: {
        upcomingMatches() {
            return this.$store.getters.activeDapps;
        },
        expiredMatches() {
            return this.$store.getters.expiredDapps;
        },
    }
})
</script>
